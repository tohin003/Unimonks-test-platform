"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 text-center">
            <div className="bg-rose-50 p-6 rounded-full inline-flex shadow-sm">
                <AlertTriangle className="h-12 w-12 text-rose-500" />
            </div>
            <div className="space-y-2 max-w-md px-6">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Something went wrong</h2>
                <p className="text-slate-500">We encountered an unexpected error while loading this page. Our team has been notified.</p>
            </div>
            <div className="flex gap-4 mt-2">
                <Button onClick={() => window.location.reload()} variant="outline" className="shadow-sm border-slate-200">
                    Reload Page
                </Button>
                <Button onClick={() => reset()} className="shadow-sm px-6 bg-slate-900 hover:bg-slate-800 text-white">
                    Try again
                </Button>
            </div>
        </div>
    );
}
