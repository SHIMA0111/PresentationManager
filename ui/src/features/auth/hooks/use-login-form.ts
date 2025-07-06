import { FormEvent, useState } from "react";

export function useLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(email, password);
        setIsLoading(false);
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    return {
        email,
        password,
        showPassword,
        isLoading,
        handleSubmit,
        handleTogglePassword,
        handleEmailChange,
        handlePasswordChange,
    };
} 