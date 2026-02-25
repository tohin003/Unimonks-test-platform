"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// Mock users for each role
const MOCK_USERS = {
    "admin@unimonk.com": {
        password: "admin123",
        user: {
            id: "usr_001",
            name: "Administrator",
            email: "admin@unimonk.com",
            role: "admin" as const,
            avatarUrl: "https://github.com/shadcn.png",
        },
        redirect: "/admin/dashboard",
    },
    "teacher@unimonk.com": {
        password: "teacher123",
        user: {
            id: "usr_002",
            name: "Teacher",
            email: "teacher@unimonk.com",
            role: "teacher" as const,
        },
        redirect: "/teacher/dashboard",
    },
    "student@unimonk.com": {
        password: "student123",
        user: {
            id: "usr_003",
            name: "Student",
            email: "student@unimonk.com",
            role: "student" as const,
        },
        redirect: "/student/dashboard",
    },
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Missing Fields", { description: "Please enter both email and password." });
            return;
        }
        setIsLoading(true);
        // Simulate auth check
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);

        const entry = MOCK_USERS[email as keyof typeof MOCK_USERS];

        if (entry && entry.password === password) {
            // Persist user to localStorage so AuthProvider picks it up
            localStorage.setItem("unimonk_user", JSON.stringify(entry.user));

            const roleName = entry.user.role.charAt(0).toUpperCase() + entry.user.role.slice(1);
            toast.success(`Welcome ${roleName}!`, { description: "Redirecting to your dashboard..." });
            router.push(entry.redirect);
        } else {
            toast.error("Login Failed", { description: "Invalid email or password. Please try again." });
        }
    };

    return (
        <div className="max-w-md w-full mx-auto">
            <div className="mb-8 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-clay-outer mb-6 rotate-3">
                    <GraduationCap className="h-8 w-8 text-white -rotate-3" />
                </div>
                <h1 className="text-4xl font-serif text-slate-900 font-extrabold tracking-tight">Unimonk</h1>
                <p className="text-slate-600 mt-3 text-sm max-w-sm">
                    Welcome back. Please sign in to your account or use your temporary credentials.
                </p>
            </div>

            <Card
                className="bg-white rounded-3xl overflow-hidden border-0"
                style={{ boxShadow: "var(--shadow-clay-outer)", border: "1.5px solid rgba(121, 90, 60, 0.12)" }}
            >
                <form onSubmit={handleSubmit}>
                    <CardHeader className="space-y-1 pb-6 pt-8 px-8">
                        <CardTitle className="text-2xl font-serif font-bold text-slate-800">Sign in</CardTitle>
                        <CardDescription className="text-slate-500">
                            Enter your email and password to access the portal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 px-8">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-semibold text-slate-700">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-describedby="email-hint"
                                className="bg-surface-2 h-12 border-transparent focus-visible:ring-indigo-500 rounded-xl px-4 text-slate-900 placeholder:text-slate-400"
                            />
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="font-semibold text-slate-700">Password</Label>
                                <Link href="/reset-password" className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">Forgot password?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-surface-2 h-12 border-transparent focus-visible:ring-indigo-500 rounded-xl px-4 text-slate-900"
                                placeholder="••••••••"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pb-8 px-8 pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-2xl h-12 text-base font-bold shadow-clay-inner bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-[1.02] disabled:opacity-70"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                        <div className="text-center text-xs font-medium text-slate-500 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-slate-700">First time logging in?</span><br />
                            Use the temporary credentials provided by your administrator. You will be required to change your password on first login.
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
