"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, Users, ArrowRight, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Data
const assignedBatches = [
    { id: "batch1", name: "Physics 101 Evening", code: "PHY-101-E", students: 45, nextTest: "Oct 25, 2024", avgScore: "78%" },
    { id: "batch2", name: "Physics Olympiad", code: "PHY-OLY-X", students: 15, nextTest: "Oct 28, 2024", avgScore: "92%" },
    { id: "batch3", name: "Science Foundations", code: "SCI-FND-01", students: 60, nextTest: "Nov 02, 2024", avgScore: "65%" },
];

const recentTests = [
    { id: 1, name: "Physics Mid-Term", date: "Oct 25, 2024", status: "Active", score: "78%" },
    { id: 2, name: "Chemistry Quiz 3", date: "Oct 22, 2024", status: "Completed", score: "82%" },
];

const performanceData = [
    { name: "Week 1", score: 65 },
    { name: "Week 2", score: 72 },
    { name: "Week 3", score: 68 },
    { name: "Week 4", score: 85 },
    { name: "Week 5", score: 82 },
    { name: "Week 6", score: 90 },
];

function BatchGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl border-0 shadow-clay-outer flex flex-col p-6 h-[220px]">
                    <div className="flex justify-between items-start mb-2">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-5 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-48 rounded-md mt-2" />
                    <Skeleton className="h-4 w-32 rounded-md mt-2" />
                    <div className="mt-8 space-y-3">
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function BatchDetailSkeleton() {
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-8 w-64 rounded-md" />
                <Skeleton className="h-11 w-48 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-3xl border-0 shadow-clay-outer p-6 h-[140px] flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-32 rounded-md" />
                            <Skeleton className="h-5 w-5 rounded-md" />
                        </div>
                        <Skeleton className="h-10 w-16 rounded-md" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl border-0 shadow-clay-outer p-6 h-[340px]">
                    <Skeleton className="h-6 w-48 rounded-md mb-2" />
                    <Skeleton className="h-4 w-64 rounded-md mb-6" />
                    <Skeleton className="h-[230px] w-full rounded-xl" />
                </div>
                <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between ml-1 mb-2">
                        <Skeleton className="h-5 w-24 rounded-md" />
                        <Skeleton className="h-4 w-16 rounded-md" />
                    </div>
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white p-4 rounded-2xl shadow-clay-outer h-[88px]">
                            <div className="flex justify-between mb-3">
                                <Skeleton className="h-4 w-32 rounded-md" />
                                <Skeleton className="h-4 w-16 rounded-full" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-20 rounded-md" />
                                <Skeleton className="h-4 w-12 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function TeacherDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const batchIdParam = searchParams.get("batchId");

    const selectedBatch = batchIdParam || "all";
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [selectedBatch]);

    const handleBatchChange = (newBatchId: string) => {
        if (newBatchId === "all") {
            router.push("/teacher/dashboard");
        } else {
            router.push(`/teacher/dashboard?batchId=${newBatchId}`);
        }
    };

    const batchName = selectedBatch === "all" ? "All Batches Overview" : assignedBatches.find(b => b.id === selectedBatch)?.name;

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4" style={{ borderColor: 'var(--border-soft)' }}>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Teacher Dashboard</h1>
                    <p className="text-slate-500 mt-1">
                        {selectedBatch === "all" ? "Select a batch to manage tests and view analytics." : `Managing details for ${batchName}.`}
                    </p>
                </div>
                <Select value={selectedBatch} onValueChange={handleBatchChange}>
                    <SelectTrigger className="w-full sm:w-[240px] h-12 rounded-xl bg-surface-2 border-transparent font-bold text-slate-800 shadow-sm">
                        <SelectValue placeholder="Select Batch" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl font-medium">
                        <SelectItem value="all">All Batches Overview</SelectItem>
                        {assignedBatches.map(batch => (
                            <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                selectedBatch === "all" ? <BatchGridSkeleton /> : <BatchDetailSkeleton />
            ) : selectedBatch === "all" ? (
                // Batch-First View: Grid of Assigned Batches
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignedBatches.map(batch => (
                        <Card key={batch.id} className="bg-white rounded-3xl border-0 shadow-clay-outer flex flex-col group cursor-pointer hover:-translate-y-1 transition-transform duration-200" onClick={() => handleBatchChange(batch.id)}>
                            <CardHeader className="p-6 pb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-none px-2 py-0.5 text-xs font-bold">{batch.code}</Badge>
                                    <Users className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                                </div>
                                <CardTitle className="font-serif text-xl">{batch.name}</CardTitle>
                                <CardDescription className="text-slate-500 font-medium">{batch.students} Students Enrolled</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-4 flex-1">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Next Test:</span>
                                        <span className="font-bold text-slate-900">{batch.nextTest}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Avg Score:</span>
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{batch.avgScore}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Button className="w-full bg-surface-2 hover:bg-primary hover:text-white text-slate-700 border-transparent shadow-none font-bold rounded-xl h-11 transition-colors group-hover:shadow-clay-inner">
                                    View Batch Analytics <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                // Batch Detail View: Stats, Create Test, Charts
                <>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">{batchName} Snapshot</h2>
                        <Link href={`/teacher/tests/create?batchId=${selectedBatch}`}>
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-clay-inner rounded-xl h-11 px-5 font-bold">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Test for this Batch
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-indigo-600 text-white rounded-3xl border-0 overflow-hidden relative shadow-clay-outer">
                            <div className="absolute right-0 top-0 opacity-10">
                                <Clock className="w-32 h-32 -mr-8 -mt-8" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between p-6 pb-2 z-10 relative">
                                <CardTitle className="text-sm font-medium text-indigo-100">Next Test</CardTitle>
                                <Clock className="h-4 w-4 text-indigo-200" />
                            </CardHeader>
                            <CardContent className="p-6 pt-0 z-10 relative">
                                <div className="text-2xl font-serif font-bold mt-1">{assignedBatches.find(b => b.id === selectedBatch)?.nextTest || 'None'}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white rounded-3xl border-0 shadow-clay-outer">
                            <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                                <CardTitle className="text-sm font-bold text-slate-500">Total Completed Tests</CardTitle>
                                <Clock className="h-5 w-5 text-amber-500" />
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="text-4xl font-serif font-bold text-slate-900">8</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white rounded-3xl border-0 shadow-clay-outer">
                            <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                                <CardTitle className="text-sm font-bold text-slate-500">Students Evaluated</CardTitle>
                                <Users className="h-5 w-5 text-emerald-500" />
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="text-4xl font-serif font-bold text-slate-900">{assignedBatches.find(b => b.id === selectedBatch)?.students}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chart */}
                        <Card className="col-span-1 lg:col-span-2 bg-white rounded-3xl border-0 shadow-clay-outer">
                            <CardHeader className="p-6 pb-2">
                                <CardTitle className="font-serif">Batch Performance Trend</CardTitle>
                                <CardDescription>Average scores over the last 6 weeks</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="h-[250px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Table Wrapper */}
                        <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
                            <div className="flex items-center justify-between ml-1">
                                <h2 className="text-lg font-serif font-bold text-slate-800">Recent Tests</h2>
                                <Link href="/teacher/tests" className="text-sm font-bold text-primary hover:underline">View All</Link>
                            </div>
                            <div className="space-y-3">
                                {recentTests.map((test) => (
                                    <Link href={`/teacher/tests/${test.id}/analytics`} key={test.id}>
                                        <div className="bg-white p-4 rounded-2xl shadow-clay-outer hover:border-primary border border-transparent transition-colors cursor-pointer group flex flex-col gap-2">
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{test.name}</h3>
                                                <Badge variant="outline" className={`text-[10px] px-2 py-0 h-4 border-none font-bold uppercase ${test.status === 'Active' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>{test.status}</Badge>
                                            </div>
                                            <div className="flex items-end justify-between mt-1">
                                                <p className="text-xs text-slate-500 font-medium">{test.date}</p>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Avg Score</span>
                                                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">{test.score}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function TeacherDashboard() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-bold text-slate-500">Loading Dashboard...</div>}>
            <TeacherDashboardContent />
        </Suspense>
    );
}
