"use client";

import { useAuth } from "@/lib/auth-context";

export function ImpersonationBanner() {
    const { impersonation, setImpersonation } = useAuth();

    if (!impersonation.isActive || !impersonation.impersonatedUser) {
        return null;
    }

    const handleReturn = () => {
        setImpersonation({ isActive: false });
    };

    return (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-center text-amber-800 text-sm font-bold tracking-wide z-20 relative shadow-sm">
            <span className="mr-3">
                🕵️‍♀️ You are currently impersonating{" "}
                <span className="underline">
                    {impersonation.impersonatedUser.name} ({impersonation.impersonatedUser.role})
                </span>
            </span>
            <button
                onClick={handleReturn}
                className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1 rounded-md text-xs transition-colors"
            >
                Return to Admin
            </button>
        </div>
    );
}
