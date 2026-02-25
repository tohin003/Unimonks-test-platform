"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle2, XCircle, TrendingUp, Target, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const results = [
    {
        id: "1",
        question: "What is the primary function of the mitochondria in a cell?",
        selectedAnswer: { text: "A. Protein synthesis", isCorrect: false },
        correctAnswer: { text: "B. Energy production (ATP)" },
        explanation: "The mitochondria are known as the powerhouses of the cell. They are organelles that act like a digestive system which takes in nutrients, breaks them down, and creates energy rich molecules for the cell.",
    },
    {
        id: "2",
        question: "Which phase of mitosis involves the separation of sister chromatids?",
        selectedAnswer: { text: "C. Anaphase", isCorrect: true },
        correctAnswer: { text: "C. Anaphase" },
        explanation: "You correctly identified Anaphase. During anaphase, the sister chromatids are pulled apart toward opposite poles of the cell by the spindle fibers.",
    },
    {
        id: "3",
        question: "In DNA, adenine pairs with which structural component?",
        selectedAnswer: { text: "B. Uracil", isCorrect: false },
        correctAnswer: { text: "D. Thymine" },
        explanation: "Adenine pairs with thymine in DNA via two hydrogen bonds. It only pairs with uracil in RNA, which is a common point of confusion.",
    },
];

