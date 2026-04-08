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
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";

type AuthState = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseClientConfigured();

  const refreshUser = useCallback(async () => {
    if (!configured) return;
    const auth = getFirebaseAuth();
    const u = auth.currentUser;
    if (u) await u.reload();
    setUser(auth.currentUser);
  }, [configured]);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      setUser(null);
      return;
    }
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [configured]);

  const value = useMemo(
    () => ({ user, loading, configured, refreshUser }),
    [user, loading, configured, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useFirebaseAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider");
  }
  return ctx;
}
