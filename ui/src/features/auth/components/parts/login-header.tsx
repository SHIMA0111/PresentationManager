import { Box, Heading, Text } from "@chakra-ui/react";

export default function LoginHeader() {
    return (
        <Box textAlign="center" mb={8}>
            <Heading color="gray.800" as="h1" textStyle="xl">
                Presentation Manager
            </Heading>
            <Text color="gray.600" mt={2}>
                Management presentation planning simply and easily
            </Text>
        </Box>
    );
} 