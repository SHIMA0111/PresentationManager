"use client";

import { notFound, useParams } from "next/navigation";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export default function Pages() {
    const params = useParams();
    const uuid = params.uuid as string;

    if (!UUID_REGEX.test(uuid)) {
        notFound();
    }

    return (
        <div>
            <h1>Pages {uuid}</h1>
        </div>
    )
}