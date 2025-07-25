import { Presentation } from "@/types/presentation";
import { dateFormatter } from "@/utils/date-formatter";
import { Button, Card, Flex, Icon, Table } from "@chakra-ui/react";
import { LuBell, LuPencil } from "react-icons/lu";

interface TeamTableProps {
    data: Presentation[];
    team: string;
    isTeamAdmin: boolean;
    onIncrementUnassign: () => void;
}

export default function TeamTable({ data, team, isTeamAdmin, onIncrementUnassign }: TeamTableProps) {
    const filteredData = data.filter((item) => item.team === team);

    return (
        <Card.Root>
            <Card.Body p={0}>
                <Table.Root stickyHeader tableLayout="fixed">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader minWidth="150px">
                                発表日時
                            </Table.ColumnHeader>
                            <Table.ColumnHeader minWidth="120px">
                                発表者
                            </Table.ColumnHeader>
                            <Table.ColumnHeader minWidth="200px">
                                発表タイトル
                            </Table.ColumnHeader>
                            <Table.ColumnHeader minWidth="300px">
                                発表内容
                            </Table.ColumnHeader>
                            <Table.ColumnHeader minWidth="100px">
                                ステータス
                            </Table.ColumnHeader>
                            {isTeamAdmin && (
                                <Table.ColumnHeader minWidth="180px" textAlign="end">
                                    操作
                                </Table.ColumnHeader>
                            )}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredData.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>{dateFormatter(item.presentation_date)}</Table.Cell>
                                <Table.Cell>{item.assignee}</Table.Cell>
                                <Table.Cell>{item.title}</Table.Cell>
                                <Table.Cell>{item.content}</Table.Cell>
                                <Table.Cell>{item.status}</Table.Cell>
                                {isTeamAdmin && (
                                    <Table.Cell textAlign="end">
                                        <Flex gap={2} justifyContent="flex-end">
                                            {
                                                item.title === "" && (
                                                    <Button variant="ghost" size="sm" onClick={() => {}}>
                                                        <Icon as={LuBell} /> 再通知
                                                    </Button>
                                                )
                                            }
                                            <Button variant="ghost" size="sm" onClick={onIncrementUnassign}>
                                                <Icon as={LuPencil} />
                                            </Button>
                                        </Flex>
                                    </Table.Cell>
                                )}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Card.Body>
        </Card.Root>
    );
} 