import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        accessToken: string;
        user: DefaultSession["user"];
        error?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        accessToken?: string;
        refreshToken?: string;
        idToken?: string;
        expiresAt?: number;
        error?: string;
        id?: string;
        name?: string;
        email?: string;
    }
}