'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
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

    const hasValidSession = typeof sessionId === 'string' && sessionId.startsWith('cs_');

    useEffect(() => {
        if (hasRun.current || !hasValidSession) return;
        hasRun.current = true;
        clearCart();
        setCleared(true);
    }, [clearCart, hasValidSession]);

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
                <div className="surface-card overflow-hidden animate-rise-in">
                    <div className="h-1 w-full bg-(--ok-500)" />
                    <div className="px-8 py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-(--ok-500)/10 mb-6">
                            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-(--ok-500) text-white">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>

                        <p className="eyebrow mb-3 text-(--ok-700)">Order confirmed</p>
                        <h1 className="font-display text-[2.1rem] sm:text-[2.4rem] tracking-tight text-(--ink-1) leading-tight mb-3">
                            Thank you. Your order is on its way.
                        </h1>
                        <p className="text-[0.97rem] leading-relaxed text-ink-2 max-w-md mx-auto mb-8">
                            {hasValidSession
                                ? cleared
                                    ? 'Your payment was received and your cart has been cleared. You will receive a confirmation by email shortly.'
                                    : 'Finalising your order…'
                                : 'We could not confirm your payment session, but your cart has not been touched. Please contact support if you were charged.'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/" className="btn btn-primary">
                                Return home
                            </Link>
                            <Link href="/contact" className="btn btn-quiet">
                                Need help?
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <Layout>
                    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20 text-center">
                        <svg className="animate-spin-slow mx-auto mb-4 text-(--brand-700)" width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
                            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        <p className="text-[0.95rem] text-ink-2">Loading…</p>
                    </div>
                </Layout>
            }
        >
            <PaymentSuccessContent />
        </Suspense>
    );
}
