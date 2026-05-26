'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckoutSession } from '@/services/api';

export default function CheckoutPage() {
    const { cartEntries } = useCart();
    const { userid } = useAuth();
    const t = useTranslations('Checkout');
    const tCommon = useTranslations('Common');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Note: the bfcache/back-forward redirect for this route runs as an
    // inline pre-hydration script in src/app/layout.tsx, because doing it in
    // a useEffect here is too late — ProtectedRoute keeps CheckoutPage
    // unmounted while it shows the auth spinner.

    const formatCurrency = (amount: number) => tCommon('currencyILS', { amount: amount.toFixed(2) });

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
            const message = err instanceof Error ? err.message : t('genericError');
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
                            {t('emptyTitle')}
                        </h2>
                        <p className="text-[0.95rem] text-ink-2 mb-6 max-w-md mx-auto">
                            {t('emptySubtitle')}
                        </p>
                        <Link href="/cart" className="btn btn-primary">
                            {t('goToCart')}
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
                    <p className="eyebrow mb-2">{t('stepIndicator')}</p>
                    <h1 className="font-display text-[2.4rem] sm:text-[2.8rem] tracking-tight text-(--ink-1) leading-none mb-3">
                        {t('title')}
                    </h1>
                    <p className="text-[0.96rem] text-ink-2 max-w-xl">
                        {t('reviewIntro')}
                    </p>
                </header>

                <div className="grid grid-cols-3 gap-px bg-(--line) border border-(--line) rounded overflow-hidden mb-8 animate-rise-in delay-1">
                    <Stat label={t('statLists')} value={cartEntries.length} />
                    <Stat label={t('statItems')} value={totalItems} />
                    <Stat label={t('statTotal')} value={formatCurrency(totalCost)} accent />
                </div>

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
                                            <span>{t('itemColumn')}</span>
                                            <span className="text-right">{t('qtyColumn')}</span>
                                            <span className="text-right">{t('unitColumn')}</span>
                                            <span className="text-right">{t('totalColumn')}</span>
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
                                            {t('listSubtotal')}
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

                <div className="mt-10 pt-8 border-t border-(--line)">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2.5 text-[13px] text-ink-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-(--ok-700)">
                                <path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{t('securePayment')}</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-(--ink-3) font-semibold">{t('amountToPay')}</p>
                            <p className="font-display text-[2.1rem] tabular-nums text-(--clay-900) leading-none mt-1">
                                {formatCurrency(totalCost)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3">
                        <Link href="/cart" className="btn btn-quiet sm:w-auto">
                            {t('backToCart')}
                        </Link>
                        <button
                            type="button"
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
                                    {t('redirecting')}
                                </>
                            ) : (
                                t('confirmAndPay', { amount: formatCurrency(totalCost) })
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
