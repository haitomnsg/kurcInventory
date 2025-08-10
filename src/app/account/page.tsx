
"use client";

import * as React from "react";
import type { User } from "@/lib/types";
import { mockUsers } from "@/lib/data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const accountSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address."),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});


type AccountFormValues = z.infer<typeof accountSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AccountPage() {
    const { toast } = useToast();
    const [theme, setTheme] = React.useState("light");
    const user = mockUsers.admin;

    React.useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    }, [theme]);

    const handleThemeChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const accountForm = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
        }
    });

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    });

    const onAccountSubmit = (data: AccountFormValues) => {
        console.log("Account updated:", data);
        toast({ title: "Account Updated", description: "Your account details have been updated." });
    };
    
    const onPasswordSubmit = (data: PasswordFormValues) => {
        console.log("Password change requested:", data);
        toast({ title: "Password Updated", description: "Your password has been changed successfully." });
        passwordForm.reset();
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col min-h-screen">
                    <Header onThemeChange={handleThemeChange} theme={theme} />
                    <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-8">
                        <div className="grid gap-8 md:grid-cols-2">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Account Information</CardTitle>
                                    <CardDescription>Update your personal details.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...accountForm}>
                                        <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
                                            <FormField
                                                control={accountForm.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <FormControl><Input {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={accountForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email Address</FormLabel>
                                                        <FormControl><Input type="email" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit">Save Changes</Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>Update your password. Make sure it's a strong one.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...passwordForm}>
                                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                            <FormField
                                                control={passwordForm.control}
                                                name="currentPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Current Password</FormLabel>
                                                        <FormControl><Input type="password" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={passwordForm.control}
                                                name="newPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>New Password</FormLabel>
                                                        <FormControl><Input type="password" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={passwordForm.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Confirm New Password</FormLabel>
                                                        <FormControl><Input type="password" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit">Update Password</Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
