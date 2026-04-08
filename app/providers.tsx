"use client";

import type { ReactNode } from "react";
import { FirebaseAuthProvider } from "@/app/components/FirebaseAuthProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}
