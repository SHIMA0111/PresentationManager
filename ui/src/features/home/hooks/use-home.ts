import React from "react";
import { LuCalendar, LuUser, LuUsers } from "react-icons/lu";

export interface HomeCardData {
    title: string;
    description: string;
    href: string;
    buttonText: string;
    icon: React.ReactElement;
}

export function useHome() {
    const cards: HomeCardData[] = [
        {
            title: "発表一覧",
            description: "発表一覧を表示します。",
            href: "/presentations",
            buttonText: "発表一覧を確認",
            icon: React.createElement(LuCalendar),
        },
        {
            title: "チーム管理",
            description: "チームの管理を行います。",
            href: "/team",
            buttonText: "チーム管理",
            icon: React.createElement(LuUsers),
        },
        {
            title: "自分の発表",
            description: "自分の発表を管理できます。",
            href: "/user",
            buttonText: "自分の発表を管理",
            icon: React.createElement(LuUser),
        },
    ];

    return {
        cards,
    };
} 