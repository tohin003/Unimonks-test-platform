import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { AuthProvider } from "@/lib/auth-context";
import { ImpersonationBanner } from "@/components/layout/impersonation-banner";
import { RouteGuard } from "@/components/layout/route-guard";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <RouteGuard>
                <SidebarProvider>
                    <div className="flex w-full min-h-screen">
                        <AppSidebar />
                        <div className="flex-1 w-full bg-surface relative flex flex-col h-screen overflow-hidden">
                            {/* Subtle Claymorphism Ambient Gradients */}
                            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(199,141,107,0.05)_0%,transparent_50%)] pointer-events-none" />
                            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,rgba(126,164,154,0.05)_0%,transparent_50%)] pointer-events-none" />

                            {/* Impersonation Banner — only shows when active */}
                            <ImpersonationBanner />

                            <TopHeader />
                            <main className="flex-1 overflow-auto p-4 md:p-8 pb-24 z-10 relative">
                                {children}
                            </main>
                        </div>
                    </div>
                </SidebarProvider>
            </RouteGuard>
        </AuthProvider>
    );
}
