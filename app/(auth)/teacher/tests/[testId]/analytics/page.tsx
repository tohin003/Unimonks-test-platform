"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { ArrowLeft, Download, Users, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Data
const scoreDistribution = [
    { range: "0-20%", count: 2 },
    { range: "21-40%", count: 5 },
    { range: "41-60%", count: 15 },
    { range: "61-80%", count: 42 },
    { range: "81-100%", count: 28 },
];

export default function TestAnalyticsPage() {
    const params = useParams();

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4" style={{ borderColor: 'var(--border-soft)' }}>
                <div>
                    <Link href="/teacher/dashboard" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-2 font-semibold transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Physics Mid-Term Analytics</h1>
                    <p className="text-slate-500 mt-1">Detailed performance breakdown and insights.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="shadow-sm border-slate-200">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white">
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Average Score
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">78.5%</div>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Completion Rate
                            <Users className="h-4 w-4 text-indigo-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">92%</div>
                        <p className="text-xs text-slate-500 mt-1">110 / 120 Students</p>
                    </CardContent>
                </Card>
                <Card className="bg-white">
                    <CardHeader className="pb-2 p-6">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
                            Avg. Time Taken
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-serif font-bold text-slate-900">42m</div>
                        <p className="text-xs text-slate-500 mt-1">Out of 60m total time</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full mt-2">
                <TabsList className="bg-surface-2 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                    <TabsTrigger value="students" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Student List</TabsTrigger>
                    <TabsTrigger value="questions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Question Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <Card className="bg-white">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="font-serif text-xl">Score Distribution</CardTitle>
                            <CardDescription>Number of students falling into each score percentile</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={scoreDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                        <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                            {
                                                scoreDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 3 ? '#4F46E5' : '#94A3B8'} />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="students" className="mt-6">
                    <Card className="bg-white overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-white">
                            <h2 className="text-xl font-serif font-bold text-slate-800">Student Performances</h2>
                        </div>
                        <Table>
                            <TableHeader className="bg-slate-50/80 hover:bg-slate-50/80">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-slate-700 pl-6 h-12">Student Name</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Score</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Time Taken</TableHead>
                                    <TableHead className="text-right pr-6 font-semibold text-slate-700">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium text-slate-900 pl-6">Alice Johnson</TableCell>
                                    <TableCell className="text-emerald-600 font-bold">95%</TableCell>
                                    <TableCell className="text-slate-600">38m 12s</TableCell>
                                    <TableCell className="text-right pr-6"><Badge variant="outline" className="bg-white">Evaluated</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-slate-900 pl-6">Bob Smith</TableCell>
                                    <TableCell className="text-amber-600 font-bold">65%</TableCell>
                                    <TableCell className="text-slate-600">55m 01s</TableCell>
                                    <TableCell className="text-right pr-6"><Badge variant="outline" className="bg-white">Evaluated</Badge></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="questions" className="mt-6">
                    <Card className="bg-white p-6 pb-8">
                        <CardTitle className="font-serif mb-6 text-xl">Toughest Questions</CardTitle>
                        <div className="space-y-6">
                            <div className="border border-slate-200 rounded-2xl p-6 relative overflow-hidden bg-white shadow-sm">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge className="mb-3 bg-rose-50 text-rose-700 hover:bg-rose-100 border-0 px-2 py-0.5 rounded-md font-bold uppercase text-[10px] tracking-wider">22% Correct</Badge>
                                        <p className="font-medium text-slate-900 text-base font-serif">What is the rate of change of momentum?</p>
                                    </div>
                                </div>
                                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="bg-surface-2 p-3 rounded-xl flex justify-between items-center border border-transparent"><span className="text-slate-700 font-medium">A. Velocity</span> <span className="font-semibold text-slate-500">15%</span></div>
                                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex justify-between items-center shadow-sm"><span className="text-emerald-900 font-bold">B. Force</span> <span className="font-bold text-emerald-700">22% (Correct)</span></div>
                                    <div className="bg-surface-2 p-3 rounded-xl flex justify-between items-center border border-transparent"><span className="text-slate-700 font-medium">C. Acceleration</span> <span className="font-semibold text-slate-500">58%</span></div>
                                    <div className="bg-surface-2 p-3 rounded-xl flex justify-between items-center border border-transparent"><span className="text-slate-700 font-medium">D. Power</span> <span className="font-semibold text-slate-500">5%</span></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
