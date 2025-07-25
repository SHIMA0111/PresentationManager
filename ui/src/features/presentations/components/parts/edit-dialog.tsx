import { Presentation } from "@/types/presentation";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import EditDialogForm from "./edit-dialog-form";

interface EditDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editData?: Presentation;
    onCreate: (newData: Presentation) => void;
    onUpdate: (updatedData: Presentation) => void;
}

export default function EditDialog({ isOpen, onOpenChange, editData, onCreate, onUpdate }: EditDialogProps) {

    const [presentationDate, setPresentationDate] = useState<string>("");
    const [team, setTeam] = useState<string>("");

    // editDataが変更されたときにstateを更新
    useEffect(() => {
        if (editData) {
            const date = (new Date(editData.presentation_date));
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            
            const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}T${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}`;
            setPresentationDate(formattedDate);
            setTeam(editData.team || "");
        } else {
            // 新規作成の場合は空にリセット
            setPresentationDate("");
            setTeam("");
        }
    }, [editData]);

    const isEditMode = editData;

    const handleSubmit = () => {
        // If team is changed, speaker, title, content should be reset.
        if (isEditMode && editData.team !== team) {
            onUpdate({ ...editData, presentation_date: presentationDate, team: team, assignee: "", title: "", content: "", status: "未アサイン" });
        } 
        // If team is not changed, only date should be updated.
        else if (isEditMode) {
            onUpdate({ ...editData, presentation_date: presentationDate});
        }
        else {
            onCreate({ id: crypto.randomUUID(), presentation_date: presentationDate, team: team, assignee: "", title: "", content: "", status: "未アサイン" });
        }
    };
    
    return (
        <Dialog.Root open={isOpen} onOpenChange={(details) => onOpenChange(details.open)}>
            <Dialog.Trigger asChild>
                <Button variant="ghost">
                    新規作成
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{isEditMode ? "発表の編集" : "新規発表の作成"}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <EditDialogForm
                                presentationDate={presentationDate}
                                team={team}
                                onPresentationDateChange={setPresentationDate}
                                onTeamChange={setTeam}
                            />
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                キャンセル
                            </Button>
                            <Button onClick={handleSubmit}>
                                {isEditMode ? "更新" : "作成"}
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}