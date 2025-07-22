import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/auth";

export async function GET(request: NextRequest) {
    await signOut({
        redirect: false,
    });

    return NextResponse.redirect(new URL("/auth/login", request.url));
}