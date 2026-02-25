import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
            <div className="border-b pb-6" style={{ borderColor: "var(--border-soft)" }}>
                <Skeleton className="h-4 w-32 mb-4 rounded-md" />
                <Skeleton className="h-9 w-72 rounded-md mb-2" />
                <Skeleton className="h-4 w-48 rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-12 w-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
        </div>
    );
}
