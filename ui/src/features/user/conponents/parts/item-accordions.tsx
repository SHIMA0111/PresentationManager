import { Accordion, Icon, Flex, HStack, Text } from "@chakra-ui/react";
import AccordionCard from "./accordion-card";
import { LuCalendar } from "react-icons/lu";
import { Presentation } from "@/types/presentation";
import { IoWarningOutline } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";

interface ItemAccordionsProps {
    data: Presentation[];
    defaultOpen: string[];
}

export default function ItemAccordions({ data, defaultOpen }: ItemAccordionsProps) {
    return (
        <Accordion.Root multiple defaultValue={defaultOpen}>
            {data.map((item) => (
                <Accordion.Item key={item.id} value={item.id}>
                    <Accordion.ItemTrigger>
                        <HStack color={defaultOpen.includes(item.id) ? "red.500" : undefined}>
                            {
                                defaultOpen.includes(item.id) && (
                                    <Flex>
                                        <Tooltip 
                                            content="発表内容が入力されていません。入力してください。"
                                            openDelay={0}
                                            closeDelay={0}
                                        >
                                            <Icon as={IoWarningOutline} color="red.500" w={4} h={4} />
                                        </Tooltip>
                                    </Flex>
                                )
                            }
                            <Flex align="center" spaceX={2}>
                                <Icon as={LuCalendar} />
                                <Text>{item.date}</Text>
                            </Flex>
                            <Flex align="center" spaceX={2}>
                                <Text>{item.title}</Text>
                            </Flex>
                        </HStack>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                        <AccordionCard presentation={item} />
                    </Accordion.ItemContent>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    )
}