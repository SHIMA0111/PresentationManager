import { Flex, Text } from "@chakra-ui/react";

export default function EmptyState() {
    return (
        <Flex justifyContent="center" alignItems="center" h="100%">
            <Text>データがありません</Text>
        </Flex>
    );
} 