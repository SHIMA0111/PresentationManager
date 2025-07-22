"use client";
import { Button } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export const KeycloakLoginButton = () => {
    const handleKeycloakLogin = async () => {
        await signIn('keycloak', {
            redirectTo: "/",
            redirect: true,
        });
    };

    return (
        <Button
            type="button"
            onClick={handleKeycloakLogin}
            width="full"
        >
            Signin with Keycloak
        </Button>
    );
};
