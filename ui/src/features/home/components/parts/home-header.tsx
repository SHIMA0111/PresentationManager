import { Heading } from "@chakra-ui/react";

export default function HomeHeader() {
    return (
        <Heading 
            as="h1" 
            textStyle="2xl" 
            fontWeight="bold" 
            textAlign="center" 
            mb={8}
        >
            発表管理システム
        </Heading>
    );
} 