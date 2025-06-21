'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeProvider } from "./theme-provider";

export default function Provider({ children }: Readonly<{
    children: React.ReactNode;
}>) {

    const [queryClient] = useState(() => new QueryClient());
    return (
        <>
            <html lang="en" suppressHydrationWarning>
                <body>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <QueryClientProvider client={queryClient}>
                            {children}
                        </QueryClientProvider>
                    </ThemeProvider>
                </body>
            </html>
        </>
    )
}