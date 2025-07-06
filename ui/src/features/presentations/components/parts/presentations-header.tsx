import { Flex, Heading } from "@chakra-ui/react";
import EditDialog from "./edit-dialog";

interface PresentationsHeaderProps {
    isAdmin: boolean;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editData: any;
    onCreate: (newData: any) => void;
    onUpdate: (updatedData: any) => void;
}

export default function PresentationsHeader({
    isAdmin,
    isOpen,
    onOpenChange,
    editData,
    onCreate,
    onUpdate,
}: PresentationsHeaderProps) {
    return (
        <Flex justify="space-between" align="center" mb={8}>
            <Heading as="h1" textStyle="2xl" fontWeight="bold">
                発表一覧 {isAdmin ? "(管理者)" : ""}
            </Heading>
            {isAdmin && (
                <EditDialog
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    editData={editData}
                    onCreate={onCreate}
                    onUpdate={onUpdate}
                />
            )}
        </Flex>
    );
} 