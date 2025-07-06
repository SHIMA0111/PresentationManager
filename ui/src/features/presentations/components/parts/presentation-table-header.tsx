import { Table } from "@chakra-ui/react";

interface PresentationTableHeaderProps {
    isAdmin: boolean;
}

export default function PresentationTableHeader({ isAdmin }: PresentationTableHeaderProps) {
    return (
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeader minWidth="150px">
                    発表日時
                </Table.ColumnHeader>
                <Table.ColumnHeader minWidth="120px">
                    チーム
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
                {isAdmin && (
                    <Table.ColumnHeader minWidth="180px" textAlign="end">
                        操作
                    </Table.ColumnHeader>
                )}
            </Table.Row>
        </Table.Header>
    );
} 