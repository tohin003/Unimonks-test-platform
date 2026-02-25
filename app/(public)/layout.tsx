export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface relative overflow-hidden font-sans">
            {/* Decorative noise/gradient */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(100,116,139,0.05)_0%,transparent_50%)]" />
            <div className="z-10 w-full px-4">
                {children}
            </div>
        </div>
    );
}
