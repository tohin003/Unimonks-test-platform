"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronDown, Sparkles, MoveRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const performanceData = [
    { name: "Quiz 1", score: 65, average: 50 },
    { name: "Midterm", score: 72, average: 60 },
    { name: "Quiz 2", score: 68, average: 62 },
    { name: "Unit 3", score: 85, average: 65 },
    { name: "Quiz 3", score: 88, average: 68 },
    { name: "Final Prep", score: 92, average: 72 },
];

function NextTestSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-[2rem] p-8 md:p-10 border border-slate-100 bg-white" style={{ boxShadow: "var(--shadow-clay-outer)" }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4 flex-1">
                    <Skeleton className="h-6 w-24 rounded-full mb-2" />
                    <Skeleton className="h-8 w-3/4 rounded-xl" />
                    <Skeleton className="h-16 w-64 rounded-2xl mt-4" />
                    <Skeleton className="h-5 w-48 rounded-md mt-4" />
                </div>
                <div className="flex flex-col items-start md:items-end gap-3 shrink-0 mt-4 md:mt-0">
                    <Skeleton className="h-14 w-48 rounded-2xl" />
                    <Skeleton className="h-4 w-40 rounded-md" />
                </div>
            </div>
        </div>
    );
}

function NextTestWidget() {
    const [isLoading, setIsLoading] = useState(true);
    // Live countdown timer: starts at 1h 45m 32s = 6332 seconds
    const [timeLeft, setTimeLeft] = useState(6332);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isLoading) return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) return 0;
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isLoading]);

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    const pad = (n: number) => String(n).padStart(2, "0");

    if (isLoading) {
        return <NextTestSkeleton />;
    }

    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 p-8 md:p-10" style={{ boxShadow: "var(--shadow-clay-outer)" }}>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-5 flex-1">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 font-bold uppercase tracking-wider text-[10px] px-3 py-1 mb-2">Live Now</Badge>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">Advanced Physics Mid-Term</h2>

                    <div className="flex items-center gap-3 text-3xl md:text-5xl font-bold font-mono tracking-tight mt-2">
                        <div className="bg-white/10 backdrop-blur-md text-white rounded-2xl px-4 py-3 shadow-inner border border-white/10">{pad(hours)}</div>
                        <span className="text-white/50 py-2 animate-pulse">:</span>
                        <div className="bg-white/10 backdrop-blur-md text-white rounded-2xl px-4 py-3 shadow-inner border border-white/10">{pad(minutes)}</div>
                        <span className="text-white/50 py-2 animate-pulse">:</span>
                        <div className="bg-white/10 backdrop-blur-md text-white rounded-2xl px-4 py-3 shadow-inner border border-white/10">{pad(seconds)}</div>
                    </div>

                    <div className="flex items-center gap-2 text-indigo-100 text-sm mt-4 font-medium">
                        <Calendar className="h-4 w-4" />
                        <span>Oct 25, 2024 • 2:00 PM - 3:30 PM</span>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                    <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg px-8 py-6 rounded-2xl shadow-clay-inner transition-transform hover:scale-105">
                        <Link href="/arena/demo">
                            Enter Test Arena <MoveRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <p className="text-indigo-200 text-xs font-medium pr-2">Test has started. Do not be late.</p>
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
}

export default function StudentDashboard() {
    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-10">
            <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: "var(--border-soft)" }}>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Student Dashboard</h1>
                    <p className="text-slate-500 mt-1">Track your progress and upcoming assessments.</p>
                </div>
            </div>

            {/* Hero Banner / Next Test Widget */}
            <NextTestWidget />

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Recent Results */}
                <Card className="bg-white rounded-3xl border-0 flex flex-col h-full">
                    <CardHeader className="pb-4 p-8 border-b bg-surface" style={{ borderColor: "var(--border-soft)" }}>
                        <CardTitle className="text-xl font-serif font-bold text-slate-800">Recent Results</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col gap-8 flex-1">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-base font-serif">Calculus Quiz 3</h4>
                                    <p className="text-sm text-slate-500 mt-1">Score: 88%</p>
                                </div>
                                <span className="bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px] tracking-wider px-3 py-1 rounded-md">Completed</span>
                            </div>
                            <Progress value={88} className="h-3 rounded-full bg-surface-2" indicatorClassName="bg-emerald-500 rounded-full" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-base font-serif">Biology Unit Test</h4>
                                    <p className="text-sm text-slate-500 mt-1">Score: 92%</p>
                                </div>
                                <span className="bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px] tracking-wider px-3 py-1 rounded-md">Completed</span>
                            </div>
                            <Progress value={92} className="h-3 rounded-full bg-surface-2" indicatorClassName="bg-indigo-500 rounded-full" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-base font-serif">Chemistry Basics</h4>
                                    <p className="text-sm text-slate-500 mt-1">Score: 65%</p>
                                </div>
                                <span className="bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px] tracking-wider px-3 py-1 rounded-md">Completed</span>
                            </div>
                            <Progress value={65} className="h-3 rounded-full bg-surface-2" indicatorClassName="bg-amber-500 rounded-full" />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-8">
                    {/* Performance Overview Chart */}
                    <Card className="bg-white rounded-3xl border-0 overflow-hidden">
                        <CardHeader className="pb-4 p-8 border-b bg-surface" style={{ borderColor: 'var(--border-soft)' }}>
                            <CardTitle className="text-xl font-serif font-bold text-slate-800">Performance Over Time</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-6 relative h-[280px]">
                            <div className="flex items-center gap-6 text-sm font-semibold text-slate-500 mb-6 relative z-10 w-full justify-center">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm"></div> Your Score</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-300"></div> Class Average</div>
                            </div>
                            <div className="h-[180px] w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={performanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorScoreStudent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="average" stroke="#CBD5E1" strokeWidth={2} fillOpacity={0} />
                                        <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorScoreStudent)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Recommendations */}
                    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 overflow-hidden shadow-sm">
                        <CardHeader className="pb-3 p-6 border-b border-white/50 bg-white/50 backdrop-blur-sm">
                            <CardTitle className="text-lg font-serif font-bold text-indigo-900 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-indigo-500" />
                                AI Study Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold text-indigo-900 text-sm font-serif">Recommended Focus: Thermodynamics</h4>
                                <p className="text-sm text-indigo-800/80 leading-relaxed">
                                    Based on your last 3 physics quizzes, your accuracy drops by 20% on questions involving the Second Law of Thermodynamics. Review chapter 4 notes before the upcoming mid-term.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
