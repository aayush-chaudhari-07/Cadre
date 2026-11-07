import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import type { QueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { clearRememberSession, getAuthenticatedUser } from "@/lib/auth-session";

type AuthSession = {
  user: User | null;
  ready: boolean;
};

const AuthSessionContext = createContext<AuthSession>({ user: null, ready: false });

export function useAuthSession() {
  return useContext(AuthSessionContext);
}

export function AuthSessionProvider({
  children,
  queryClient,
}: {
  children: ReactNode;
  queryClient: QueryClient;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;

      setUser(session?.user ?? null);
      if (event === "SIGNED_OUT") {
        clearRememberSession();
      } else {
        void queryClient.invalidateQueries();
      }
      void router.invalidate();
    });

    void getAuthenticatedUser().then((currentUser) => {
      if (!active) return;
      setUser(currentUser);
      setReady(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient, router]);

  return (
    <AuthSessionContext.Provider value={{ user, ready }}>
      {children}
    </AuthSessionContext.Provider>
  );
}