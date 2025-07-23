import { Presentation } from "@/types/presentation";
import { Editable } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const usePresentationEdit = (presentation: Presentation) => {
    const [title, setTitle] = useState(presentation.title);
    const [content, setContent] = useState(presentation.content);
    const [isEdit, setIsEdit] = useState(false);

    const handleTitleChange = (e: Editable.ValueChangeDetails) => {
        setTitle(e.value);
    }
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }

    useEffect(() => {
        if (title === presentation.title && content === presentation.content) {
            setIsEdit(false);
        } else {
            setIsEdit(true);
        }
    }, [title, content, presentation]);

    return {
        title,
        content,
        isEdit,
        handleTitleChange,
        handleContentChange,
    }
}