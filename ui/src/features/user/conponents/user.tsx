"use client";

import { Presentation } from "@/types/presentation";
import { Box, Flex, Heading, Icon, Tabs, Text } from "@chakra-ui/react";
import { LuBookCheck, LuCalendar, LuList } from "react-icons/lu";
import ItemAccordions from "./parts/item-accordions";
import { useMemo } from "react";

const data: Presentation[] = [
    {
        id: crypto.randomUUID(),
        date: "2025-06-29 11:00",
        team: "チームA",
        speaker: "発表者A",
        title: "発表タイトルA",
        content: "発表内容A",
        status: "完了",
    },
    {
        id: crypto.randomUUID(),
        date: "2025-06-29 11:00",
        team: "チームB",
        speaker: "発表者B",
        title: "",
        content: "発表内容B",
        status: "未発表",
    },
    {
        id: crypto.randomUUID(),
        date: "2025-07-01 12:00",
        team: "チームC",
        speaker: "発表者C",
        title: "発表タイトルC",
        content: "発表内容C",
        status: "完了",
    },
    {
        id: crypto.randomUUID(),
        date: "2025-07-06 12:00",
        team: "チームC",
        speaker: "発表者C",
        title: "発表タイトルC",
        content: "発表内容C",
        status: "未発表",
    },
]

export default function User() {
    const defaultOpen = useMemo(() => {
        const untitled = data.filter((item) => item.title === "");
        return untitled.map((item) => item.id);
    }, data);

    return (
        <>
            <Flex justify="space-between" align="center" mb={8}>
                <Box spaceY={2}>
                    <Heading as="h1" textStyle="2xl">
                        自分の発表一覧
                    </Heading>
                    <Text>
                        自分がアサインされた発表の設定を行うことができます。
                    </Text>
                </Box>
            </Flex>

            <Tabs.Root defaultValue="all" variant="plain">
                <Tabs.List bg="bg.muted" rounded={13} p={1}>
                    <Tabs.Trigger value="all">
                        <Icon as={LuList} /> 全て
                    </Tabs.Trigger>
                    <Tabs.Trigger value="future">
                        <Icon as={LuCalendar} /> 未発表
                    </Tabs.Trigger>
                    <Tabs.Trigger value="past">
                        <Icon as={LuBookCheck} /> 過去の発表
                    </Tabs.Trigger>
                    <Tabs.Indicator rounded={12} />
                </Tabs.List>
                <Tabs.Content value="all">
                    <ItemAccordions data={data} defaultOpen={defaultOpen} />
                </Tabs.Content>
                <Tabs.Content value="future">
                    <ItemAccordions data={data.filter((item) => item.status === "未発表")} defaultOpen={defaultOpen} />
                </Tabs.Content>
                <Tabs.Content value="past">
                    <ItemAccordions data={data.filter((item) => item.status === "完了")} defaultOpen={defaultOpen} />
                </Tabs.Content>
            </Tabs.Root>
        </>
    )
}