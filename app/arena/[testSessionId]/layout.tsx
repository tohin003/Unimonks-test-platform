"use client";

export default function ArenaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden">
            {children}
        </div>
    );
}
