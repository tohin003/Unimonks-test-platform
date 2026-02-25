import { Skeleton } from "@/components/ui/skeleton";

export default function BatchDetailLoading() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
            <div className="border-b pb-6" style={{ borderColor: "var(--border-soft)" }}>
                <Skeleton className="h-4 w-28 mb-4 rounded-md" />
                <Skeleton className="h-9 w-64 rounded-md mb-2" />
                <Skeleton className="h-4 w-56 rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 rounded-3xl" />
                ))}
            </div>
            <Skeleton className="h-12 w-72 rounded-xl" />
            <Skeleton className="h-64 rounded-3xl" />
        </div>
    );
}
