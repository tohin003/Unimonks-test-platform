"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { UploadCloud, Wand2, Clock, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function BuilderSkeletonPanels() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            {/* Left Pane: Questions List */}
            <Card className="lg:col-span-3 bg-white h-[calc(100vh-220px)] flex flex-col overflow-hidden p-0 border-0 shadow-clay-outer rounded-3xl">
                <div className="py-5 px-5 border-b bg-surface flex justify-between items-center" style={{ borderColor: 'var(--border-soft)' }}>
                    <Skeleton className="h-6 w-24 rounded-md" />
                    <Skeleton className="h-5 w-8 rounded-full" />
                </div>
                <div className="flex-1 overflow-auto bg-white p-4 space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-5/6 rounded-md" />
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t bg-surface" style={{ borderColor: 'var(--border-soft)' }}>
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
            </Card>

            {/* Middle Pane: Editor */}
            <Card className="lg:col-span-6 bg-white h-auto border-0 p-0 overflow-hidden shadow-clay-outer rounded-3xl">
                <div className="py-5 px-6 border-b bg-surface flex justify-between items-center" style={{ borderColor: 'var(--border-soft)' }}>
                    <Skeleton className="h-6 w-36 rounded-md" />
                </div>
                <CardContent className="p-8 flex flex-col gap-8">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-[120px] w-full rounded-2xl" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32 rounded-md mb-2" />
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                    </div>
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <Skeleton className="h-4 w-36 rounded-md" />
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Right Pane: Settings */}
            <Card className="lg:col-span-3 bg-white h-auto flex flex-col border-0 p-0 overflow-hidden shadow-clay-outer rounded-3xl">
                <div className="py-5 px-6 border-b bg-surface" style={{ borderColor: 'var(--border-soft)' }}>
                    <Skeleton className="h-6 w-32 rounded-md" />
                </div>
                <CardContent className="p-6 flex-1 flex flex-col gap-6">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-20 rounded-md" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-36 rounded-md" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                </CardContent>
                <div className="p-6 border-t bg-surface" style={{ borderColor: 'var(--border-soft)' }}>
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            </Card>
        </div>
    );
}

