"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Settings, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, use } from "react";

// Mock batch data lookup
const batchDataMap: Record<string, { name: string; code: string; teacher: string; students: number; tests: number; attendance: string; status: string }> = {
    "1": { name: "Physics 101 Evening", code: "PHY-101-E", teacher: "Dr. Sarah Jenkins", students: 120, tests: 4, attendance: "94%", status: "Active" },
    "2": { name: "Chemistry Advanced", code: "CHE-ADV-M", teacher: "Prof. Michael Chen", students: 85, tests: 3, attendance: "89%", status: "Active" },
    "3": { name: "Mathematics Fundamentals", code: "MAT-FUN-01", teacher: "Emily Roberts", students: 210, tests: 6, attendance: "91%", status: "Active" },
    "4": { name: "Biology Prep 2024", code: "BIO-PRP-24", teacher: "Dr. Amanda Torres", students: 95, tests: 5, attendance: "97%", status: "Completed" },
    "5": { name: "Physics Olympiad Batch", code: "PHY-OLY-X", teacher: "Dr. Sarah Jenkins", students: 25, tests: 2, attendance: "100%", status: "Upcoming" },
};

export default function BatchDetailsPage({ params }: { params: Promise<{ batchId: string }> }) {
    const { batchId } = use(params);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const batch = batchDataMap[batchId] || {
        name: `Batch ${batchId}`,
        code: `BATCH-${batchId}`,
        teacher: "Unknown Teacher",
        students: 0,
        tests: 0,
        attendance: "—",
        status: "Unknown",
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
            {/* Context Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4" style={{ borderColor: "var(--border-soft)" }}>
                {isLoading ? (
                    <div className="w-full">
                        <Skeleton className="h-4 w-28 mb-4 rounded-md" />
                        <div className="flex items-center gap-3 mb-2">
                            <Skeleton className="h-9 w-64 rounded-md" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-56 rounded-md" />
                    </div>
                ) : (
                    <div>
                        <Link href="/admin/batches" className="inline-flex items-center text-sm font-bold text-primary hover:underline mb-2">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Batches
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{batch.name}</h1>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-none px-2 py-0.5 text-xs">{batch.code}</Badge>
                        </div>
                        <p className="text-slate-500 mt-1 font-medium">{batch.teacher} • {batch.students} Students Enrolled</p>
                    </div>
                )}
                {isLoading ? (
                    <Skeleton className="h-11 w-40 rounded-xl" />
                ) : (
                    <Button className="bg-surface-2 hover:bg-white text-slate-700 font-bold border-transparent rounded-xl shadow-sm h-11">
                        <Settings className="w-4 h-4 mr-2" /> Manage Settings
                    </Button>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white rounded-3xl border-0 shadow-clay-outer">
                    <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500">Total Enrolled</CardTitle>
                        <Users className="h-5 w-5 text-indigo-500" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        {isLoading ? <Skeleton className="h-10 w-16" /> : <div className="text-4xl font-serif font-bold text-slate-900">{batch.students}</div>}
                    </CardContent>
                </Card>
                <Card className="bg-white rounded-3xl border-0 shadow-clay-outer">
                    <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500">Active Tests</CardTitle>
                        <FileText className="h-5 w-5 text-emerald-500" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        {isLoading ? <Skeleton className="h-10 w-12" /> : <div className="text-4xl font-serif font-bold text-slate-900">{batch.tests}</div>}
                    </CardContent>
                </Card>
                <Card className="bg-white rounded-3xl border-0 shadow-clay-outer">
                    <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500">Avg. Attendance</CardTitle>
                        <Users className="h-5 w-5 text-amber-500" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        {isLoading ? <Skeleton className="h-10 w-20" /> : <div className="text-4xl font-serif font-bold text-slate-900">{batch.attendance}</div>}
                    </CardContent>
                </Card>
            </div>

            {/* Batch Sub-Navigation / Content */}
            <Tabs defaultValue="users" className="w-full">
                <TabsList className="bg-surface-2 p-1 rounded-xl w-full justify-start h-auto flex-wrap mb-6" style={{ border: 'var(--border-soft)' }}>
                    <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold px-6 py-2.5">
                        Students ({batch.students})
                    </TabsTrigger>
                    <TabsTrigger value="tests" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold px-6 py-2.5">
                        Tests & Assignments ({batch.tests})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="outline-none">
                    <Card className="bg-white border-0 rounded-3xl shadow-clay-outer p-6">
                        {isLoading ? (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <Skeleton className="h-7 w-48 rounded-md" />
                                    <Skeleton className="h-9 w-32 rounded-lg" />
                                </div>
                                <Skeleton className="h-[120px] w-full rounded-2xl" />
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-serif font-bold text-slate-900">Enrolled Students</h2>
                                    <Button size="sm" className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold shadow-none border-none rounded-lg h-9">
                                        <Plus className="w-4 h-4 mr-2" /> Add Student
                                    </Button>
                                </div>
                                <div className="text-center font-medium text-slate-400 py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-surface/30">
                                    Student list table would render here, scoped specifically to {batch.code}.
                                </div>
                            </>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent value="tests" className="outline-none">
                    <Card className="bg-white border-0 rounded-3xl shadow-clay-outer p-6">
                        {isLoading ? (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <Skeleton className="h-7 w-48 rounded-md" />
                                    <Skeleton className="h-9 w-32 rounded-lg" />
                                </div>
                                <Skeleton className="h-[120px] w-full rounded-2xl" />
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-serif font-bold text-slate-900">Batch Assessments</h2>
                                    <Button size="sm" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold shadow-none border-none rounded-lg h-9">
                                        <Plus className="w-4 h-4 mr-2" /> Assign Test
                                    </Button>
                                </div>
                                <div className="text-center font-medium text-slate-400 py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-surface/30">
                                    Test catalog table would render here, scoped specifically to {batch.code}.
                                </div>
                            </>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
