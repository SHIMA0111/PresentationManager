import Presentations from "@/features/presentations/components/presentations";
import { apiClient, Method } from "@/lib/api/api-client";

export default async function ListPage() {
    const presentations = await apiClient("/api/v1/presentations", Method.GET);

    return <Presentations presentations={presentations} />
}