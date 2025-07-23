import { useState } from "react";
import { Presentation } from "@/types/presentation";

const team = "チームA";

const initialData: Presentation[] = [
    {
        id: crypto.randomUUID(),
        presentation_date: "2025-06-22 10:00",
        team: "チームA",
        assignee: "発表者A",
        title: "発表タイトルA",
        content: "発表内容A",
        status: "完了",
    },
    {
        id: crypto.randomUUID(),
        presentation_date: "2025-06-29 11:00",
        team: "チームB",
        assignee: "発表者B",
        title: "発表タイトルB",
        content: "発表内容B",
        status: "未発表",
    },
    {
        id: crypto.randomUUID(),
        presentation_date: "2025-07-06 12:00",
        team: "チームC",
        assignee: "発表者C",
        title: "発表タイトルC",
        content: "発表内容C",
        status: "未アサイン",
    }
];

const teamMembers = [
    {
        id: crypto.randomUUID(),
        name: "John Doe",
        email: "john.doe@example.com",
    },
    {
        id: crypto.randomUUID(),
        name: "Jane Doe",
        email: "jane.doe@example.com",
    },
    {
        id: crypto.randomUUID(),
        name: "Taro Yamada",
        email: "taro.yamada@example.com",
    },
    {
        id: crypto.randomUUID(),
        name: "Jiro Yamada",
        email: "jiro.yamada@example.com",
    }
];

export function useTeam() {
    const [unassignPresentations, setUnassignPresentations] = useState<number>(0);
    const [isTeamAdmin, setIsTeamAdmin] = useState<boolean>(true);

    const handleIncrementUnassign = () => {
        setUnassignPresentations(unassignPresentations + 1);
    };

    return {
        team,
        data: initialData,
        teamMembers,
        unassignPresentations,
        isTeamAdmin,
        setIsTeamAdmin,
        handleIncrementUnassign,
    };
} 