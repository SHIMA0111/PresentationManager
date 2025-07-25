"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

type SessionHandlerProps = {
    sessionError?: string;
}

/// This component is used to log out the user if the session deactivated by IdP (keycloak) 
export default function SessionHandler({ sessionError }: SessionHandlerProps) {
    useEffect(() => {
        if (sessionError === "TokenDeactivated") {
            signOut({
                redirect: true,
                callbackUrl: "/auth/login",
            });
        }
    }, [sessionError]);

    return null;
} 