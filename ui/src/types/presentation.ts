type Presentation = {
    id: string;
    presentation_date: string;
    team: string;
    assignee: string;
    title: string;
    content: string;
    status: "未アサイン" | "未発表" | "完了";
}

export type { Presentation };