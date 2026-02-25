import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-28 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
            </div>

            <div className="p-6 md:p-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 mx-auto w-full max-w-[1600px]">
                <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-160px)]">
                    <div className="px-10 py-6 border-b border-slate-100 bg-surface/50 flex items-center justify-between">
                        <Skeleton className="h-6 w-44" />
                        <Skeleton className="h-6 w-28" />
                    </div>
                    <div className="p-10 space-y-6">
                        <Skeleton className="h-7 w-3/4" />
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-surface">
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <div className="p-6 space-y-4">
                            <Skeleton className="h-12 w-full rounded-2xl" />
                            <div className="grid grid-cols-2 gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-16 rounded-2xl" />
                                ))}
                            </div>
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-surface">
                            <Skeleton className="h-5 w-28" />
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-5 gap-3">
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <Skeleton key={i} className="aspect-square rounded-xl" />
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-y-4 gap-x-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-4 w-24" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
