"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

type Guard = {
  mark: (id: string, dirty: boolean) => void;
  leave: (action: () => void) => void;
};
const Context = createContext<Guard | null>(null);
export function AdminNavigationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const dirty = useRef(new Set<string>());
  const [pending, setPending] = useState<(() => void) | null>(null);
  const mark = useCallback((id: string, value: boolean) => {
    if (value) dirty.current.add(id);
    else dirty.current.delete(id);
  }, []);
  const leave = useCallback((action: () => void) => {
    if (dirty.current.size) setPending(() => action);
    else action();
  }, []);
  return (
    <Context.Provider value={{ mark, leave }}>
      <div
        onClickCapture={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            !dirty.current.size
          )
            return;
          const anchor = (event.target as Element).closest<HTMLAnchorElement>(
            "a[href]",
          );
          if (
            !anchor ||
            anchor.target === "_blank" ||
            anchor.hasAttribute("download")
          )
            return;
          const url = new URL(anchor.href, window.location.href);
          if (
            url.href === window.location.href ||
            (url.pathname === window.location.pathname &&
              url.search === window.location.search &&
              url.hash)
          )
            return;
          event.preventDefault();
          event.stopPropagation();
          leave(() => window.location.assign(url.href));
        }}
      >
        {children}
      </div>
      {pending && (
        <ConfirmationDialog
          title="Saqlanmagan o‘zgarishlar bor"
          description="Davom etsangiz, saqlanmagan o‘zgarishlar yo‘qoladi. Sahifada qolib, avval ularni saqlashingiz mumkin."
          confirmLabel="Saqlamasdan davom etish"
          cancelLabel="Sahifada qolish"
          onCancel={() => setPending(null)}
          onConfirm={() => {
            const action = pending;
            setPending(null);
            action();
          }}
        />
      )}
    </Context.Provider>
  );
}
export function useAdminDirty(dirty: boolean) {
  const guard = useContext(Context);
  const id = useId();
  const mark = guard?.mark;
  useEffect(() => {
    mark?.(id, dirty);
    return () => mark?.(id, false);
  }, [id, dirty, mark]);
  return guard?.leave ?? ((action: () => void) => action());
}
