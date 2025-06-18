"use client";
import { useContext } from "react";

import { AuthContext } from "@/presentation/providers/auth-context";

export function useAuth() {
  return useContext(AuthContext);
}
