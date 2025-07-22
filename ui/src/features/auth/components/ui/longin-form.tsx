"use client"

import {Box, Button, Card, Flex, VStack} from "@chakra-ui/react";
import GoogleLoginButton from "./parts/google-login-button";
import Divider from "@/components/ui/divider";
import { useLoginForm } from "../../hooks/use-login-form";
import LoginHeader from "../parts/login-header";
import LoginFormFields from "../parts/login-form-fields";
import { KeycloakLoginButton } from "./parts/keycloak-login-button";

export default function LoginForm() {
    const {
        email,
        password,
        showPassword,
        isLoading,
        handleSubmit,
        handleTogglePassword,
        handleEmailChange,
        handlePasswordChange,
    } = useLoginForm();

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
            <Box w="full" maxW="md">
                <LoginHeader />

                <Card.Root shadow="md" border="1px solid" borderColor="gray.200" borderRadius="lg" bg="white">
                    <Card.Header spaceY={1}>
                        <Card.Title textAlign="center" textStyle="2xl" color="gray.800">
                            Login to your account!
                        </Card.Title>
                        <Card.Description textAlign="center" color="gray.500">
                            Login to your account to manage your presentations!
                        </Card.Description>
                    </Card.Header>
                    <Card.Body spaceY={4}>
                        <LoginFormFields
                            email={email}
                            password={password}
                            showPassword={showPassword}
                            isLoading={isLoading}
                            onEmailChange={handleEmailChange}
                            onPasswordChange={handlePasswordChange}
                            onTogglePassword={handleTogglePassword}
                        />
                    </Card.Body>
                    <Card.Footer>
                        <VStack gap={4} w="full">
                            <Button 
                                onClick={handleSubmit} 
                                type="button" 
                                w="full" 
                                loading={isLoading}
                                disabled={isLoading}
                                bg="gray.800"
                                color="white"
                                _hover={{
                                    bg: "gray.700"
                                }}
                            >
                                Login
                            </Button>
                            <KeycloakLoginButton />
                            <Divider text="Or" />
                            <GoogleLoginButton />
                        </VStack>
                    </Card.Footer>
                </Card.Root>
            </Box>
        </Flex>
    );
}