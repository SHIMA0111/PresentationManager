import { useState } from "react";
import { Presentation } from "@/types/presentation";
import { toaster } from "@/components/ui/toaster";

const initialData: Presentation[] = [
    {
        id: crypto.randomUUID(),
        date: "2025-06-22 10:00",
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
        title: "発表タイトルB",
        content: "発表内容B",
        status: "未発表",
    },
    {
        id: crypto.randomUUID(),
        date: "2025-07-06 12:00",
        team: "チームC",
        speaker: "発表者C",
        title: "発表タイトルC",
        content: "発表内容C",
        status: "未アサイン",
    }
];

export function usePresentations() {
    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState<Presentation | undefined>(undefined);
    const [presentations, setPresentations] = useState<Presentation[]>(initialData);

    const onOpenChange = (open: boolean) => {
        setIsOpen(open);
        setEditData(undefined);
    }

    const onEdit = (id: string) => {
        const selectedData = presentations.find((item) => item.id === id);
        if (selectedData) {
            setEditData(selectedData);
            setIsOpen(true);
        }
    }

    const onReNotify = (id: string) => {
        const selectedData = presentations.find((item) => item.id === id);
        toaster.create({
            title: "再通知しました",
            description: `${selectedData?.team} に再通知しました`,
            type: "success",
        })
    }

    const handleCreate = (newData: Presentation) => {
        setPresentations([...presentations, newData]);
        setIsOpen(false);
    }

    const handleUpdate = (updatedData: Presentation) => {
        setPresentations(presentations.map((item) => item.id === updatedData.id ? updatedData : item));
        setIsOpen(false);
    }

    const handleDelete = (id: string) => {
        setPresentations(presentations.filter((item) => item.id !== id));
    }

    return {
        isOpen,
        editData,
        presentations,
        onOpenChange,
        onEdit,
        onReNotify,
        handleCreate,
        handleUpdate,
        handleDelete,
    };
} 