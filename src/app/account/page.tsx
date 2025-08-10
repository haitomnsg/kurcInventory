
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, updatePassword, updateProfile, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Header from "@/components/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthGuard from "@/components/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";

const accountSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address.").optional(),
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
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAccountSaving, setIsAccountSaving] = React.useState(false);
    const [isPasswordSaving, setIsPasswordSaving] = React.useState(false);

    const accountForm = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
    });

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                accountForm.reset({
                    name: currentUser.displayName || "",
                    email: currentUser.email || ""
                });
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [accountForm]);


    React.useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    }, [theme]);

    const handleThemeChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    
    const onAccountSubmit = async (data: AccountFormValues) => {
        if (!user) return;
        setIsAccountSaving(true);
        try {
            await updateProfile(user, { displayName: data.name });

            // Also update in our users collection if it exists
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                await updateDoc(userDocRef, { name: data.name });
            }

            toast({ title: "Account Updated", description: "Your account details have been updated." });
        } catch (error: any) {
            console.error("Account update error:", error);
            toast({ title: "Error", description: "Failed to update account details.", variant: "destructive"});
        } finally {
            setIsAccountSaving(false);
        }
    };
    
    const onPasswordSubmit = async (data: PasswordFormValues) => {
        if (!user || !user.email) {
            toast({ title: "Error", description: "No user is signed in.", variant: "destructive"});
            return;
        }

        setIsPasswordSaving(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, data.newPassword);

            toast({ title: "Password Updated", description: "Your password has been changed successfully." });
            passwordForm.reset();
        } catch (error: any) {
            console.error("Password update error:", error);
             toast({ title: "Error", description: error.code === 'auth/wrong-password' ? "Incorrect current password." : "Failed to update password.", variant: "destructive"});
        } finally {
            setIsPasswordSaving(false);
        }
    };
    
    const renderLoadingSkeleton = () => (
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-36" />
                </CardContent>
            </Card>
        </div>
    );

    return (
        <AuthGuard>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-col min-h-screen">
                        <Header onThemeChange={handleThemeChange} theme={theme} user={user} />
                        <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-8">
                           { isLoading ? renderLoadingSkeleton() : (
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
                                                            <FormControl><Input type="email" {...field} disabled /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" disabled={isAccountSaving}>
                                                    {isAccountSaving ? "Saving..." : "Save Changes"}
                                                </Button>
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
                                                <Button type="submit" disabled={isPasswordSaving}>
                                                     {isPasswordSaving ? "Updating..." : "Update Password"}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </div>
                           )}
                        </main>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthGuard>
    );
}
