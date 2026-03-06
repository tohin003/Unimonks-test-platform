"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, TrendingUp, Building } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

type OverviewData = {
    users: { total: number; admin: number; teacher: number; student: number };
    tests: { total: number; draft: number; published: number; archived: number };
    sessions: { completed: number; active: number };
    avgScore: number;
};

export default function AdminDashboardPage() {
    const [data, setData] = useState<OverviewData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await apiClient.get<OverviewData>("/api/admin/analytics/overview");
            if (res.ok) setData(res.data);
            setIsLoading(false);
        })();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
                <div className="border-b pb-6" style={{ borderColor: "var(--border-soft)" }}>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    const d = data ?? { users: { total: 0, admin: 0, teacher: 0, student: 0 }, tests: { total: 0, draft: 0, published: 0, archived: 0 }, sessions: { completed: 0, active: 0 }, avgScore: 0 };

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4" style={{ borderColor: "var(--border-soft)" }}>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Admin Overview</h1>
                    <p className="text-slate-500 mt-1">Platform metrics and system administration.</p>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-0 overflow-hidden relative" style={{ border: 'none' }}>
                    <div className="absolute right-0 top-0 opacity-10">
                        <Users className="w-32 h-32 -mr-8 -mt-8" />
                    </div>
                    <CardHeader className="pb-2 relative z-10 p-6">
                        <CardTitle className="text-sm font-medium text-indigo-100 flex items-center justify-between">
                            Total Students
                            <Users className="h-4 w-4 text-indigo-200" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 p-6 pt-0">
                        <div className="text-4xl font-serif font-bold">{d.users.student.toLocaleString()}</div>
                        <p className="text-xs text-indigo-200 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> {d.users.total} total users
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white" style={{ border: "var(--border-soft)" }}>
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Total Teachers
                            <GraduationCap className="h-4 w-4 text-emerald-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">{d.users.teacher}</div>
                        <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> {d.users.admin} admins
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white" style={{ border: "var(--border-soft)" }}>
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Tests Created
                            <BookOpen className="h-4 w-4 text-amber-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">{d.tests.total}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {d.tests.published} published · {d.tests.draft} draft
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white" style={{ border: "var(--border-soft)" }}>
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Test Sessions
                            <Building className="h-4 w-4 text-rose-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">{d.sessions.completed.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Avg Score: {d.avgScore}%
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white" style={{ border: "var(--border-soft)" }}>
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="font-serif">User Breakdown</CardTitle>
                        <CardDescription>Active users by role</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-4">
                        <div className="space-y-4">
                            {([
                                { label: "Students", count: d.users.student, color: "bg-indigo-500" },
                                { label: "Teachers", count: d.users.teacher, color: "bg-emerald-500" },
                                { label: "Admins", count: d.users.admin, color: "bg-amber-500" },
                            ]).map(item => (
                                <div key={item.label} className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-sm font-medium text-slate-700 w-24">{item.label}</span>
                                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${item.color}`}
                                            style={{ width: `${d.users.total > 0 ? (item.count / d.users.total * 100) : 0}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 w-12 text-right">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white" style={{ border: "var(--border-soft)" }}>
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="font-serif">Test Status Overview</CardTitle>
                        <CardDescription>Tests by current status</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-4">
                        <div className="space-y-4">
                            {([
                                { label: "Published", count: d.tests.published, color: "bg-emerald-500" },
                                { label: "Draft", count: d.tests.draft, color: "bg-amber-500" },
                                { label: "Archived", count: d.tests.archived, color: "bg-slate-400" },
                            ]).map(item => (
                                <div key={item.label} className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-sm font-medium text-slate-700 w-24">{item.label}</span>
                                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${item.color}`}
                                            style={{ width: `${d.tests.total > 0 ? (item.count / d.tests.total * 100) : 0}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 w-12 text-right">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
