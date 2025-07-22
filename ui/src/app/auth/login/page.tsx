"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
    const { data: session, status } = useSession();
    
    useEffect(() => {
        if (status === "loading") return;
        if (session?.user) {
            redirect("/");
        } else {
            signIn("keycloak", {
                redirect: true,
                redirectTo: "/",
            });
        }
    }, [status, session]);

    return null;
}