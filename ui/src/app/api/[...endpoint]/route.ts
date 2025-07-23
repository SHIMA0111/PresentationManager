import { apiClient, Method } from "@/lib/api/api-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
    const paramData = await params;
    const endpoint = [...paramData.endpoint].join("/");
    const response = await apiClient(`/api/${endpoint}`, Method.GET);
    
    return NextResponse.json(response);
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
    const paramData = await params;
    const endpoint = [...paramData.endpoint].join("/");
    const response = await apiClient(`/api/${endpoint}`, Method.POST);
    
    return NextResponse.json(response);
}

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
    const paramData = await params;
    const endpoint = [...paramData.endpoint].join("/");
    const response = await apiClient(`/api/${endpoint}`, Method.PUT);
    
    return NextResponse.json(response);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {  
    const paramData = await params;
    const endpoint = [...paramData.endpoint].join("/");
    const response = await apiClient(`/api/${endpoint}`, Method.DELETE);
    
    return NextResponse.json(response);
}

