"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Grid3X3, ArrowRight, Focus, Clock3 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const totalQuestions = 30;
const answeredCount = 4;
const markedCount = 1;
const notAnsweredCount = 1;
const attemptedCount = answeredCount + markedCount + notAnsweredCount;
const remainingCount = totalQuestions - attemptedCount;

export default function TestInterfaceClient() {
    const [navigatorOpen, setNavigatorOpen] = useState(true);
    const [warnings, setWarnings] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const router = useRouter();

    const handleFinishTest = () => {
        toast.success("Test Submitted!", { description: "Your answers have been recorded. Redirecting to results..." });
        setTimeout(() => {
            router.push("/student/results/latest");
        }, 1200);
    };

    // Anti-Cheat Tracking UX (client-side only)
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        // Skip initial blur that fires during component mount
        let isInitialMount = true;
        const mountTimer = setTimeout(() => {
            isInitialMount = false;
            toast.success("Focus Mode Enabled", { description: "Your session is now monitored. Good luck!" });
        }, 1000);

        const handleBlur = () => {
            if (isInitialMount) return;
            setWarnings(prev => {
                const newCount = prev + 1;
                toast.error(`Focus Lost (${newCount}/3 Warning)`, {
                    description: "Please remain in the active test window. Repeated offenses may result in auto-submission.",
                    duration: 5000,
                });
                if (newCount >= 3) {
                    toast.error("Test Auto-Submitted due to repeated tab switching.");
                }
                return newCount;
            });
        };

        window.addEventListener("blur", handleBlur);
        window.addEventListener("contextmenu", handleContextMenu);

        return () => {
            clearTimeout(mountTimer);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    return (
        <div className="min-h-screen bg-surface flex flex-col font-sans">
            {/* Minimalist Top Bar */}
            <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 text-white font-serif font-bold h-10 w-10 flex items-center justify-center rounded-xl shadow-inner">
                        UM
                    </div>
                    <div>
                        <h1 className="text-lg font-serif font-bold text-slate-900 leading-tight">Physics Mid-Term</h1>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Candidate: Alice Johnson</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <Button variant="outline" className="hidden lg:flex border-slate-200 text-slate-600 shadow-sm" onClick={() => setNavigatorOpen(!navigatorOpen)}>
                        <Focus className="h-4 w-4 mr-2" /> Focus Mode
                    </Button>

                    {/* Mobile Palette Bottom Sheet Trigger */}
                    <div className="lg:hidden relative">
                        {warnings > 0 && <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold z-10">{warnings}</div>}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="border-slate-200 text-slate-600 shadow-sm" size="icon">
                                    <Grid3X3 className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[80vh] rounded-t-[2rem] border-slate-200 shadow-clay-outer p-6">
                                <SheetHeader className="mb-6 border-b border-slate-100 pb-4">
                                    <SheetTitle className="font-serif font-bold text-slate-800 text-left text-xl flex items-center gap-2">
                                        <Grid3X3 className="w-5 h-5 text-indigo-500" /> Question Navigator
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="grid grid-cols-5 gap-3">
                                    {[1, 2, 3, 4].map((num) => (
                                        <div key={num} className="aspect-square flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 cursor-pointer shadow-sm text-sm">{num}</div>
                                    ))}
                                    <div className="aspect-square flex items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md transform scale-105 text-sm">5</div>
                                    <div className="aspect-square flex items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold border border-amber-200 cursor-pointer shadow-sm text-sm">6</div>
                                    {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((num) => (
                                        <div key={num} className="aspect-square flex items-center justify-center rounded-xl bg-surface-2 text-slate-600 font-bold border border-slate-200 text-sm">{num}</div>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Test Arena Body */}
            <div className={`p-6 md:p-10 flex-1 grid ${navigatorOpen ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'} gap-8 mx-auto w-full max-w-[1600px] transition-all`}>
                {/* Left Pane: Question Section */}
                <div className={`${navigatorOpen ? 'lg:col-span-8 xl:col-span-9' : 'col-span-1 max-w-4xl mx-auto w-full'} flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-160px)] transition-all`}>
                    {/* Question Header */}
                    <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-surface/50">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-400 uppercase tracking-widest text-sm">Question</span>
                            <div className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-lg text-lg">5</div>
                            <span className="font-bold text-slate-400 uppercase tracking-widest text-sm">Of 30</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider">Not Answered</span>
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="p-10 flex-1 overflow-auto">
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-10 leading-snug">
                            What is the primary function of the mitochondria in a cell during the process of cellular respiration?
                        </h3>

                        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="flex flex-col space-y-4 max-w-3xl">
                            {[
                                "A. Protein synthesis and RNA transcription",
                                "B. Energy production in the form of ATP",
                                "C. DNA replication during mitosis",
                                "D. Waste disposal and cellular cleanup",
                            ].map((opt, i) => {
                                const val = String.fromCharCode(97 + i); // a, b, c, d
                                return (
                                    <Label
                                        key={val}
                                        htmlFor={`option-${val}`}
                                        className="flex items-center p-5 rounded-2xl border-2 border-slate-100 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 group has-[[data-state=checked]]:border-indigo-500 has-[[data-state=checked]]:bg-indigo-50/50"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 group-has-[[data-state=checked]]:border-indigo-500 group-has-[[data-state=checked]]:bg-indigo-500 mr-4 transition-colors">
                                            <RadioGroupItem value={val} id={`option-${val}`} className="sr-only" />
                                            <span className="text-sm font-bold text-slate-500 group-has-[[data-state=checked]]:text-white uppercase">{val}</span>
                                        </div>
                                        <span className="text-lg font-medium text-slate-700 group-has-[[data-state=checked]]:text-indigo-950 flex-1">{opt.substring(3)}</span>
                                    </Label>
                                );
                            })}
                        </RadioGroup>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-10 py-6 border-t border-slate-100 bg-surface/50 flex items-center justify-between">
                        <Button variant="ghost" className="font-bold text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl px-6 h-12">
                            Mark for Review
                        </Button>
                        <div className="flex gap-4">
                            <Button variant="outline" onClick={() => setSelectedAnswer("")} className="font-bold border-slate-200 text-slate-600 rounded-xl px-6 h-12">
                                Clear
                            </Button>
                            <Button className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 shadow-sm text-base flex items-center">
                                Save & Next <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Pane: Stats + Navigator */}
                {navigatorOpen && (
                    <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 bg-surface flex items-center justify-between">
                                <h2 className="font-serif font-bold text-slate-800 flex items-center gap-2 text-lg">
                                    <Clock3 className="w-5 h-5 text-indigo-500" /> Test Status
                                </h2>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Time Left</span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3">
                                    <span className="text-sm font-semibold text-slate-600">Time Remaining</span>
                                    <span className="font-mono font-bold text-slate-900 text-lg tracking-widest">28:45</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                                        <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">Answered</div>
                                        <div className="text-xl font-bold text-emerald-700">{answeredCount}</div>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3">
                                        <div className="text-[10px] uppercase tracking-wider text-amber-600 font-bold">Not Answered</div>
                                        <div className="text-xl font-bold text-amber-700">{notAnsweredCount}</div>
                                    </div>
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3">
                                        <div className="text-[10px] uppercase tracking-wider text-indigo-600 font-bold">Attempted</div>
                                        <div className="text-xl font-bold text-indigo-700">{attemptedCount}</div>
                                    </div>
                                    <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3">
                                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Remaining</div>
                                        <div className="text-xl font-bold text-slate-700">{remainingCount}</div>
                                    </div>
                                </div>
                                <Button onClick={handleFinishTest} className="w-full bg-slate-900 hover:bg-black text-white font-bold rounded-xl h-12 shadow-sm">
                                    Finish Test
                                </Button>
                            </div>
                        </div>

                        {/* Navigator */}
                        <div className="flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-[104px]">
                            <div className="px-6 py-5 border-b border-slate-100 bg-surface flex items-center justify-between">
                                <h2 className="font-serif font-bold text-slate-800 flex items-center gap-2 text-lg">
                                    <Grid3X3 className="w-5 h-5 text-indigo-500" /> Navigator
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-5 gap-3">
                                    {[1, 2, 3, 4].map((num) => (
                                        <div key={num} className="aspect-square flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 cursor-pointer hover:bg-emerald-200 transition-colors shadow-sm">{num}</div>
                                    ))}
                                    <div className="aspect-square flex items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md transform scale-105">5</div>
                                    <div className="aspect-square flex items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold border border-amber-200 cursor-pointer hover:bg-amber-200 transition-colors shadow-sm" title="Marked for Review">6</div>
                                    {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((num) => (
                                        <div key={num} className="aspect-square flex items-center justify-center rounded-xl bg-surface-2 text-slate-600 font-bold border border-slate-200 hover:border-indigo-300 hover:bg-white cursor-pointer transition-colors">{num}</div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-y-4 gap-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-md bg-emerald-100 border border-emerald-200"></div> <span>Answered (4)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-md bg-amber-100 border border-amber-200"></div> <span>Marked (1)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-md bg-indigo-600"></div> <span className="text-indigo-600">Current</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-md bg-surface-2 border border-slate-200"></div> <span>Not Visited</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
