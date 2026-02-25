import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 text-center">
            <div className="bg-slate-100 p-6 rounded-[2rem] inline-flex shadow-inner mb-2" style={{ boxShadow: 'var(--shadow-clay-inner)' }}>
                <SearchX className="h-16 w-16 text-slate-400" />
            </div>
            <div className="space-y-3 max-w-md px-6">
                <h2 className="text-4xl font-serif font-bold text-slate-900">404</h2>
                <h3 className="text-xl font-medium text-slate-700">Page not found</h3>
                <p className="text-slate-500">Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.</p>
            </div>
            <Button asChild className="mt-4 shadow-sm px-8 rounded-xl">
                <Link href="/">Back to Dashboard</Link>
            </Button>
        </div>
    );
}
