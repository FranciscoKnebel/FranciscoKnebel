/** Preferences are optional: blocked storage must not break page controls. */
export function readPreference(key: string, session = false): string | null {
  try {
    return (session ? window.sessionStorage : window.localStorage).getItem(key);
  } catch {
    return null;
  }
}

export function savePreference(key: string, value: string, session = false): void {
  try {
    (session ? window.sessionStorage : window.localStorage).setItem(key, value);
  } catch {
    // The current page still honors the choice even when it cannot be persisted.
  }
}
