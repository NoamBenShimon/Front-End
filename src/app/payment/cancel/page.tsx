'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

function PaymentCancelContent() {
    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
                <div className="surface-card overflow-hidden animate-rise-in">
                    <div className="h-1 w-full bg-(--clay-500)" />
                    <div className="px-8 py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-(--clay-50) mb-6">
                            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-(--clay-500) text-(--surface-page)">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 8v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                                    <circle cx="12" cy="16.5" r="1.1" fill="currentColor" />
                                </svg>
                            </span>
                        </div>

                        <p className="eyebrow mb-3" style={{ color: 'var(--clay-900)' }}>Payment cancelled</p>
                        <h1 className="font-display text-[2.1rem] sm:text-[2.4rem] tracking-tight text-(--ink-1) leading-tight mb-3">
                            Your cart is safe.
                        </h1>
                        <p className="text-[0.97rem] leading-relaxed text-ink-2 max-w-md mx-auto mb-8">
                            We did not charge your card. Your saved equipment lists are still
                            in your cart whenever you're ready to try again.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/checkout" className="btn btn-clay">
                                Try again
                            </Link>
                            <Link href="/cart" className="btn btn-quiet">
                                Back to cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default function PaymentCancelPage() {
    return (
        <Suspense
            fallback={
                <Layout>
                    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20 text-center">
                        <p className="text-[0.95rem] text-ink-2">Loading…</p>
                    </div>
                </Layout>
            }
        >
            <PaymentCancelContent />
        </Suspense>
    );
}
