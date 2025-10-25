import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import React from "react";

interface SessionContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const SessionContext = React.createContext<SessionContextValue | undefined>(
  undefined,
);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = React.useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
    }),
    [session, loading],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = React.useContext(SessionContext);

  if (!context) {
    throw new Error(
      "useSessionContext deve ser utilizado dentro de um SessionProvider",
    );
  }

  return context;
};