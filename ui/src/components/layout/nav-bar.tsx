"use client";
import { Box, Button, Flex, Icon, Link } from "@chakra-ui/react";
import { LuLogOut, LuSettings } from "react-icons/lu";

export default function NavBar() {
    return (
        <Flex 
            as="header"
            py={3}
            px={6}
            align="center"
            justify="space-between"
            bg="gray.800"
        >
            <Flex  
                align="center" 
                gap={3}
            >
                <Link href="/" textStyle="xl" fontWeight="bold" color="whiteAlpha.800">
                    発表管理システム
                </Link>
                <Box as="nav" display={{ base: "none", md: "flex"}} gap={6}>
                    <Link href="/presentations" textStyle="sm" color="whiteAlpha.800">
                        発表一覧
                    </Link>
                    <Link href="/team" textStyle="sm" color="whiteAlpha.800">
                        チーム管理
                    </Link>
                    <Link href="/user" textStyle="sm" color="whiteAlpha.800">
                        発表管理
                    </Link>
                </Box>
            </Flex>
            <Flex align="center" gap={4}>
                <Link href="/settings">
                    <Icon as={LuSettings} />
                </Link>
                <Button 
                    variant="outline" 
                    size="sm" 
                    color="whiteAlpha.700" 
                    borderColor="whiteAlpha.300" 
                    _hover={{
                        bg: "whiteAlpha.100",
                    }}>
                        <Icon as={LuLogOut} />
                        Logout
                    </Button>
            </Flex>
        </Flex>
    )
}