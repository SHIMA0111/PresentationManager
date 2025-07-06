import { Button, Card, Editable, Flex, Icon, IconButton, Textarea, useEditable } from "@chakra-ui/react";
import { Presentation } from "@/types/presentation";
import { useEffect, useState } from "react";
import { LuCheck, LuSave, LuSquarePen, LuX } from "react-icons/lu";
import { usePresentationEdit } from "../../hooks/use-presentation-edit";

interface AccordionCardProps {
    presentation: Presentation;
}

export default function AccordionCard({ presentation }: AccordionCardProps) {
    const { 
        title, 
        content, 
        isEdit, 
        handleTitleChange,
        handleContentChange 
    } = usePresentationEdit(presentation);
    
    const editable = useEditable({
        defaultValue: title,
        onValueChange: handleTitleChange,
        placeholder: "タイトルを入力してください",
    })

    return (
        <Card.Root shadow="sm" borderColor="border.muted" borderWidth={1}>
            <Card.Header>
                <Card.Title>
                    <Editable.RootProvider value={editable}>
                        <Editable.Preview />
                        <Editable.Input />
                        <Editable.Control>
                            <Editable.EditTrigger asChild>
                                <IconButton 
                                    variant="ghost" 
                                    size="sm" 
                                    _focus={{
                                        outline: "none",
                                    }}
                                >
                                    <LuSquarePen />
                                </IconButton>
                            </Editable.EditTrigger>
                        </Editable.Control>
                        <Editable.CancelTrigger asChild>
                            <IconButton variant="ghost" size="sm">
                                <LuX />
                            </IconButton>
                        </Editable.CancelTrigger>
                        <Editable.SubmitTrigger asChild>
                            <IconButton variant="ghost" size="sm">
                                <LuCheck />
                            </IconButton>
                        </Editable.SubmitTrigger>
                    </Editable.RootProvider>
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Textarea
                    placeholder="発表内容を入力してください"
                    rows={10}
                    resize="none"
                    value={content}
                    onChange={handleContentChange}
                />
            </Card.Body>
            <Card.Footer>
                <Flex w="full" justify="flex-end" spaceX={2}>
                    <Button variant="outline" size="sm" disabled={!isEdit || editable.editing}>
                        <Icon as={LuSave} />
                        保存
                    </Button>
                </Flex>
            </Card.Footer>
        </Card.Root>
    )
}