'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckoutSession } from '@/services/api';

export default function CheckoutPage() {
    const { cartEntries } = useCart();
    const { userid } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (amount: number) => `${amount.toFixed(2)} ILS`;

    const totalItems = cartEntries.reduce(
        (sum, entry) =>
            sum + (Array.isArray(entry.items) ? entry.items.reduce((s, i) => s + i.quantity, 0) : 0),
        0
    );

    const totalCost = cartEntries.reduce(
        (sum, entry) =>
            sum +
            (Array.isArray(entry.items)
                ? entry.items.reduce((s, i) => s + i.quantity * (i.unitPrice ?? 1), 0)
                : 0),
        0
    );

    const handleCheckout = async () => {
        if (!userid || cartEntries.length === 0) return;
        setIsProcessing(true);
        setError(null);
        try {
            const totalAmountCents = Math.max(1, Math.round(totalCost * 100));
            const session = await createCheckoutSession({
                productName: 'Motzklist Order',
                quantity: 1,
                amount: totalAmountCents,
            });
            window.location.href = session.url;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
            setError(message);
            setIsProcessing(false);
        }
    };

    if (cartEntries.length === 0) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
                    <div className="surface-card py-16 px-6 text-center">
                        <h2 className="font-display text-[1.6rem] text-(--ink-1) mb-2">
                            Nothing to check out
                        </h2>
                        <p className="text-[0.95rem] text-ink-2 mb-6 max-w-md mx-auto">
                            Your cart is empty. Add at least one equipment list before continuing.
                        </p>
                        <Link href="/cart" className="btn btn-primary">
                            Go to cart
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
                <header className="mb-8 animate-rise-in">
                    <p className="eyebrow mb-2">Step 3 of 3</p>
                    <h1 className="font-display text-[2.4rem] sm:text-[2.8rem] tracking-tight text-(--ink-1) leading-none mb-3">
                        Review &amp; pay
                    </h1>
                    <p className="text-[0.96rem] text-ink-2 max-w-xl">
                        Please review the lists below. Payment is handled by our secure payment
                        provider. No card details are stored on this site.
                    </p>
                </header>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-px bg-(--line) border border-(--line) rounded overflow-hidden mb-8 animate-rise-in delay-1">
                    <Stat label="Lists" value={cartEntries.length} />
                    <Stat label="Items" value={totalItems} />
                    <Stat label="Total" value={formatCurrency(totalCost)} accent />
                </div>

                {/* Entries (read-only) */}
                <div className="space-y-5">
                    {cartEntries.map((entry, idx) => {
                        const subtotal = entry.items.reduce(
                            (s, item) => s + item.quantity * (item.unitPrice ?? 1),
                            0
                        );
                        return (
                            <article
                                key={entry.id}
                                className="surface-card overflow-hidden animate-rise-in"
                                style={{ animationDelay: `${140 + idx * 80}ms` }}
                            >
                                <header className="px-5 sm:px-6 py-4 bg-(--surface-sunken) border-b border-(--line)">
                                    <h3 className="font-display text-[1.15rem] text-(--ink-1) tracking-tight leading-tight">
                                        {entry.school.name}
                                    </h3>
                                    <p className="text-[13px] text-ink-2 mt-0.5">{entry.grade.name}</p>
                                </header>
                                <div className="px-5 sm:px-6 py-4">
                                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-5 text-[0.92rem]">
                                        <div className="contents text-[10.5px] uppercase tracking-[0.14em] text-(--ink-3) font-semibold pb-2">
                                            <span>Item</span>
                                            <span className="text-right">Qty</span>
                                            <span className="text-right">Unit</span>
                                            <span className="text-right">Total</span>
                                        </div>
                                        {entry.items.map(item => {
                                            const unitPrice = item.unitPrice ?? 1;
                                            return (
                                                <div key={item.id} className="contents">
                                                    <span className="py-2 text-(--ink-1)">{item.name}</span>
                                                    <span className="py-2 text-right tabular-nums text-(--ink-2)">×{item.quantity}</span>
                                                    <span className="py-2 text-right tabular-nums text-(--ink-2)">{formatCurrency(unitPrice)}</span>
                                                    <span className="py-2 text-right tabular-nums text-(--ink-1) font-medium">{formatCurrency(unitPrice * item.quantity)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-(--line)">
                                        <span className="text-[11.5px] uppercase tracking-[0.14em] font-semibold text-ink-2">
                                            List subtotal
                                        </span>
                                        <span className="font-display text-[1.15rem] tabular-nums text-(--clay-900)">
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-6 flex items-start gap-2.5 px-3.5 py-3 bg-(--bad-50) border border-(--bad-500)/30 rounded text-[13px] text-(--bad-700) animate-rise-in">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            <circle cx="12" cy="16" r="0.8" fill="currentColor" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Grand total + actions */}
                <div className="mt-10 pt-8 border-t border-(--line)">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2.5 text-[13px] text-ink-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-(--ok-700)">
                                <path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Secure payment via Stripe</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-(--ink-3) font-semibold">Amount to pay</p>
                            <p className="font-display text-[2.1rem] tabular-nums text-(--clay-900) leading-none mt-1">
                                {formatCurrency(totalCost)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3">
                        <Link href="/cart" className="btn btn-quiet sm:w-auto">
                            ← Back to cart
                        </Link>
                        <button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="btn btn-clay !py-4 !text-[1rem]"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin-slow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
                                        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                    Redirecting to payment…
                                </>
                            ) : (
                                <>
                                    Confirm &amp; pay {formatCurrency(totalCost)}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function Stat({
    label,
    value,
    accent = false,
}: {
    label: string;
    value: string | number;
    accent?: boolean;
}) {
    return (
        <div className="bg-(--surface-card) px-5 py-4">
            <p className="text-[10.5px] uppercase tracking-[0.16em] text-(--ink-3) font-semibold mb-1.5">{label}</p>
            <p
                className={`tabular-nums font-display text-[1.5rem] leading-none tracking-tight ${
                    accent ? 'text-(--clay-900)' : 'text-(--ink-1)'
                }`}
            >
                {value}
            </p>
        </div>
    );
}
