import { Field, Input } from "@chakra-ui/react";

interface EditDialogFormProps {
    presentationDate: string;
    team: string;
    onPresentationDateChange: (value: string) => void;
    onTeamChange: (value: string) => void;
}

export default function EditDialogForm({
    presentationDate,
    team,
    onPresentationDateChange,
    onTeamChange,
}: EditDialogFormProps) {
    console.log(presentationDate);
    return (
        <>
            <Field.Root>
                <Field.Label>発表日時</Field.Label>
                <Input 
                    type="datetime-local" 
                    placeholder="発表日時を入力してください" 
                    value={presentationDate} 
                    onChange={(e) => onPresentationDateChange(e.target.value)} 
                />
            </Field.Root>
            <Field.Root>
                <Field.Label>チーム</Field.Label>
                <Input 
                    type="text" 
                    placeholder="チームを入力してください" 
                    value={team} 
                    onChange={(e) => onTeamChange(e.target.value)} 
                />
            </Field.Root>
        </>
    );
} 