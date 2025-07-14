export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export async function apiClient(
    endpoint: string,
    method: Method,
    data?: any,
    headers?: Record<string, string>,
) {
    const url = `${process.env.API_HOST}${endpoint}`;
    const token = "1234567890";
    try {
        const response = await fetch(url, {
            method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...headers,
            },
        });
    
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
    
        return response.json();
    } catch (error: any) {
        console.error(error.code);
        throw error;
    }
}