import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { 
        strategy: "jwt",
        maxAge: Number(process.env.AUTH_KEYCLOAK_SESSION_MAX_AGE) || 2592000,
        updateAge: Number(process.env.AUTH_KEYCLOAK_SESSION_UPDATE_AGE) || 1800,
    },
    ...authConfig,
});