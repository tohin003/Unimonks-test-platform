"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { ArrowLeft, Download, Users, CheckCircle, Clock, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

// ── Types ──
interface QuestionStat {
    questionId: string;
    order: number;
    stem: string;
    difficulty: string | null;
    topic: string | null;
    correctRate: number;
    totalAttempts: number;
}

interface StudentPerf {
    id: string;
    name: string;
    score: number | null;
    percentage: number | null;
}

interface AnalyticsData {
    overview: {
        totalAttempts: number;
        avgScore: number;
        median: number;
        passRate: number;
        distribution: Record<string, number>;
    };
    topStudents: StudentPerf[];
    bottomStudents: StudentPerf[];
    questionStats: QuestionStat[];
}

export default function TestAnalyticsPage() {
    const params = useParams();
    const testId = params?.testId as string;

    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const res = await apiClient.get<AnalyticsData>(`/api/teacher/tests/${testId}/analytics`);
            if (res.ok) {
                setData(res.data);
            } else {
                setError(res.message || "Failed to load analytics");
            }
            setIsLoading(false);
        })();
    }, [testId]);

    const scoreDistribution = data
        ? [
            { range: "0-20%", count: data.overview.distribution["0-20"] || 0 },
            { range: "21-40%", count: data.overview.distribution["21-40"] || 0 },
            { range: "41-60%", count: data.overview.distribution["41-60"] || 0 },
            { range: "61-80%", count: data.overview.distribution["61-80"] || 0 },
            { range: "81-100%", count: data.overview.distribution["81-100"] || 0 },
        ]
        : [];

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-9 w-64 rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-3xl" />)}
                </div>
                <Skeleton className="h-64 rounded-3xl" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center py-20">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">Analytics Unavailable</h2>
                <p className="text-slate-500 mb-6">{error || "No data available for this test."}</p>
                <Button asChild variant="outline"><Link href="/teacher/tests">Back to Tests</Link></Button>
            </div>
        );
    }

    const maxCount = Math.max(...scoreDistribution.map(d => d.count), 1);

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4" style={{ borderColor: "var(--border-soft)" }}>
                <div>
                    <Link href="/teacher/tests" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-2 font-semibold transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Tests
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Test Analytics</h1>
                    <p className="text-slate-500 mt-1">Detailed performance breakdown and insights.</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-white rounded-2xl border-0 shadow-sm">
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Average Score <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">{data.overview.avgScore}%</div>
                    </CardContent>
                </Card>
                <Card className="bg-white rounded-2xl border-0 shadow-sm">
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Total Attempts <Users className="h-4 w-4 text-indigo-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">{data.overview.totalAttempts}</div>
                        <p className="text-xs text-slate-500 mt-1">Students</p>
                    </CardContent>
                </Card>
                <Card className="bg-white rounded-2xl border-0 shadow-sm">
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Pass Rate <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">{data.overview.passRate}%</div>
                        <p className="text-xs text-slate-500 mt-1">≥ 40% threshold</p>
                    </CardContent>
                </Card>
                <Card className="bg-white rounded-2xl border-0 shadow-sm">
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Median Score <Clock className="h-4 w-4 text-amber-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">{data.overview.median}%</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full mt-2">
                <TabsList className="bg-surface-2 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                    <TabsTrigger value="students" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Top & Bottom</TabsTrigger>
                    <TabsTrigger value="questions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Question Analysis</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                    <Card className="bg-white rounded-2xl border-0 shadow-sm">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="font-serif text-xl">Score Distribution</CardTitle>
                            <CardDescription>Number of students falling into each score percentile</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            {data.overview.totalAttempts === 0 ? (
                                <div className="text-center text-slate-400 py-16">No attempts yet. Data will appear once students take the test.</div>
                            ) : (
                                <div style={{ width: "100%", height: 300, minHeight: 300 }} className="mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={scoreDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                                            <Tooltip cursor={{ fill: "#F1F5F9" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                                {scoreDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.count === Math.max(...scoreDistribution.map(d => d.count)) ? "#4F46E5" : "#94A3B8"} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Students Tab */}
                <TabsContent value="students" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-white overflow-hidden rounded-2xl border-0 shadow-sm">
                            <div className="p-6 border-b border-slate-100 bg-emerald-50/50">
                                <h2 className="text-lg font-serif font-bold text-emerald-900">🏆 Top Performers</h2>
                            </div>
                            <Table>
                                <TableHeader className="bg-slate-50/80">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold text-slate-700 pl-6 h-10">Student</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold text-slate-700">Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.topStudents.length === 0 ? (
                                        <TableRow><TableCell colSpan={2} className="text-center text-slate-400 py-8">No data yet</TableCell></TableRow>
                                    ) : data.topStudents.map(s => (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium text-slate-900 pl-6">{s.name}</TableCell>
                                            <TableCell className="text-right pr-6 font-bold text-emerald-600">{s.percentage ?? 0}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        <Card className="bg-white overflow-hidden rounded-2xl border-0 shadow-sm">
                            <div className="p-6 border-b border-slate-100 bg-rose-50/50">
                                <h2 className="text-lg font-serif font-bold text-rose-900">⚠️ Need Support</h2>
                            </div>
                            <Table>
                                <TableHeader className="bg-slate-50/80">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold text-slate-700 pl-6 h-10">Student</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold text-slate-700">Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.bottomStudents.length === 0 ? (
                                        <TableRow><TableCell colSpan={2} className="text-center text-slate-400 py-8">No data yet</TableCell></TableRow>
                                    ) : data.bottomStudents.map(s => (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium text-slate-900 pl-6">{s.name}</TableCell>
                                            <TableCell className="text-right pr-6 font-bold text-rose-600">{s.percentage ?? 0}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </TabsContent>

                {/* Questions Tab */}
                <TabsContent value="questions" className="mt-6">
                    <Card className="bg-white p-6 pb-8 rounded-2xl border-0 shadow-sm">
                        <CardTitle className="font-serif mb-6 text-xl">Question Performance</CardTitle>
                        {data.questionStats.length === 0 ? (
                            <div className="text-center text-slate-400 py-12">No question data available yet.</div>
                        ) : (
                            <div className="space-y-4">
                                {data.questionStats
                                    .sort((a, b) => a.correctRate - b.correctRate)
                                    .map((q) => (
                                        <div key={q.questionId} className="border border-slate-200 rounded-2xl p-5 relative overflow-hidden bg-white shadow-sm">
                                            <div className={`absolute top-0 left-0 w-1.5 h-full ${q.correctRate < 40 ? "bg-rose-500" : q.correctRate < 70 ? "bg-amber-500" : "bg-emerald-500"}`} />
                                            <div className="flex items-start justify-between ml-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className={`${q.correctRate < 40 ? "bg-rose-50 text-rose-700" : q.correctRate < 70 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"} border-0 px-2 py-0.5 rounded-md font-bold uppercase text-[10px] tracking-wider`}>
                                                            {q.correctRate}% Correct
                                                        </Badge>
                                                        {q.topic && (
                                                            <Badge variant="outline" className="text-[10px] px-2 py-0.5">{q.topic}</Badge>
                                                        )}
                                                        {q.difficulty && (
                                                            <Badge variant="outline" className="text-[10px] px-2 py-0.5">{q.difficulty}</Badge>
                                                        )}
                                                    </div>
                                                    <p className="font-medium text-slate-900 text-sm font-serif">Q{q.order}. {q.stem}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{q.totalAttempts} attempt(s)</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
