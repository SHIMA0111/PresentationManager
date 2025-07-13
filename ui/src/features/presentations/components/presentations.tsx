"use client";

import PresentationTable from "./parts/presentation-table";
import { usePresentations } from "../hooks/use-presentations";
import PresentationsHeader from "./parts/presentations-header";
import { Presentation } from "@/types/presentation";

export default function Presentations({ presentations }: { presentations: Presentation[] }) {
    const {
        isOpen,
        editData,
        onOpenChange,
        onEdit,
        onReNotify,
        handleCreate,
        handleUpdate,
        handleDelete,
    } = usePresentations();

    const isAdmin = true;
    
    return (
        <>
            <PresentationsHeader
                isAdmin={isAdmin}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                editData={editData}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
            />
            <PresentationTable 
                data={presentations} 
                isAdmin={isAdmin} 
                onEdit={onEdit}
                onDelete={handleDelete}
                onReNotify={onReNotify}
            />
        </>
    )
}