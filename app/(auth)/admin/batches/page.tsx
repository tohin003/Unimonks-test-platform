"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreVertical, Edit, Users, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

const initialBatches = [
    { id: 1, name: "Physics 101 Evening", code: "PHY-101-E", teacher: "Dr. Sarah Jenkins", students: 120, status: "Active" },
    { id: 2, name: "Chemistry Advanced", code: "CHE-ADV-M", teacher: "Prof. Michael Chen", students: 85, status: "Active" },
    { id: 3, name: "Mathematics Fundamentals", code: "MAT-FUN-01", teacher: "Emily Roberts", students: 210, status: "Active" },
    { id: 4, name: "Biology Prep 2024", code: "BIO-PRP-24", teacher: "Dr. Amanda Torres", students: 95, status: "Completed" },
    { id: 5, name: "Physics Olympiad Batch", code: "PHY-OLY-X", teacher: "Dr. Sarah Jenkins", students: 25, status: "Upcoming" },
];

export default function AdminBatchesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [createSheetOpen, setCreateSheetOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const filteredBatches = useMemo(() => {
        return initialBatches.filter((batch) => {
            const matchesSearch = searchQuery === "" ||
                batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                batch.code.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || batch.status.toLowerCase() === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    const handleCreateBatch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("batch-name") as string;
        toast.success("Batch Created", { description: `${name || "New batch"} has been created.` });
        setCreateSheetOpen(false);
    };

    const handleSaveBatch = (batchName: string) => {
        toast.success("Batch Updated", { description: `Changes to ${batchName} have been saved.` });
    };

    const handleDeleteBatch = (batchName: string) => {
        toast.error("Batch Deleted", { description: `${batchName} has been removed.` });
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4" style={{ borderColor: "var(--border-soft)" }}>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Batch Management</h1>
                    <p className="text-slate-500 mt-1">Create and assign students to their respective study batches.</p>
                </div>
                <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 rounded-xl px-6 h-12 shadow-clay-inner text-white font-bold text-base">
                            <Plus className="h-5 w-5 mr-2" />
                            Create New Batch
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="border-l-0 shadow-clay-outer p-0 sm:max-w-md w-full flex flex-col">
                        <div className="p-6 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                            <SheetHeader>
                                <SheetTitle className="font-serif text-2xl text-slate-900">Create New Batch</SheetTitle>
                                <SheetDescription>
                                    Add a new batch to assign tests and students to.
                                </SheetDescription>
                            </SheetHeader>
                        </div>
                        <form onSubmit={handleCreateBatch} className="flex flex-col flex-1">
                            <div className="p-6 flex-1 overflow-auto grid gap-6 content-start text-left">
                                <div className="grid gap-2">
                                    <Label htmlFor="new-name" className="font-bold text-slate-700">Batch Name</Label>
                                    <Input id="new-name" name="batch-name" placeholder="e.g. Physics 101 Evening" required className="rounded-xl h-11 bg-surface-2 border-transparent" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-code" className="font-bold text-slate-700">Batch Code</Label>
                                    <Input id="new-code" name="batch-code" placeholder="e.g. PHY-101-E" required className="rounded-xl h-11 bg-surface-2 border-transparent" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-teacher" className="font-bold text-slate-700">Primary Teacher</Label>
                                    <Input id="new-teacher" name="batch-teacher" placeholder="e.g. Dr. Sarah Jenkins" className="rounded-xl h-11 bg-surface-2 border-transparent" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-status" className="font-bold text-slate-700">Status</Label>
                                    <Select name="batch-status" defaultValue="active">
                                        <SelectTrigger className="rounded-xl h-11 bg-surface-2 border-transparent">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="upcoming">Upcoming</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-surface-2 flex gap-2 justify-end" style={{ borderColor: 'var(--border-soft)' }}>
                                <SheetClose asChild>
                                    <Button type="button" variant="outline" className="rounded-xl h-12 border-transparent shadow-sm bg-white">Cancel</Button>
                                </SheetClose>
                                <Button type="submit" className="rounded-xl h-12 bg-primary text-white font-bold shadow-clay-inner">Create Batch</Button>
                            </div>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            <Card className="bg-card border-0 rounded-3xl overflow-hidden shadow-sm" style={{ boxShadow: "var(--shadow-clay-outer)" }}>
                {isLoading ? (
                    <CardHeader className="p-6 border-b bg-surface-2 flex flex-col md:flex-row gap-4 items-center justify-between" style={{ borderColor: 'var(--border-soft)' }}>
                        <Skeleton className="h-11 w-full md:w-1/3 rounded-xl" />
                        <div className="w-full md:w-auto flex gap-3">
                            <Skeleton className="h-11 w-full md:w-[160px] rounded-xl" />
                        </div>
                    </CardHeader>
                ) : (
                    <CardHeader className="p-6 border-b bg-surface-2 flex flex-col md:flex-row gap-4 items-center justify-between" style={{ borderColor: 'var(--border-soft)' }}>
                        <div className="w-full md:w-1/3 relative">
                            <Search className="h-5 w-5 absolute left-3 top-3 text-slate-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search batches by name or code..."
                                className="pl-10 h-11 bg-white border-transparent shadow-sm rounded-xl font-medium focus-visible:ring-primary"
                            />
                        </div>
                        <div className="w-full md:w-auto flex gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[160px] h-11 bg-white border-transparent shadow-sm rounded-xl font-medium">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-surface border-b text-slate-600 font-serif" style={{ borderColor: 'var(--border-soft)' }}>
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-800">Batch Name</th>
                                <th className="px-6 py-4 font-bold text-slate-800">Batch Code</th>
                                <th className="px-6 py-4 font-bold text-slate-800">Primary Teacher</th>
                                <th className="px-6 py-4 font-bold text-slate-800 text-center">Students Enrolled</th>
                                <th className="px-6 py-4 font-bold text-slate-800">Status</th>
                                <th className="px-6 py-4 font-bold text-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={`skeleton-${i}`}>
                                        <td className="px-6 py-5"><Skeleton className="h-5 w-40 rounded-md" /></td>
                                        <td className="px-6 py-5"><Skeleton className="h-4 w-24 rounded-md" /></td>
                                        <td className="px-6 py-5"><Skeleton className="h-4 w-32 rounded-md" /></td>
                                        <td className="px-6 py-5 text-center"><Skeleton className="h-6 w-16 mx-auto rounded-xl" /></td>
                                        <td className="px-6 py-5"><Skeleton className="h-5 w-20 rounded-full" /></td>
                                        <td className="px-6 py-5 text-right flex justify-end gap-1">
                                            <Skeleton className="h-8 w-8 rounded-xl" />
                                            <Skeleton className="h-8 w-8 rounded-xl" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                filteredBatches.map((batch) => (
                                    <tr key={batch.id} className="hover:bg-surface/30 transition-colors group">
                                        <td className="px-6 py-5 font-bold text-slate-900 font-serif group-hover:text-primary transition-colors">
                                            <Link href={`/admin/batches/${batch.id}`} className="hover:underline">
                                                {batch.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5 font-mono text-xs text-slate-500 font-medium tracking-wide">
                                            {batch.code}
                                        </td>
                                        <td className="px-6 py-5 font-medium text-slate-700">
                                            {batch.teacher}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="inline-flex items-center justify-center bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-xl shadow-inner gap-2">
                                                <Users className="h-3 w-3 text-slate-500" />
                                                {batch.students}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant="outline" className={`border-none font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 ${batch.status === 'Active' ? 'bg-indigo-50 text-indigo-700' :
                                                batch.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                                    'bg-amber-50 text-amber-700'
                                                }`}>
                                                {batch.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right flex justify-end">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-surface-2 rounded-xl">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent className="border-l-0 shadow-clay-outer p-0 sm:max-w-md w-full flex flex-col">
                                                    <div className="p-6 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                                                        <SheetHeader>
                                                            <SheetTitle className="font-serif text-2xl text-slate-900">Edit Batch</SheetTitle>
                                                            <SheetDescription>
                                                                Make changes to {batch.name} here.
                                                            </SheetDescription>
                                                        </SheetHeader>
                                                    </div>
                                                    <div className="p-6 flex-1 overflow-auto grid gap-6 content-start text-left">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor={`name-${batch.id}`} className="font-bold text-slate-700">Batch Name</Label>
                                                            <Input id={`name-${batch.id}`} defaultValue={batch.name} className="rounded-xl h-11 bg-surface-2 border-transparent" />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor={`code-${batch.id}`} className="font-bold text-slate-700">Batch Code</Label>
                                                            <Input id={`code-${batch.id}`} defaultValue={batch.code} className="rounded-xl h-11 bg-surface-2 border-transparent" />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor={`teacher-${batch.id}`} className="font-bold text-slate-700">Primary Teacher</Label>
                                                            <Input id={`teacher-${batch.id}`} defaultValue={batch.teacher} className="rounded-xl h-11 bg-surface-2 border-transparent" />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor={`status-${batch.id}`} className="font-bold text-slate-700">Status</Label>
                                                            <Select defaultValue={batch.status.toLowerCase()}>
                                                                <SelectTrigger className="rounded-xl h-11 bg-surface-2 border-transparent">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl">
                                                                    <SelectItem value="active">Active</SelectItem>
                                                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                                                    <SelectItem value="completed">Completed</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="p-6 border-t bg-surface-2 flex gap-2 justify-end" style={{ borderColor: 'var(--border-soft)' }}>
                                                        <SheetClose asChild>
                                                            <Button variant="outline" className="rounded-xl h-12 border-transparent shadow-sm bg-white">Cancel</Button>
                                                        </SheetClose>
                                                        <Button type="button" onClick={() => handleSaveBatch(batch.name)} className="rounded-xl h-12 bg-primary text-white font-bold shadow-clay-inner">Save Changes</Button>
                                                    </div>
                                                </SheetContent>
                                            </Sheet>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteBatch(batch.name)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl ml-1">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t bg-surface-2 text-center text-xs text-slate-500 font-medium" style={{ borderColor: 'var(--border-soft)' }}>
                    Showing {filteredBatches.length} of {initialBatches.length} batches
                </div>
            </Card>
        </div>
    );
}
