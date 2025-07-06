type Presentation = {
    id: string;
    date: string;
    team: string;
    speaker: string;
    title: string;
    content: string;
    status: "未アサイン" | "未発表" | "完了";
}

export type { Presentation };