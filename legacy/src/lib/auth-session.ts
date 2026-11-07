import { supabase } from "@/integrations/supabase/client";

const SESSION_MODE_KEY = "flowmind.session-mode";
const ACTIVE_TAB_KEY = "flowmind.active-tab";

export function setRememberSession(remember: boolean) {
  if (typeof window === "undefined") return;

  if (remember) {
    window.localStorage.removeItem(SESSION_MODE_KEY);
    window.sessionStorage.removeItem(ACTIVE_TAB_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_MODE_KEY, "tab-only");
  window.sessionStorage.setItem(ACTIVE_TAB_KEY, "active");
}

export function clearRememberSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_MODE_KEY);
  window.sessionStorage.removeItem(ACTIVE_TAB_KEY);
}

function hasExpiredTabSession() {
  return (
    typeof window !== "undefined" &&
    window.localStorage.getItem(SESSION_MODE_KEY) === "tab-only" &&
    window.sessionStorage.getItem(ACTIVE_TAB_KEY) !== "active"
  );
}

export async function getAuthenticatedUser() {
  if (typeof window === "undefined") return null;

  if (hasExpiredTabSession()) {
    clearRememberSession();
    await supabase.auth.signOut();
    return null;
  }

  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}