import { Field, Fieldset, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { LuEye, LuEyeClosed, LuLock, LuMail } from "react-icons/lu";

interface LoginFormFieldsProps {
    email: string;
    password: string;
    showPassword: boolean;
    isLoading: boolean;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTogglePassword: () => void;
}

export default function LoginFormFields({
    email,
    password,
    showPassword,
    isLoading,
    onEmailChange,
    onPasswordChange,
    onTogglePassword,
}: LoginFormFieldsProps) {
    return (
        <Fieldset.Root gap={4} w="full">
            <Fieldset.Content spaceY={2}>
                <Field.Root>
                    <Field.Label color="gray.700">Email</Field.Label>
                    <InputGroup startElement={<LuMail />}>
                        <Input
                            type="email"
                            border="1px solid"
                            borderColor="gray.300" 
                            placeholder="your@email.com"
                            focusRingColor="gray.400"
                            value={email}
                            color="gray.700"
                            onChange={onEmailChange}
                            disabled={isLoading}
                        />
                    </InputGroup>
                </Field.Root>
                <Field.Root>
                    <Field.Label color="gray.700">Password</Field.Label>
                    <InputGroup 
                        startElement={<LuLock />}
                        endElement={
                            <IconButton
                                aria-label="Toggle password visibility"
                                onClick={onTogglePassword}
                                onClickCapture={onTogglePassword}
                                color="gray.500"
                                size="sm"
                                _hover={{
                                    color: "gray.600"
                                }}
                            >
                                {showPassword ? <LuEye /> : <LuEyeClosed />}
                            </IconButton>
                        }
                    >
                        <Input 
                            type={showPassword ? "text" : "password"} 
                            border="1px solid"
                            borderColor="gray.300" 
                            placeholder={showPassword ? "Enter your password" : "********"}
                            focusRingColor="gray.400"
                            color="gray.700"
                            value={password}
                            onChange={onPasswordChange}
                            disabled={isLoading}
                        />
                    </InputGroup>
                </Field.Root>
            </Fieldset.Content>
        </Fieldset.Root>
    );
} 