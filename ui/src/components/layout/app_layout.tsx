import { Box, ClientOnly, Container, Flex } from "@chakra-ui/react";
import NavBar from "./nav-bar";

export default function AppLayout({ children } : { children: React.ReactNode }) {
    return (
        <ClientOnly>
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