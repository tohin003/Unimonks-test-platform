"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

// Mock Data
const tests = [
    { id: 1, name: "Physics Mid-Term", batch: "Physics 101 Evening", batchCode: "PHY-101-E", date: "Oct 25, 2024", status: "Active", responses: 120 },
    { id: 2, name: "Chemistry Quiz", batch: "Chemistry Advanced", batchCode: "CHE-ADV-M", date: "Oct 20, 2024", status: "Completed", responses: 115 },
    { id: 3, name: "Biology Unit Test", batch: "Biology Prep 2024", batchCode: "BIO-PRP-24", date: "Oct 15, 2024", status: "Completed", responses: 118 },
];

export default function MyTestsPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: 'var(--border-soft)' }}>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">My Tests</h1>
                    <p className="text-slate-500 mt-1">View and manage all your created tests.</p>
                </div>
                <Link href="/teacher/tests/create">
                    <Button className="flex items-center gap-2 rounded-xl px-6 h-12 shadow-clay-inner font-bold text-base">
                        <Plus className="h-4 w-4" />
                        Create New Test
                    </Button>
                </Link>
            </div>

            <Card className="bg-white border-0 rounded-3xl overflow-hidden" style={{ boxShadow: 'var(--shadow-clay-outer)' }}>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow>
                                <TableHead className="font-semibold text-slate-700 w-[200px] pl-6">Test Name</TableHead>
                                <TableHead className="font-semibold text-slate-700">Batch</TableHead>
                                <TableHead className="font-semibold text-slate-700">Date Created</TableHead>
                                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-center">Responses</TableHead>
                                <TableHead className="text-right pr-6 font-semibold text-slate-700">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [1, 2, 3].map((i) => (
                                    <TableRow key={`skeleton-${i}`}>
                                        <TableCell className="pl-6"><Skeleton className="h-5 w-40 rounded-md" /></TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Skeleton className="h-4 w-32 rounded-md" />
                                                <Skeleton className="h-3 w-20 rounded-md" />
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-4 w-24 rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto rounded-md" /></TableCell>
                                        <TableCell className="text-right pr-6 flex justify-end gap-2">
                                            <Skeleton className="h-8 w-14 rounded-lg" />
                                            <Skeleton className="h-8 w-20 rounded-lg" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                tests.map((test) => (
                                    <TableRow key={test.id} className="group">
                                        <TableCell className="font-medium text-slate-900 pl-6">
                                            {test.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-700">{test.batch}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">{test.batchCode}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{test.date}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={test.status === "Active"
                                                    ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/50 shadow-none font-bold tracking-wide uppercase text-[10px] px-2.5 py-1 rounded-full border-none"
                                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-none font-bold tracking-wide uppercase text-[10px] px-2.5 py-1 rounded-full border-none"}
                                            >
                                                {test.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-700 text-center">{test.responses}</TableCell>
                                        <TableCell className="text-right pr-6 flex justify-end gap-2">
                                            <Link href={`/teacher/tests/create?edit=${test.id}`}>
                                                <Button variant="outline" size="sm" className="h-8 shadow-sm rounded-lg hover:text-primary transition-colors">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Link href={`/teacher/tests/${test.id}/analytics`}>
                                                <Button variant="secondary" size="sm" className="h-8 shadow-sm rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 hover:shadow-inner">
                                                    Analytics
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
