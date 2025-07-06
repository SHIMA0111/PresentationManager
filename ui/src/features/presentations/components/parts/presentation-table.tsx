import { Presentation } from "@/types/presentation";
import { Card, Table } from "@chakra-ui/react";
import PresentationTableHeader from "./presentation-table-header";
import PresentationTableRow from "./presentation-table-row";
import EmptyState from "./empty-state";

interface PresentationTableProps {
    data: Presentation[];
    isAdmin: boolean;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onReNotify: (id: string) => void;
};

export default function PresentationTable({ data, isAdmin, onEdit, onDelete, onReNotify }: PresentationTableProps) {
    if (data.length === 0) {
        return <EmptyState />;
    }

    return (
        <Card.Root>
            <Card.Body p={0}>
                <Table.Root stickyHeader tableLayout="fixed">
                    <PresentationTableHeader isAdmin={isAdmin} />
                    <Table.Body>
                        {data.map((item) => (
                            <PresentationTableRow
                                key={item.id}
                                item={item}
                                isAdmin={isAdmin}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onReNotify={onReNotify}
                            />
                        ))}
                    </Table.Body>
                </Table.Root>
            </Card.Body>
        </Card.Root>
    );
}