function TestBuilderForm() {
    const searchParams = useSearchParams();
    const defaultBatchId = searchParams.get("batchId") || "all";
    const editId = searchParams.get("edit");

    const [isLoading, setIsLoading] = useState(!!editId);
    const [isDraftMode, setIsDraftMode] = useState(!!editId);
    const [isGenerating, setIsGenerating] = useState(false);
    const [openAIModal, setOpenAIModal] = useState(false);

    // AI Variables
    const [aiBatch, setAiBatch] = useState(defaultBatchId);
    const [aiDuration, setAiDuration] = useState("60");
    const [aiDate, setAiDate] = useState("");
    const [aiStartTime, setAiStartTime] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // Form State
    const [testName, setTestName] = useState("");
    const [description, setDescription] = useState("");
    const [assignedBatch, setAssignedBatch] = useState(defaultBatchId);
    const [testDate, setTestDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [testDuration, setTestDuration] = useState("60");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (editId) {
            // Simulate fetching an existing test if editing
            const timer = setTimeout(() => {
                setTestName("Advanced Physics Mid-Term");
                setDescription("Comprehensive exam for the advanced batch covering mechanics and thermodynamics.");
                setAssignedBatch("batch1");
                setTestDate("2024-10-25");
                setStartTime("09:00");
                setTestDuration("90");
                setIsLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [editId]);

    const handleAIGenerate = () => {
        if (!file) {
            toast.error("File Required", { description: "Please upload a .docx or .pdf file first." });
            return;
        }
        setOpenAIModal(false);
        setIsGenerating(true);
        // Simulate API generation delay with skeletons
        setTimeout(() => {
            setIsGenerating(false);
            setIsDraftMode(true);
            setFile(null); // Reset on success

            // Populate form with generated stuff
            setTestName("Generated Magic Test");
            setDescription(`Test successfully parsed from ${file.name}`);
            setAssignedBatch(aiBatch);
            setTestDuration(aiDuration);
            setTestDate(aiDate);
            setStartTime(aiStartTime);

            toast.success("Magic Generated!", { description: "Review and edit the extracted questions below." });
        }, 2500);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto h-full pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4" style={{ borderColor: 'var(--border-soft)' }}>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Test Builder</h1>
                        {isDraftMode && (
                            <Badge className="bg-amber-100 text-amber-800 border-0 hover:bg-amber-100 px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-md">Draft Mode</Badge>
                        )}
                    </div>
                    <p className="text-slate-500 mt-1">Create manually or import a document to magically generate questions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={openAIModal} onOpenChange={setOpenAIModal}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="shadow-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50 bg-indigo-50/50 rounded-xl h-11 px-5 font-bold">
                                <Wand2 className="h-4 w-4 mr-2" />
                                Import via AI
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] rounded-3xl p-0 overflow-hidden border-0" style={{ boxShadow: "var(--shadow-clay-outer)" }}>
                            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 text-white relative overflow-hidden">
                                <Wand2 className="absolute right-4 bottom-4 w-32 h-32 opacity-10 rotate-12" />
                                <DialogHeader className="relative z-10 text-left">
                                    <DialogTitle className="text-2xl font-serif font-bold text-white leading-tight">Extract from Document</DialogTitle>
                                    <DialogDescription className="text-indigo-100 mt-2 text-sm">
                                        Upload a .docx file containing notes or raw text. Our AI will automatically generate multiple-choice questions for you to review.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                            <div className="p-8 pb-4 space-y-6">
                                <Label htmlFor="file-upload" className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-indigo-50/30 transition-colors hover:bg-indigo-50/50 cursor-pointer group">
                                    <div className="h-12 w-12 bg-white text-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                                        <UploadCloud className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-900 font-serif tracking-tight truncate max-w-xs">
                                        {file ? file.name : "Click to upload or drag and drop"}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">Word Document (.docx) or PDF up to 5MB</p>
                                    <Input id="file-upload" type="file" accept=".docx,.pdf" className="hidden" onChange={handleFileChange} />
                                </Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Assign Batch</Label>
                                        <Select value={aiBatch} onValueChange={setAiBatch}>
                                            <SelectTrigger className="bg-surface-2 border-transparent h-11 rounded-xl">
                                                <SelectValue placeholder="Select batch" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200">
                                                <SelectItem value="all">Unassigned (Draft)</SelectItem>
                                                <SelectItem value="batch1">Physics 101 Evening</SelectItem>
                                                <SelectItem value="batch2">Physics Olympiad</SelectItem>
                                                <SelectItem value="batch3">Science Foundations</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration (Mins)</Label>
                                        <Input type="number" value={aiDuration} onChange={(e) => setAiDuration(e.target.value)} className="bg-surface-2 border-transparent h-11 rounded-xl font-bold" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">Date</Label>
                                        <Input type="date" value={aiDate} onChange={(e) => setAiDate(e.target.value)} className="bg-surface-2 border-transparent h-11 rounded-xl font-bold text-slate-900" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Start Time</Label>
                                        <Input type="time" value={aiStartTime} onChange={(e) => setAiStartTime(e.target.value)} className="bg-surface-2 border-transparent h-11 rounded-xl font-bold text-slate-900" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="px-8 pb-8 pt-4 sm:justify-between items-center">
                                <Button variant="ghost" className="text-slate-500 font-bold" onClick={() => setOpenAIModal(false)}>Cancel</Button>
                                <Button
                                    className="rounded-xl shadow-clay-inner bg-indigo-600 hover:bg-indigo-700 h-11 px-6 font-bold"
                                    onClick={handleAIGenerate}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? "Generating..." : "Generate Magic"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading || isGenerating ? (
                <BuilderSkeletonPanels />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Pane: Questions List */}
                    <Card className="lg:col-span-3 bg-white h-[calc(100vh-220px)] flex flex-col overflow-hidden p-0 border-0 shadow-clay-outer rounded-3xl">
                        <div className="py-5 px-5 border-b bg-surface flex justify-between items-center" style={{ borderColor: 'var(--border-soft)' }}>
                            <h2 className="text-lg font-serif font-bold text-slate-800">Questions</h2>
                            <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">5</span>
                        </div>
                        <div className="flex-1 overflow-auto bg-white">
                            <div className="flex flex-col">
                                <div className="p-4 border-b border-slate-100 bg-indigo-50 border-l-4 border-l-indigo-600 cursor-pointer">
                                    <p className="text-sm font-medium text-slate-900 line-clamp-2">Q1. What is the primary function of the mitochondria in a cell?</p>
                                </div>
                                <div className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer border-l-4 border-l-transparent transition-colors">
                                    <p className="text-sm text-slate-600 font-medium line-clamp-2">Q2. Which element has the chemical symbol Fe?</p>
                                </div>
                                <div className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer border-l-4 border-l-transparent transition-colors">
                                    <p className="text-sm text-slate-600 font-medium line-clamp-2">Q3. What process do plants use to make their own food?</p>
                                </div>
                                <div className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer border-l-4 border-l-transparent transition-colors">
                                    <p className="text-sm text-slate-600 font-medium line-clamp-2">Q4. What is the chemical formula for water?</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-surface" style={{ borderColor: 'var(--border-soft)' }}>
                            <Button variant="outline" className="w-full bg-white shadow-sm border-slate-200 font-bold text-slate-700 h-11 rounded-xl hover:text-primary transition-colors">Add Blank Question</Button>
                        </div>
                    </Card>

                    {/* Middle Pane: Question Editor */}
                    <Card className="lg:col-span-6 bg-white h-auto border-0 p-0 overflow-hidden shadow-clay-outer rounded-3xl">
                        <div className="py-5 px-6 border-b bg-surface flex justify-between items-center" style={{ borderColor: 'var(--border-soft)' }}>
                            <h2 className="text-lg font-serif font-bold text-slate-800">Question Editor</h2>
                        </div>
                        <CardContent className="p-8 flex flex-col gap-8">
                            <div className="space-y-3">
                                <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider">Question Stem</Label>
                                <Textarea
                                    placeholder="Enter question here..."
                                    className="min-h-[120px] resize-none bg-surface-2 border-transparent focus-visible:ring-indigo-500 p-4 text-base font-medium text-slate-900 rounded-2xl"
                                    defaultValue={editId ? "Which physical law states that for every action, there is an equal and opposite reaction?" : "What is the primary function of the mitochondria in a cell?"}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider mb-2 block">Answer Options</Label>
                                {["Option A", "Option B", "Option C", "Option D"].map((opt, i) => (
                                    <Input key={i} placeholder={opt} defaultValue={`Answer mapped to ${opt}`} className="bg-surface-2 font-medium text-slate-800 border-transparent h-12 focus-visible:ring-indigo-500 rounded-xl px-4" />
                                ))}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider">Select correct answer</Label>
                                <RadioGroup defaultValue="option-option-a" className="grid grid-cols-2 gap-4">
                                    {["Option A", "Option B", "Option C", "Option D"].map((opt, i) => (
                                        <div key={i} className="flex items-center space-x-3 border p-4 rounded-xl border-slate-200/60 bg-white hover:bg-indigo-50/50 hover:border-indigo-200 cursor-pointer transition-colors shadow-sm focus-within:ring-2 ring-indigo-500">
                                            <RadioGroupItem value={`option-${opt.toLowerCase().replace(" ", "-")}`} id={`option-${i}`} />
                                            <Label htmlFor={`option-${i}`} className="cursor-pointer flex-1 font-bold text-slate-700">{opt}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div className="space-y-3">
                                    <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5">Points</Label>
                                    <Input type="number" defaultValue="1" className="bg-surface-2 border-transparent h-12 rounded-xl px-4 font-bold text-slate-900" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5">Difficulty Level</Label>
                                    <Select defaultValue="medium">
                                        <SelectTrigger className="bg-surface-2 border-transparent h-12 rounded-xl px-4 font-bold text-slate-800">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 font-medium">
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Pane: Test Settings */}
                    <Card className="lg:col-span-3 bg-white h-auto flex flex-col border-0 p-0 overflow-hidden shadow-clay-outer rounded-3xl">
                        <div className="py-5 px-6 border-b bg-surface" style={{ borderColor: 'var(--border-soft)' }}>
                            <h2 className="text-lg font-serif font-bold text-slate-800">Test Settings</h2>
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col gap-6">
                            <div className="space-y-3">
                                <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider">Test Name</Label>
                                <Input value={testName} onChange={e => setTestName(e.target.value)} placeholder="e.g. Physics Mid-Term" className="bg-surface-2 border-transparent h-12 rounded-xl px-4 font-bold text-slate-900" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider">Description</Label>
                                <Textarea
                                    className="resize-none h-24 bg-surface-2 border-transparent rounded-xl p-4 font-medium text-slate-800"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Provide instructions or context for this test."
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Assign To Batches</Label>
                                <Select value={assignedBatch} onValueChange={setAssignedBatch}>
                                    <SelectTrigger className="bg-surface-2 border-transparent h-12 rounded-xl px-4 font-bold text-slate-800">
                                        <SelectValue placeholder="Select batch" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 font-medium">
                                        <SelectItem value="all">Unassigned (Draft)</SelectItem>
                                        <SelectItem value="batch1">Physics 101 Evening</SelectItem>
                                        <SelectItem value="batch2">Physics Olympiad</SelectItem>
                                        <SelectItem value="batch3">Science Foundations</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 border-t border-slate-100 space-y-4">
                                <h3 className="font-serif font-bold text-slate-800 text-sm">Schedule Test</h3>
                                <div className="space-y-3">
                                    <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5">Date</Label>
                                    <Input type="date" value={testDate} onChange={e => setTestDate(e.target.value)} className="bg-surface-2 border-transparent h-12 rounded-xl px-4 font-bold text-slate-900" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Start Time</Label>
                                        <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-surface-2 border-transparent h-12 rounded-xl px-4 font-bold text-slate-900" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-slate-700 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration (Mins)</Label>
                                        <Input type="number" value={testDuration} onChange={e => setTestDuration(e.target.value)} className="bg-surface-2 border-transparent h-12 rounded-xl px-4 font-bold text-slate-900" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-6 border-t bg-surface" style={{ borderColor: 'var(--border-soft)' }}>
                            <Button className="w-full h-12 rounded-xl text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-clay-inner">
                                {isDraftMode ? "Publish Test" : "Save Draft"}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default function TestBuilderPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-bold text-slate-500">Loading Test Builder...</div>}>
            <TestBuilderForm />
        </Suspense>
    );
}
