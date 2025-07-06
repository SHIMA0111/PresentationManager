import { Grid } from "@chakra-ui/react";
import CardWithButton from "./parts/card-with-button";
import { useHome } from "../hooks/use-home";
import HomeHeader from "./parts/home-header";

export default function Home() {
    const { cards } = useHome();

    return (
        <>
            <HomeHeader />
            <Grid 
                templateColumns={{ 
                    base: "repeat(1, minmax(0, 1fr))", 
                    md: "repeat(3, minmax(0, 1fr))" 
                }} 
                gap={6} 
            >
                {cards.map((card) => (
                    <CardWithButton
                        key={card.href}
                        title={card.title}
                        description={card.description}
                        href={card.href}
                        buttonText={card.buttonText}
                        icon={card.icon}
                    />
                ))}
            </Grid>
        </>
    )
}