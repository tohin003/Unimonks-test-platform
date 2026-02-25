export default function Loading() {
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center">
                    <div className="absolute h-full w-full animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
                    <div className="h-8 w-8 animate-pulse rounded-full bg-indigo-100"></div>
                </div>
                <p className="text-sm font-medium text-slate-500 animate-pulse">Loading amazing things...</p>
            </div>
        </div>
    );
}
