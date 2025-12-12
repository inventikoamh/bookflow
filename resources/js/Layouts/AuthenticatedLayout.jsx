import { SidebarProvider, SidebarTrigger } from '@/Components/ui/sidebar';
import { AppSidebar } from '@/Components/app-sidebar';
import { usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import MobileBottomNav from '@/Components/MobileBottomNav';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <SidebarProvider>
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <AppSidebar />
            </div>

            <SidebarInset className="flex-1">
                {/* Top Navbar - Premium Design */}
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 shadow-lg">
                    {/* Mobile App Branding - Premium*/}
                    <div className="flex items-center gap-3 md:hidden">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">BookFlow</h1>
                            <p className="text-xs text-gray-500 font-medium">Track Your Reading</p>
                        </div>
                    </div>

                    {/* Desktop Sidebar Toggle */}
                    <div className="hidden md:block">
                        <SidebarTrigger className="text-purple-600 hover:bg-purple-50 transition-colors" />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
                    {children}
                </main>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />
            </SidebarInset>
        </SidebarProvider>
    );
}

// SidebarInset component (needed for layout)
function SidebarInset({ children, className }) {
    return (
        <main className={"relative flex min-h-svh flex-1 flex-col bg-background peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow " + (className || "")}>
            {children}
        </main>
    );
}
