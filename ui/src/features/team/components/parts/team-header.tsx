import { Flex, Heading } from "@chakra-ui/react";

export default function TeamHeader() {
    return (
        <Flex justify="space-between" align="center" mb={8}>
            <Heading as="h1" textStyle="2xl" fontWeight="bold">
                チーム管理
            </Heading>
        </Flex>
    );
} 