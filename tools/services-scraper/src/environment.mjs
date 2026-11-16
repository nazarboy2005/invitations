// A positive list: never pass app secrets, NODE_OPTIONS, proxy settings, custom
// CA/SSL settings or dynamic library injection variables to untrusted collectors.
const allowed = new Set([
  "PATH",
  "PATHEXT",
  "SYSTEMROOT",
  "WINDIR",
  "COMSPEC",
  "SYSTEMDRIVE",
  "TEMP",
  "TMP",
  "TMPDIR",
  "HOME",
  "USERPROFILE",
  "HOMEDRIVE",
  "HOMEPATH",
  "LOCALAPPDATA",
  "APPDATA",
  "PROGRAMFILES",
  "PROGRAMFILES(X86)",
  "PROGRAMW6432",
  "DISPLAY",
  "WAYLAND_DISPLAY",
  "XDG_RUNTIME_DIR",
  "XDG_CACHE_HOME",
  "LANG",
  "LC_ALL",
  "TZ",
  "PLAYWRIGHT_BROWSERS_PATH",
]);

export function scraperEnvironment(source = process.env) {
  return Object.fromEntries(
    Object.entries(source).filter(
      ([key, value]) => value !== undefined && allowed.has(key.toUpperCase()),
    ),
  );
}
