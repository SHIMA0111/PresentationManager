import { Presentation } from "@/types/presentation";
import { dateFormatter } from "@/utils/date-formatter";
import { Button, Flex, Icon, Table } from "@chakra-ui/react";
import { LuBell, LuPencil, LuTrash } from "react-icons/lu";

interface PresentationTableRowProps {
    item: Presentation;
    isAdmin: boolean;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onReNotify: (id: string) => void;
}

export default function PresentationTableRow({ 
    item, 
    isAdmin, 
    onEdit, 
    onDelete, 
    onReNotify 
}: PresentationTableRowProps) {
    return (
        <Table.Row key={item.id}>
            <Table.Cell>{dateFormatter(item.date)}</Table.Cell>
            <Table.Cell>{item.team}</Table.Cell>
            <Table.Cell>{item.speaker}</Table.Cell>
            <Table.Cell>{item.title}</Table.Cell>
            <Table.Cell>{item.content}</Table.Cell>
            <Table.Cell>{item.status}</Table.Cell>
            {isAdmin && (
                <Table.Cell textAlign="end">
                    <Flex gap={2} justifyContent="flex-end">
                        {
                            item.status === "未アサイン" && (
                                <Button variant="ghost" size="sm" onClick={() => onReNotify(item.id)}>
                                    <Icon as={LuBell} /> 再通知
                                </Button>
                            )
                        }
                        <Button variant="ghost" size="sm" onClick={() => onEdit(item.id)}>
                            <Icon as={LuPencil} />
                        </Button>
                        <Button variant="ghost" color="red.500" size="sm" onClick={() => onDelete(item.id)}>
                           <Icon as={LuTrash} />
                        </Button>
                    </Flex>
                </Table.Cell>
            )}
        </Table.Row>
    );
} 