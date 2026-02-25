import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsLoading() {
    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-16">
            <div className="border-b pb-6" style={{ borderColor: "var(--border-soft)" }}>
                <Skeleton className="h-9 w-64 rounded-md" />
            </div>
            <Skeleton className="h-32 rounded-[2rem]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40 rounded-3xl" />
                ))}
            </div>
            <Skeleton className="h-8 w-48 rounded-md" />
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-3xl" />
                ))}
            </div>
        </div>
    );
}
