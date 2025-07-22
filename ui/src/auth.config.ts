import { Account, NextAuthConfig, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";
import { signOut } from "./auth";

async function refreshToken(token: JWT) {
    try {
        const url = `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.AUTH_KEYCLOAK_ID!,
                client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken!,
            })
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            error: undefined,
        };
    } catch (error: any) {
        if (error.error === "invalid_grant" && error.error_description === "Token is not active") {
            return {
                ...token,
                error: "TokenDeactivated",
            }
        }

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

export const authConfig = {
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        authorized({ auth }: { auth: Session | null }) {
            if (!auth?.user) {
                return false;
            }

            return true;
        },
        jwt: async ({ token, account }: { token: JWT, account?: Account | null }) => {
            if (account) {
                token.idToken = account.id_token;
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
                token.id = account.userId;

                return token;
            }

            if (Date.now() < token.expiresAt!) {
                return token;
            }

            return refreshToken(token);
        },
        session: async ({ session, token }: { session: Session, token: JWT }) => {
            session.accessToken = token.accessToken as string;

            if (!session.user) {
                session.user = {} as User;
            }
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;

            session.error = token.error;

            return session;
        }
    },
    providers: [
        Keycloak({
            clientId: process.env.AUTH_KEYCLOAK_ID!,
            clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
            issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
        }),
    ],
} satisfies NextAuthConfig;