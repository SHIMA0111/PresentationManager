import { Button, Card, Link } from "@chakra-ui/react";

interface CardWithButtonProps {
    title: string;
    description: string;
    href: string;
    buttonText: string;
    icon?: React.ReactElement;
}

export default function CardWithButton({ title, description, href, buttonText, icon }: CardWithButtonProps) {
    return (
        <Card.Root 
            borderColor="gray.200" 
            shadow="sm" 
        >
            <Card.Header>
                <Card.Title display="flex" alignItems="center" gap={2}>
                    {icon}
                    {title}
                </Card.Title>
                <Card.Description>
                    {description}
                </Card.Description>
            </Card.Header>
            <Card.Body>
                <Button
                    asChild
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    _hover={{
                        bg: "gray.600",
                    }}
                >
                    <Link href={href}>
                        {buttonText}
                    </Link>
                </Button>
            </Card.Body>
        </Card.Root>
    )
}