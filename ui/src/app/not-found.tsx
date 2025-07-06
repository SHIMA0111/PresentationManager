"use client";

import { useColorModeValue } from "@/components/ui/color-mode";
import Divider from "@/components/ui/divider";
import { Box, Button, Card, Flex, Heading, Icon, Link, Text, VStack } from "@chakra-ui/react";
import { LuArrowLeft, LuFileX, LuHourglass } from "react-icons/lu";
import { usePathname } from "next/navigation";

export default function NotFound() {
    const bgGradientFrom = useColorModeValue("gray.50", "gray.900");
    const bgGradientTo = useColorModeValue("gray.100", "gray.800");
    const iconColor = useColorModeValue("gray.500", "gray.400");
    const iconBg = useColorModeValue("gray.100", "gray.800");
    const titleColor = useColorModeValue("gray.800", "gray.200");
    const textColor = useColorModeValue("gray.500", "gray.400");

    const pathname = usePathname();

    return (
        <Flex 
            minH="100vh"
            align="center"
            justify="center"
            bgGradient="to-br"
            gradientFrom={bgGradientFrom}
            gradientTo={bgGradientTo}
            p={4}
        >
            <Card.Root w="full" maxW="md" shadow="lg" animation="ease-in">
                <Card.Body 
                    p={8} 
                    textAlign="center" 
                    spaceY={6}
                >
                    <Box position="relative">
                        <Flex
                            w={32}
                            h={32}
                            mx="auto"
                            bg={iconBg}
                            rounded="full"
                            align="center"
                            justify="center"
                            animation="pulse"
                        >
                            <Icon 
                                as={LuFileX} 
                                color={iconColor}
                                w={16} 
                                h={16}
                                animation="bounce"
                                animationDelay="0.5s"
                            />
                        </Flex>
                        <Flex 
                            position="absolute" 
                            top={-2} 
                            right={-2} 
                            align="center"
                            justify="center"
                            w={6} 
                            h={6} 
                            bg="red.500"  
                            rounded="full"
                            animation="ping"
                        >
                            <Box 
                                w={2}
                                h={2}
                                bg="red.400"
                                rounded="full"    
                            />
                        </Flex>
                    </Box>

                    <Box spaceY={2} textAlign="center">
                        <Heading as="h1" textStyle="2xl" color={titleColor}>
                            404
                        </Heading>
                        <Heading as="h2" textStyle="lg" color={titleColor}>
                            Page Not Found
                        </Heading>
                        <Text color={textColor}>
                            The page you are looking for does not exist or has been moved.
                            Please check the URL or go back to the homepage.
                        </Text>
                    </Box>

                    <Box spaceY={3}>
                        <Button asChild>
                            <Link 
                                href="/" 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center" 
                                gap={2}
                            >
                                <Icon as={LuArrowLeft} />
                                Go Back Home
                            </Link>
                        </Button>
                    </Box>
                </Card.Body>
                <Card.Footer alignItems="center" justifyContent="center">
                    <Flex 
                        direction="column" 
                        spaceY={2} 
                        w="full"
                        color={textColor}
                    >
                        <Divider text="" />
                        <Text 
                            color={textColor} 
                            fontSize="sm" 
                            textAlign="center">
                            If you need assistance, please contact support.
                        </Text>
                        <Text 
                            color={textColor} 
                            fontSize="sm" 
                            textAlign="center">
                            Requested URL: {pathname}
                        </Text>
                    </Flex>
                </Card.Footer>
            </Card.Root>
        </Flex>
    )
}