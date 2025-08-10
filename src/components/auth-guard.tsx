
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import AppSidebar from "./dashboard/sidebar";
import Header from "./dashboard/header";
import { SidebarProvider, SidebarInset } from "./ui/sidebar";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [theme, setTheme] = React.useState("light");


    React.useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                router.push("/login");
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [router]);
    
    React.useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    }, [theme]);

    const handleThemeChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    if (isLoading) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-col min-h-screen">
                        <Header onThemeChange={handleThemeChange} theme={theme} />
                        <main className="flex-1 p-4 md:p-6 lg:p-8">
                             <div className="space-y-4">
                                <Skeleton className="h-24 w-full" />
                                <div className="grid gap-8 md:grid-cols-2">
                                    <Skeleton className="h-64 w-full" />
                                    <Skeleton className="h-64 w-full" />
                                </div>
                             </div>
                        </main>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    if (!isAuthenticated) {
        return null; // or a loading spinner, but router.push should handle it
    }

    return <>{children}</>;
}
