import {ReactNode} from "react";
import {Provider} from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: {children: ReactNode}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Provider>
                    {children}
                    <Toaster />
                </Provider>
            </body>
        </html>
    )
}