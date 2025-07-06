import { Box, Flex } from "@chakra-ui/react";

export default function Divider({ text }: { text: string }) {
    return (
        <Box position="relative" w="full">
            <Flex position="absolute" inset={0} align="center">
                <Box w="full" borderTop=".5px solid" borderColor="gray.400" />
            </Flex>
            <Flex justify="center" fontSize="xs" textTransform="uppercase">
                <Box bg="white" px={2} color="gray.500" zIndex={1}>{text}</Box>
            </Flex>
        </Box>
    )
}