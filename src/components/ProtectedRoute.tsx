"use client";
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Wait for the initial auth check to settle before redirecting.
        // Otherwise a cold mount (e.g. browser back from Stripe) would bounce
        // through /login for a moment, producing a blank flash.
        if (isLoading) return;
        if (!isAuthenticated && pathname !== '/login') {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <svg className="animate-spin h-8 w-8 text-zinc-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    if (!isAuthenticated && pathname !== '/login') {
        return null;
    }
    return <>{children}</>;
}

