"use client";
import { useSession } from "next-auth/react";
import { createContext } from "react";

type SessionData = NonNullable<ReturnType<typeof useSession>["data"]>;

export type Session =
  | (SessionData & {
      accessToken: NonNullable<SessionData["accessToken"]>;
      user: {
        name: NonNullable<SessionData["user"]["name"]>;
        image: NonNullable<SessionData["user"]["image"]>;
      };
    })
  | null;

export const AuthContext = createContext<Session>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  let value = data;
  if (data && (!data.accessToken || !data.user.name || !data.user.image))
    value = null;

  // @ts-expect-error
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}
