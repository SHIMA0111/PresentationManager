import { Box, ClientOnly, Container, Flex } from "@chakra-ui/react";
import NavBar from "./nav-bar";
import { auth } from "@/auth";
import SessionHandler from "./session-handler";

export default async function AppLayout({ children } : { children: React.ReactNode }) {
    const session = await auth();
    
    return (
        <ClientOnly>
                <SessionHandler sessionError={session?.error} />
                <Flex h="100vh" flexDir="column">
                    <NavBar />
                    <Flex flex={1} overflow="hidden">
                        <Box as="main" flex={1} overflow="auto">
                            <Container mx="auto" py={10}>
                                {children}
                            </Container>
                        </Box>
                    </Flex>
                </Flex>
        </ClientOnly>
    )
}