import { useEffect, useState } from "react";
import { Presentation } from "@/types/presentation";
import { toaster } from "@/components/ui/toaster";

export function usePresentations() {
    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState<Presentation | undefined>(undefined);
    const [presentations, setPresentations] = useState<Presentation[]>([]);

    useEffect(() => {
        const fetchPresentations = async () => {
            const response = await fetch("/api/v1/presentations");
            const data = await response.json();
            setPresentations(data);
        }
        fetchPresentations();
    }, []);

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