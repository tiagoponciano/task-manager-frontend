"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { propagateServerField } from "next/dist/server/lib/render-server";

export function ThemeProvider({
    children,
    ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}