import AppLayout from "@/components/layout/app_layout";

export default function ProtectedLayout({ children } : { children: React.ReactNode }) {
    return ( 
        <AppLayout>
            {children}
        </AppLayout>
    )
}