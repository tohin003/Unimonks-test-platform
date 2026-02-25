import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
    return (
        <div className="flex min-h-screen">
            {/* Left side: Hero/Brand Area Skeleton */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-surface-2 p-12 flex-col justify-between">
                <div>
                    <Skeleton className="h-12 w-48 rounded-xl mb-6" />
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                </div>
                <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>

            {/* Right side: Form Area Skeleton */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden bg-surface">
                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center">
                        <Skeleton className="h-10 w-48 mx-auto rounded-xl mb-3" />
                        <Skeleton className="h-4 w-64 mx-auto rounded-lg" />
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-clay-outer border border-slate-100 space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded-lg" />
                            <Skeleton className="h-14 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded-lg" />
                            <Skeleton className="h-14 w-full rounded-xl" />
                        </div>
                        <Skeleton className="h-14 w-full rounded-xl mt-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
