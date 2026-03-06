"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback, useRef } from "react";
import { Trash2, Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

type AdminTestItem = {
    id: string;
    title: string;
    status: string;
    scheduledAt: string | null;
    durationMinutes: number;
    teacherName: string;
    teacherEmail: string;
    questionCount: number;
    attemptCount: number;
    createdAt: string;
};

type AdminTestsResponse = {
    tests: AdminTestItem[];
    total: number;
};

export default function AdminTestsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [tests, setTests] = useState<AdminTestItem[]>([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

    const fetchTests = useCallback(async (searchQuery?: string) => {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        const res = await apiClient.get<AdminTestsResponse>(`/api/admin/tests?${params.toString()}`);
        if (res.ok) {
            setTests(res.data.tests);
            setTotal(res.data.total);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => { fetchTests(); }, [fetchTests]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchTests(value), 400);
    };

    const handleDelete = (id: string, title: string) => {
        setDeleteTarget({ id, title });
    };

    const handlePermanentDelete = async () => {
        if (!deleteTarget) return;
        const res = await apiClient.delete(`/api/admin/tests/${deleteTarget.id}`);
        if (res.ok) {
            toast.success("Test Deleted", { description: `"${deleteTarget.title}" has been deleted.` });
            fetchTests();
            setDeleteTarget(null); // Close the dialog
        } else {
            toast.error("Failed to delete test", { description: res.message });
        }
    };

    const statusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s === "published") return "bg-emerald-50 text-emerald-700 border-none";
        if (s === "draft") return "bg-amber-50 text-amber-700 border-none";
        return "bg-slate-100 text-slate-500 border-none";
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4" style={{ borderColor: 'var(--border-soft)' }}>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Test Management</h1>
                    <p className="text-slate-500 mt-1">View and manage all tests across all teachers.</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search tests by name..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 bg-surface-2 border-transparent h-12 rounded-xl font-medium"
                    />
                </div>
                <Badge variant="outline" className="text-sm font-bold px-4 py-2 rounded-xl">{total} tests</Badge>
            </div>

            <Card className="bg-white border-0 rounded-3xl overflow-hidden" style={{ boxShadow: 'var(--shadow-clay-outer)' }}>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow>
                                <TableHead className="font-semibold text-slate-700 pl-6">Test Name</TableHead>
                                <TableHead className="font-semibold text-slate-700">Teacher</TableHead>
                                <TableHead className="font-semibold text-slate-700">Scheduled</TableHead>
                                <TableHead className="font-semibold text-slate-700">Duration</TableHead>
                                <TableHead className="font-semibold text-slate-700">Qs</TableHead>
                                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-center">Attempts</TableHead>
                                <TableHead className="text-right pr-6 font-semibold text-slate-700">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [1, 2, 3, 4].map((i) => (
                                    <TableRow key={`skeleton-${i}`}>
                                        <TableCell className="pl-6"><Skeleton className="h-5 w-40 rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-28 rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24 rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16 rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-8 rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto rounded-md" /></TableCell>
                                        <TableCell className="text-right pr-6"><Skeleton className="h-8 w-10 ml-auto rounded-lg" /></TableCell>
                                    </TableRow>
                                ))
                            ) : tests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                                        No tests found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tests.map((test) => (
                                    <TableRow key={test.id} className="group">
                                        <TableCell className="font-medium text-slate-900 pl-6">{test.title}</TableCell>
                                        <TableCell className="text-slate-600 text-sm">{test.teacherName}</TableCell>
                                        <TableCell className="text-slate-600 text-sm">
                                            {test.scheduledAt ? new Date(test.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : <span className="text-slate-400">—</span>}
                                        </TableCell>
                                        <TableCell className="text-slate-600">{test.durationMinutes} min</TableCell>
                                        <TableCell className="text-slate-600 font-bold">{test.questionCount}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={`shadow-none font-bold tracking-wide uppercase text-[10px] px-2.5 py-1 rounded-full ${statusBadge(test.status)}`}>
                                                {test.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-700 text-center">{test.attemptCount}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(test.id, test.title)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <DeleteConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
                itemName={deleteTarget?.title || ""}
                itemType="test"
                showDisableOption={false}
                onPermanentDelete={handlePermanentDelete}
            />
        </div>
    );
}
