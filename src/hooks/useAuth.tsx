"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isAuthExpiredError, logSupabaseError } from "@/lib/auth/errors";

type AuthState = {
  user: User | null;
  session: Session | null;
  /** False until the first getSession() completes — prevents logged-out UI flash. */
  isHydrated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  /** Call after JWT/expired errors: sign out and hard-navigate to login. */
  handleExpiredSession: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const handleExpiredSession = useCallback(async () => {
    logSupabaseError("session expired — signing out", {
      message: "JWT/session expired",
    });
    try {
      await supabase.auth.signOut();
    } catch (error) {
      logSupabaseError("signOut during expired-session handling", error);
    }
    // Full page load so middleware and client share clean cookie state.
    // Hard reload clears cookie/middleware race after JWT expiry
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional full reload
    window.location.href = "/login?reason=session_expired";
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        logSupabaseError("getSession on hydrate", error);
        if (isAuthExpiredError(error)) {
          void handleExpiredSession();
          return;
        }
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsHydrated(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsHydrated(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, handleExpiredSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        logSupabaseError("signInWithPassword", error, { email });
        return { error: error.message };
      }
      // Wait for session before any redirect — prevents auth redirect loops.
      if (!data.session) {
        return { error: "Sign-in succeeded but no session was returned." };
      }
      setSession(data.session);
      setUser(data.session.user);
      setIsHydrated(true);
      return { error: null };
    },
    [supabase],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        logSupabaseError("signUp", error, { email });
        return { error: error.message };
      }
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsHydrated(true);
      }
      return { error: null };
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      logSupabaseError("signOut", error);
    }
    setSession(null);
    setUser(null);
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional full reload after signOut
    window.location.href = "/login";
  }, [supabase]);

  const value = useMemo(
    () => ({
      user,
      session,
      isHydrated,
      signIn,
      signUp,
      signOut,
      handleExpiredSession,
    }),
    [user, session, isHydrated, signIn, signUp, signOut, handleExpiredSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
