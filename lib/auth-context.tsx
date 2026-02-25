"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "admin" | "teacher" | "student";

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
}

interface ImpersonationState {
    isActive: boolean;
    originalUser?: User;
    impersonatedUser?: User;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    impersonation: ImpersonationState;
    setImpersonation: (state: ImpersonationState) => void;
    setUser: (user: User) => void;
    logout: () => void;
}

const STORAGE_KEY = "unimonk_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [impersonation, setImpersonation] = useState<ImpersonationState>({
        isActive: false,
    });
    const router = useRouter();

    // On mount, read user from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setUserState(JSON.parse(stored));
            }
        } catch {
            // ignore parse errors
        }
        setIsLoading(false);
    }, []);

    const setUser = (newUser: User) => {
        setUserState(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    };

    const logout = () => {
        setUserState(null);
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.clear();
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoading, impersonation, setImpersonation, setUser, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
