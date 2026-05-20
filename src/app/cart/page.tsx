'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useCart, CartEntry } from '@/contexts/CartContext';

export default function CartPage() {
    const { cartEntries, removeFromCart, clearCart } = useCart();

    const [dialogState, setDialogState] = useState<{
        isOpen: boolean;
        type: 'remove' | 'clear';
        entryId?: string;
        entryName?: string;
    }>({ isOpen: false, type: 'remove' });

    const handleRemoveClick = (entry: CartEntry) => {
        setDialogState({
            isOpen: true,
            type: 'remove',
            entryId: entry.id,
            entryName: `${entry.school.name} · ${entry.grade.name}`,
        });
    };

    const handleClearClick = () => setDialogState({ isOpen: true, type: 'clear' });

    const handleConfirm = () => {
        if (dialogState.type === 'remove' && dialogState.entryId) removeFromCart(dialogState.entryId);
        else if (dialogState.type === 'clear') clearCart();
        setDialogState({ isOpen: false, type: 'remove' });
    };

    const handleCancel = () => setDialogState({ isOpen: false, type: 'remove' });

    const formatDate = (timestamp: number) => {
        if (!timestamp || isNaN(timestamp)) return 'just now';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'just now';
        return date.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => `${amount.toFixed(2)} ILS`;

    const totalItems = cartEntries.reduce(
        (sum, entry) =>
            sum +
            (Array.isArray(entry.items)
                ? entry.items.reduce((s, item) => s + item.quantity, 0)
                : 0),
        0
    );

    const totalCost = cartEntries.reduce(
        (sum, entry) =>
            sum +
            (Array.isArray(entry.items)
                ? entry.items.reduce((s, item) => s + item.quantity * (item.unitPrice ?? 1), 0)
                : 0),
        0
    );

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
                <header className="mb-8 animate-rise-in">
                    <p className="eyebrow mb-2">Step 2 of 3</p>
                    <div className="flex justify-between items-end gap-4">
                        <h1 className="font-display text-[2.4rem] sm:text-[2.8rem] tracking-tight text-(--ink-1) leading-none">
                            Your cart
                        </h1>
                        {cartEntries.length > 0 && (
                            <button onClick={handleClearClick} className="btn btn-danger-quiet text-[13px] !py-1.5 !px-2.5">
                                Clear all
                            </button>
                        )}
                    </div>
                </header>

                {cartEntries.length === 0 ? (
                    <div className="surface-card py-16 px-6 text-center animate-rise-in delay-1">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-(--surface-sunken) text-(--ink-3) mb-5">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M3 4h2.2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle cx="10" cy="20" r="1.2" fill="currentColor" />
                                <circle cx="17" cy="20" r="1.2" fill="currentColor" />
                            </svg>
                        </div>
                        <h2 className="font-display text-[1.4rem] text-(--ink-1) mb-1.5">Your cart is empty</h2>
                        <p className="text-[0.93rem] text-ink-2 mb-6 max-w-sm mx-auto">
                            Once you save a school&#39;s equipment list, it will appear here ready
                            for checkout.
                        </p>
                        <Link href="/" className="btn btn-primary">
                            Browse equipment lists
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Summary band */}
                        <div className="grid grid-cols-3 gap-px bg-(--line) border border-(--line) rounded overflow-hidden mb-8 animate-rise-in delay-1">
                            <Stat label="Lists" value={cartEntries.length} />
                            <Stat label="Items" value={totalItems} />
                            <Stat label="Total" value={formatCurrency(totalCost)} accent />
                        </div>

                        {/* Entries */}
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
                                        <header className="flex justify-between items-start gap-3 px-5 sm:px-6 py-4 bg-(--surface-sunken) border-b border-(--line)">
                                            <div>
                                                <h3 className="font-display text-[1.15rem] text-(--ink-1) tracking-tight leading-tight">
                                                    {entry.school.name}
                                                </h3>
                                                <p className="text-[13px] text-ink-2 mt-0.5">{entry.grade.name}</p>
                                                <p className="text-[11px] uppercase tracking-[0.12em] text-(--ink-3) mt-2">
                                                    Added {formatDate(entry.timestamp)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveClick(entry)}
                                                className="btn btn-danger-quiet !p-2 !px-2"
                                                aria-label="Remove this list from cart"
                                                title="Remove from cart"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                </svg>
                                            </button>
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

                        {/* Checkout */}
                        <div className="mt-10 pt-8 border-t border-(--line)">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <p className="text-[14px] text-ink-2">
                                    Ready to complete your order? You&#39;ll be redirected to a secure
                                    payment page.
                                </p>
                                <div className="text-right">
                                    <p className="text-[11px] uppercase tracking-[0.14em] text-(--ink-3) font-semibold">Order total</p>
                                    <p className="font-display text-[1.9rem] tabular-nums text-(--clay-900) leading-none mt-1">
                                        {formatCurrency(totalCost)}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/checkout"
                                className="btn btn-primary w-full !py-4 !text-[1rem]"
                            >
                                Proceed to checkout
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <ConfirmDialog
                isOpen={dialogState.isOpen}
                title={dialogState.type === 'clear' ? 'Clear entire cart?' : 'Remove this list?'}
                message={
                    dialogState.type === 'clear'
                        ? 'All saved equipment lists will be removed from your cart. This cannot be undone.'
                        : `“${dialogState.entryName}” will be removed from your cart.`
                }
                confirmLabel={dialogState.type === 'clear' ? 'Clear all' : 'Remove'}
                cancelLabel="Keep"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                variant="danger"
            />
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