export default function ResultsPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-16">

            {/* Top Banner */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: "var(--border-soft)" }}>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">AI Feedback Report</h1>
                </div>

                {isLoading ? (
                    <Card className="bg-white rounded-[2rem] border-0 overflow-hidden shadow-sm">
                        <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-br from-white to-slate-50">
                            <div className="flex items-center gap-8 border-b md:border-b-0 md:border-r border-slate-200 pb-8 md:pb-0 md:pr-12">
                                <Skeleton className="h-20 w-32 rounded-2xl" />
                                <div className="flex flex-col items-start gap-3">
                                    <Skeleton className="h-6 w-32 rounded-lg" />
                                    <Skeleton className="h-4 w-24 rounded-md" />
                                </div>
                            </div>
                            <div className="flex-1 flex flex-row items-center justify-around gap-6 md:justify-end md:gap-16">
                                <div className="flex flex-col gap-3 items-center md:items-start">
                                    <Skeleton className="h-3 w-20 rounded-md" />
                                    <Skeleton className="h-8 w-24 rounded-lg" />
                                </div>
                                <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                                <div className="flex flex-col gap-3 items-center md:items-start">
                                    <Skeleton className="h-3 w-20 rounded-md" />
                                    <Skeleton className="h-8 w-16 rounded-lg" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-white rounded-[2rem] border-0 overflow-hidden shadow-sm">
                        <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-br from-white to-slate-50">
                            <div className="flex items-center gap-8 border-b md:border-b-0 md:border-r border-slate-200 pb-8 md:pb-0 md:pr-12">
                                <span className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tighter">85<span className="text-4xl text-slate-400">%</span></span>
                                <div className="flex flex-col items-start gap-2">
                                    <Badge className="bg-emerald-100 text-emerald-800 border-0 px-4 py-1 font-bold tracking-wider uppercase text-xs rounded-lg shadow-sm">
                                        <CheckCircle2 className="h-4 w-4 mr-1.5 inline-block" />
                                        Excellent Work
                                    </Badge>
                                    <span className="text-sm font-semibold text-slate-500">Overall Accuracy</span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-row items-center justify-around gap-6 md:justify-end md:gap-16">
                                <div className="flex flex-col gap-1 items-center md:items-start">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Time Taken</span>
                                    <span className="text-2xl font-serif font-bold text-slate-900">45<span className="text-lg text-slate-500 font-sans">m</span> 12<span className="text-lg text-slate-500 font-sans">s</span></span>
                                </div>
                                <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                                <div className="flex flex-col gap-1 items-center md:items-start">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Score Ratio</span>
                                    <span className="text-2xl font-serif font-bold text-slate-900">25 <span className="text-lg text-slate-400 font-sans font-medium">/ 30</span></span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* AI Insights: 3 Cards */}
            <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight mt-4">Performance Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <Card key={`insight-skeleton-${i}`} className="bg-white rounded-3xl border shadow-sm border-slate-100 flex flex-col h-full opacity-70">
                            <CardHeader className="pb-2 flex flex-row items-start gap-4">
                                <Skeleton className="h-12 w-12 rounded-2xl shrink-0 mt-1" />
                                <div className="space-y-2 mt-2 w-full">
                                    <Skeleton className="h-6 w-24 rounded-md" />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2 pb-6 space-y-3">
                                <Skeleton className="h-4 w-full rounded-md" />
                                <Skeleton className="h-4 w-11/12 rounded-md" />
                                <Skeleton className="h-4 w-4/5 rounded-md" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <>
                        <Card className="bg-emerald-50 rounded-3xl border shadow-sm border-emerald-100 flex flex-col h-full">
                            <CardHeader className="pb-2 flex flex-row items-start gap-4">
                                <div className="bg-white p-3 rounded-2xl shadow-sm text-emerald-600 shrink-0 mt-1">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-emerald-900 font-bold font-serif text-lg">Strengths</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <p className="text-emerald-800/90 text-sm leading-relaxed font-medium">
                                    Exceptional accuracy in Cell Division and Mitosis. You answered all 8 questions in this category correctly and faster than the class average.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-rose-50 rounded-3xl border shadow-sm border-rose-100 flex flex-col h-full">
                            <CardHeader className="pb-2 flex flex-row items-start gap-4">
                                <div className="bg-white p-3 rounded-2xl shadow-sm text-rose-600 shrink-0 mt-1">
                                    <ShieldAlert className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-rose-900 font-bold font-serif text-lg">Improvements</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <p className="text-rose-800/90 text-sm leading-relaxed font-medium">
                                    You struggled with DNA vs RNA structural pairings, confusing Thymine and Uracil twice. You also spent 40% of your time on these 5 questions.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-indigo-50 rounded-3xl border shadow-sm border-indigo-100 flex flex-col h-full">
                            <CardHeader className="pb-2 flex flex-row items-start gap-4">
                                <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600 shrink-0 mt-1">
                                    <Target className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-indigo-900 font-bold font-serif text-lg">Action Plan</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <p className="text-indigo-800/90 text-sm leading-relaxed font-medium">
                                    Review Chapter 4 (Nucleic Acids) tonight. Focus specifically on memorizing the pyrimidines differential between DNA and RNA transcripts.
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Detailed Review */}
            <div className="flex flex-col mt-6 gap-6">
                <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight border-b pb-4" style={{ borderColor: 'var(--border-soft)' }}>Question Breakdown</h2>

                <Accordion type="multiple" className="w-full space-y-4">
                    {results.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={item.id} className="border-0 bg-white rounded-3xl shadow-sm overflow-hidden" style={{ boxShadow: "var(--shadow-clay-outer)" }}>
                            <AccordionTrigger className="px-6 py-6 hover:no-underline hover:bg-slate-50 transition-colors [&[data-state=open]]:bg-slate-50">
                                <div className="flex items-center gap-6 text-left w-full justify-between pr-4">
                                    <div className="flex items-center gap-4">
                                        {item.selectedAnswer.isCorrect ? (
                                            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl shrink-0"><CheckCircle2 className="h-6 w-6" /></div>
                                        ) : (
                                            <div className="bg-rose-100 text-rose-600 p-2 rounded-xl shrink-0"><XCircle className="h-6 w-6" /></div>
                                        )}
                                        <div className="font-serif font-semibold text-lg text-slate-900">Q{index + 1}. {item.question}</div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 pt-0 bg-slate-50 border-t border-slate-100">
                                <div className="pt-6 flex flex-col lg:flex-row gap-8 lg:gap-12">
                                    <div className="flex-1 flex flex-col gap-4">
                                        <div className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Your response:</div>
                                        <div className={`p-4 rounded-xl border flex items-center justify-between ${item.selectedAnswer.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                                            <span className="font-semibold text-base">{item.selectedAnswer.text}</span>
                                            {item.selectedAnswer.isCorrect ? <CheckCircle2 className="h-5 w-5 opacity-70" /> : <XCircle className="h-5 w-5 opacity-70" />}
                                        </div>

                                        {!item.selectedAnswer.isCorrect && (
                                            <>
                                                <div className="font-bold text-xs uppercase tracking-wider text-slate-400 mt-2">Correct Answer:</div>
                                                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center justify-between">
                                                    <span className="font-semibold text-base">{item.correctAnswer.text}</span>
                                                    <CheckCircle2 className="h-5 w-5 opacity-70" />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="lg:w-[45%] bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                                        <h5 className="font-bold font-serif text-slate-800 mb-2 flex items-center gap-2">
                                            <Lightbulb className="h-5 w-5 text-amber-500" /> AI Explanation
                                        </h5>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {item.explanation}
                                        </p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
