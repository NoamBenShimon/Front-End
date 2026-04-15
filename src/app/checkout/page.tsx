'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useOrder } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { getPaymentProvider } from '@/services/payment';
import { OrderGroup } from '@/types/order';

export default function CheckoutPage() {
    const { cartEntries } = useCart();
    const { createOrder } = useOrder();
    const { userid } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalItems = cartEntries.reduce(
        (sum, entry) => sum + (Array.isArray(entry.items) ? entry.items.reduce((itemSum, item) => itemSum + item.quantity, 0) : 0),
        0
    );

    const handleCheckout = async () => {
        if (!userid || cartEntries.length === 0) return;

        setIsProcessing(true);
        setError(null);

        try {
            // Convert cart entries to order groups
            const groups: OrderGroup[] = cartEntries.map(entry => ({
                school: entry.school,
                grade: entry.grade,
                items: entry.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                })),
            }));

            // Create order via backend
            const order = await createOrder({ userId: userid, groups });

            // Create payment session
            const provider = getPaymentProvider();
            const origin = window.location.origin;
            const session = await provider.createSession(order, {
                successUrl: `${origin}/checkout/success?orderId=${encodeURIComponent(order.id)}`,
                failureUrl: `${origin}/checkout/failure?orderId=${encodeURIComponent(order.id)}`,
            });

            // Redirect to payment provider
            window.location.href = session.redirectUrl;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
            setError(message);
            setIsProcessing(false);
        }
    };

    if (cartEntries.length === 0) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                            Add equipment lists to your cart before checking out.
                        </p>
                        <Link
                            href="/cart"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Go to Cart
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
                    Checkout
                </h1>

                {/* Order summary */}
                <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                    <p className="text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-900 dark:text-white">{cartEntries.length}</span>
                        {cartEntries.length === 1 ? ' equipment list' : ' equipment lists'} •{' '}
                        <span className="font-semibold text-zinc-900 dark:text-white">{totalItems}</span>
                        {totalItems === 1 ? ' item' : ' items'} total
                    </p>
                </div>

                {/* Order entries (read-only) */}
                <div className="space-y-4">
                    {cartEntries.map((entry) => (
                        <div
                            key={entry.id}
                            className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900"
                        >
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                                <h3 className="font-semibold text-zinc-900 dark:text-white">
                                    {entry.school.name}
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {entry.grade.name}
                                </p>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-[1fr_auto] gap-2 text-sm">
                                    {entry.items.map((item) => (
                                        <div key={item.id} className="contents">
                                            <span className="text-zinc-700 dark:text-zinc-300">
                                                {item.name}
                                            </span>
                                            <span className="text-zinc-500 dark:text-zinc-400 text-right">
                                                ×{item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Error message */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/cart"
                        className="flex-1 py-3 px-6 text-center border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Back to Cart
                    </Link>
                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Confirm and Pay'
                        )}
                    </button>
                </div>
            </div>
        </Layout>
    );
}
