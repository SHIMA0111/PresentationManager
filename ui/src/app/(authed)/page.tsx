"use client";

import Home from "@/features/home/components/home";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function HomePage() {
    const { data: session, status } = useSession();

    useEffect(() => {
        console.log(session);
        console.log(status);
    }, [session, status]);

    return <Home />
}