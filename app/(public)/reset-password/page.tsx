"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Mail, KeyRound, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

type Step = "request" | "sent" | "reset";

export default function ResetPasswordPage() {
    const [step, setStep] = useState<Step>("request");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Email Required", { description: "Please enter your registered email address." });
            return;
        }
        setIsLoading(true);
        // Simulate API call to send reset link
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        setStep("sent");
        toast.success("Reset Link Sent", { description: "Check your email for the password reset link." });
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            toast.error("Missing Fields", { description: "Please fill in both password fields." });
            return;
        }
        if (password.length < 8) {
            toast.error("Weak Password", { description: "Password must be at least 8 characters long." });
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Password Mismatch", { description: "The passwords you entered do not match." });
            return;
        }
        setIsLoading(true);
        // Simulate API call to reset password (would verify hashed token in real implementation)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        toast.success("Password Updated!", { description: "Your password has been reset. You can now log in." });
        setStep("request");
    };

    return (
        <div className="max-w-md w-full mx-auto">
            <div className="mb-8 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-clay-outer mb-6 rotate-3">
                    <GraduationCap className="h-8 w-8 text-white -rotate-3" />
                </div>
                <h1 className="text-4xl font-serif text-slate-900 font-extrabold tracking-tight">Unimonk</h1>
                <p className="text-slate-600 mt-3 text-sm max-w-sm">
                    Reset your password securely.
                </p>
            </div>

            <Card
                className="bg-white rounded-3xl overflow-hidden border-0"
                style={{ boxShadow: "var(--shadow-clay-outer)", border: "1.5px solid rgba(121, 90, 60, 0.12)" }}
            >
                {/* Step 1: Request Reset Link */}
                {step === "request" && (
                    <form onSubmit={handleRequestReset}>
                        <CardHeader className="space-y-1 pb-4 pt-8 px-8">
                            <div className="bg-indigo-50 p-3 rounded-2xl w-fit mb-2">
                                <Mail className="h-6 w-6 text-indigo-600" />
                            </div>
                            <CardTitle className="text-2xl font-serif font-bold text-slate-800">Forgot Password</CardTitle>
                            <CardDescription className="text-slate-500">
                                Enter the email address associated with your account. We&apos;ll send you a secure link to reset your password.
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
                                    className="bg-surface-2 h-12 border-transparent focus-visible:ring-indigo-500 rounded-xl px-4 text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 pb-8 px-8 pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-2xl h-12 text-base font-bold shadow-clay-inner bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-[1.02] disabled:opacity-70"
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </Button>
                            <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 mx-auto">
                                <ArrowLeft className="h-4 w-4" /> Back to Login
                            </Link>
                        </CardFooter>
                    </form>
                )}

                {/* Step 2: Email Sent Confirmation */}
                {step === "sent" && (
                    <div className="px-8 py-10 text-center space-y-5">
                        <div className="bg-emerald-50 p-4 rounded-full w-fit mx-auto">
                            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Check Your Email</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                                We&apos;ve sent a password reset link to <span className="font-bold text-slate-700">{email}</span>. The link will expire in 30 minutes.
                            </p>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800 font-medium">
                            Didn&apos;t receive the email? Check your spam folder or wait a minute before trying again.
                        </div>
                        <div className="flex flex-col gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => { setStep("reset"); }}
                                className="w-full rounded-xl h-11 font-bold border-slate-200"
                            >
                                <KeyRound className="h-4 w-4 mr-2" /> I Have a Reset Code
                            </Button>
                            <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 mx-auto">
                                <ArrowLeft className="h-4 w-4" /> Back to Login
                            </Link>
                        </div>
                    </div>
                )}

                {/* Step 3: Set New Password */}
                {step === "reset" && (
                    <form onSubmit={handleResetPassword}>
                        <CardHeader className="space-y-1 pb-4 pt-8 px-8">
                            <div className="bg-indigo-50 p-3 rounded-2xl w-fit mb-2">
                                <KeyRound className="h-6 w-6 text-indigo-600" />
                            </div>
                            <CardTitle className="text-2xl font-serif font-bold text-slate-800">Set New Password</CardTitle>
                            <CardDescription className="text-slate-500">
                                Your new password must be at least 8 characters long. It will be securely hashed and stored.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 px-8">
                            <div className="space-y-2">
                                <Label htmlFor="new-password" className="font-semibold text-slate-700">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="bg-surface-2 h-12 border-transparent focus-visible:ring-indigo-500 rounded-xl px-4 text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password" className="font-semibold text-slate-700">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="bg-surface-2 h-12 border-transparent focus-visible:ring-indigo-500 rounded-xl px-4 text-slate-900"
                                />
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 font-medium space-y-1">
                                <p>✓ Minimum 8 characters</p>
                                <p>✓ Password is hashed before storage (bcrypt)</p>
                                <p>✓ Reset tokens expire after 30 minutes</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 pb-8 px-8 pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-2xl h-12 text-base font-bold shadow-clay-inner bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-[1.02] disabled:opacity-70"
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </Button>
                            <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 mx-auto">
                                <ArrowLeft className="h-4 w-4" /> Back to Login
                            </Link>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    );
}
