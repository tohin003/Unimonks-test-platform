import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64 rounded-xl" />
                    <Skeleton className="h-4 w-96 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32 w-full rounded-3xl" />
                <Skeleton className="h-32 w-full rounded-3xl" />
                <Skeleton className="h-32 w-full rounded-3xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="col-span-1 lg:col-span-2 h-[350px] w-full rounded-3xl" />
                <Skeleton className="col-span-1 h-[350px] w-full rounded-3xl" />
            </div>
        </div>
    );
}
