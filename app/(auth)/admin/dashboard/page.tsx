"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, TrendingUp, Building } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

// Mock Data
const userGrowthData = [
    { name: "Jan", students: 400, teachers: 24 },
    { name: "Feb", students: 600, teachers: 35 },
    { name: "Mar", students: 800, teachers: 42 },
    { name: "Apr", students: 1100, teachers: 55 },
    { name: "May", students: 1540, teachers: 68 },
    { name: "Jun", students: 1980, teachers: 80 },
];

const batchSummary = [
    { name: "Physics 101", students: 120, avgScore: 78, status: "Active" },
    { name: "Chemistry Adv", students: 85, avgScore: 82, status: "Active" },
    { name: "Math Fundamentals", students: 210, avgScore: 65, status: "Needs Attention" },
    { name: "Biology Prep", students: 95, avgScore: 88, status: "Excellent" },
];

export default function AdminDashboardPage() {
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
                        <div className="text-4xl font-serif font-bold">1,980</div>
                        <p className="text-xs text-indigo-200 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +22.5% from last month
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
                        <div className="text-4xl font-serif font-bold text-slate-900">80</div>
                        <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +12 new onboarded
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white" style={{ border: "var(--border-soft)" }}>
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Active Batches
                            <Building className="h-4 w-4 text-amber-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">24</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Across 4 major domains
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white" style={{ border: "var(--border-soft)" }}>
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Tests Conducted
                            <BookOpen className="h-4 w-4 text-rose-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">1,204</div>
                        <p className="text-xs text-slate-500 mt-1">
                            All time platform usage
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2 bg-white" style={{ border: "var(--border-soft)" }}>
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="font-serif">User Growth</CardTitle>
                        <CardDescription>New student and teacher signups over 6 months</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Batch Breakdown */}
                <Card className="col-span-1 bg-white flex flex-col" style={{ border: "var(--border-soft)" }}>
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="font-serif">Top Batches</CardTitle>
                        <CardDescription>By student enrollment</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-center">
                        <div className="space-y-6 mt-2">
                            {batchSummary.map((batch, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-slate-900 text-sm">{batch.name}</span>
                                        <span className="text-xs text-slate-500">{batch.students} Students • Avg Top Score: {batch.avgScore}%</span>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${batch.status === 'Active' ? 'bg-indigo-50 text-indigo-600' :
                                            batch.status === 'Excellent' ? 'bg-emerald-50 text-emerald-600' :
                                                'bg-rose-50 text-rose-600'
                                        }`}>
                                        {batch.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
