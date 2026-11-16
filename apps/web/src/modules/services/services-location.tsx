"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { validCoordinates, type ServiceCoordinates } from "./service-distance";

type LocationState = {
  position: ServiceCoordinates | null;
  loading: boolean;
  error: string;
};
const initialState: LocationState = {
  position: null,
  loading: false,
  error: "",
};
const LocationContext = createContext<
  | (LocationState & {
      requestLocation: () => Promise<boolean>;
    })
  | null
>(null);

/** Memory only, scoped to Services navigation. Never persists or sends coordinates. */
export function ServicesLocationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState(initialState);
  const watch = useRef<number | null>(null);
  const generation = useRef(0);
  const pending = useRef<((success: boolean) => void) | null>(null);
  const authorized = useRef(false);

  const stop = useCallback(() => {
    generation.current++;
    if (watch.current !== null) navigator.geolocation.clearWatch(watch.current);
    watch.current = null;
    pending.current?.(false);
    pending.current = null;
  }, []);

  const requestLocation = useCallback((): Promise<boolean> => {
    stop();
    setState({ position: null, loading: true, error: "" });
    if (!window.isSecureContext || !navigator.geolocation) {
      setState({
        ...initialState,
        error:
          "Brauzeringizda joylashuvni aniqlash imkoni yo‘q. Hududni tanlang.",
      });
      return Promise.resolve(false);
    }
    const current = generation.current;
    return new Promise((resolve) => {
      pending.current = resolve;
      const fail = (code: number) => {
        if (generation.current !== current) return;
        if (code === 1) authorized.current = false;
        setState({
          ...initialState,
          error:
            code === 1
              ? "Joylashuvga ruxsat berilmadi. Brauzer sozlamalarida ruxsat bering yoki hududni tanlang."
              : code === 3
                ? "Joylashuvni aniqlash vaqti tugadi. Qayta urinib ko‘ring yoki hududni tanlang."
                : "Joylashuvni aniqlab bo‘lmadi. Qayta urinib ko‘ring yoki hududni tanlang.",
        });
        pending.current?.(false);
        pending.current = null;
        // Transient failures may recover on the next fresh position update.
        if (code === 1) stop();
      };
      try {
        watch.current = navigator.geolocation.watchPosition(
          ({ coords }) => {
            if (generation.current !== current) return;
            if (!validCoordinates(coords)) return fail(2);
            authorized.current = true;
            setState({
              position: {
                latitude: coords.latitude,
                longitude: coords.longitude,
              },
              loading: false,
              error: "",
            });
            pending.current?.(true);
            pending.current = null;
          },
          (error) => fail(error.code),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 },
        );
      } catch {
        fail(2);
      }
    });
  }, [stop]);

  useEffect(() => {
    let disposed = false;
    let permission: PermissionStatus | null = null;
    const permissionChanged = () => {
      if (disposed || !permission) return;
      if (permission.state === "granted") {
        authorized.current = true;
        if (!document.hidden && watch.current === null) void requestLocation();
      } else {
        authorized.current = false;
        stop();
        setState({
          ...initialState,
          error:
            permission.state === "denied"
              ? "Joylashuvga ruxsat berilmadi. Brauzer sozlamalarida ruxsat bering yoki hududni tanlang."
              : "",
        });
      }
    };
    // Querying permission does not open a prompt. Only an explicit dropdown
    // selection requests access when permission has not already been granted.
    if (navigator.permissions) {
      void navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (disposed) return;
          permission = result;
          permission.addEventListener("change", permissionChanged);
          if (permission.state === "granted") permissionChanged();
        })
        .catch(() => {
          /* Some browsers do not expose geolocation permission state. */
        });
    }
    const visibilityChanged = () => {
      // Discard the last reading while away and request a fresh one on return.
      if (document.hidden) {
        stop();
        setState(initialState);
      } else if (
        authorized.current &&
        (!permission || permission.state === "granted")
      ) {
        void requestLocation();
      }
    };
    document.addEventListener("visibilitychange", visibilityChanged);
    return () => {
      disposed = true;
      permission?.removeEventListener("change", permissionChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      stop();
    };
  }, [requestLocation, stop]);

  return (
    <LocationContext.Provider value={{ ...state, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useServicesLocation() {
  const value = useContext(LocationContext);
  if (!value) throw new Error("ServicesLocationProvider is required");
  return value;
}
