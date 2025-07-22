import { signOut } from "next-auth/react"

export const useLogout = () => {
    const logout = async () => {
        await signOut({
            redirect: true,
            redirectTo: "/auth/login",
        });
    };

    const federatedLogout = async () => {
        try {
            const response = await fetch("/api/auth/federated-logout");
            const data = await response.json();
    
            if (response.ok && data.url) {
                await signOut({
                    redirect: false,
                });
    
                window.location.href = data.url;
            } else {
                throw new Error(data.error || "Failed to logout");
            };
        } catch (error) {
            console.error("Logout failed:", error);
            await signOut({
                redirect: true,
                redirectTo: "/auth/login",
            });
        }
    };

    return { logout, federatedLogout };
}