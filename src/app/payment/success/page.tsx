'use client';

import { Suspense } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { clearCart } = useCart();
    const [cleared, setCleared] = useState(false);
    const hasRun = useRef(false);

    // Only clear the cart when Stripe has actually redirected us here with a
    // valid checkout session id. Stripe session ids always start with "cs_".
    // This prevents the cart from being wiped if a user lands on this URL by
    // mistake (back-button navigation, stale bookmark, refresh, etc.).
    const hasValidSession = typeof sessionId === 'string' && sessionId.startsWith('cs_');

    useEffect(() => {
        if (hasRun.current || !hasValidSession) return;
        hasRun.current = true;
        clearCart();
        setCleared(true);
    }, [clearCart, hasValidSession]);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Payment Successful
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                        {hasValidSession
                            ? (cleared ? 'Your cart has been cleared.' : 'Finalizing your order...')
                            : 'We could not confirm your payment session. Your cart is still intact.'}
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <Layout>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <svg className="animate-spin h-10 w-10 mx-auto mb-4 text-emerald-600" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                            Loading...
                        </h2>
                    </div>
                </div>
            </Layout>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
