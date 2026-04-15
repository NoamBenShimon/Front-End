'use client';

import { Suspense } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useOrder } from '@/contexts/OrderContext';
import { getPaymentProvider } from '@/services/payment';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const transactionId = searchParams.get('transactionId');
    const { clearCart } = useCart();
    const { fetchOrder, currentOrder } = useOrder();
    const [verified, setVerified] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (!orderId || hasRun.current) return;
        hasRun.current = true;

        const verify = async () => {
            try {
                // Verify payment with provider
                if (transactionId) {
                    const provider = getPaymentProvider();
                    const result = await provider.verifyPayment(orderId, transactionId);
                    if (result.status !== 'success') {
                        setError(result.errorMessage || 'Payment verification failed');
                        setVerifying(false);
                        return;
                    }
                }

                // Fetch order details for confirmation display
                await fetchOrder(orderId);

                // Clear cart only after successful verification
                clearCart();

                setVerified(true);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to verify payment';
                setError(message);
            } finally {
                setVerifying(false);
            }
        };

        verify();
    }, [orderId, transactionId, fetchOrder, clearCart]);

    if (verifying) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <svg className="animate-spin h-10 w-10 mx-auto mb-4 text-emerald-600" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                            Verifying payment...
                        </h2>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                            Verification Failed
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-6">{error}</p>
                        <Link
                            href="/cart"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Return to Cart
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

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
                    <p className="text-zinc-500 dark:text-zinc-400 mb-2">
                        Your order has been placed successfully.
                    </p>
                    {orderId && (
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-8">
                            Order ID: {orderId}
                        </p>
                    )}

                    {/* Order summary */}
                    {verified && currentOrder && (
                        <div className="max-w-md mx-auto mb-8 text-left">
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                                {currentOrder.groups.map((group, idx) => (
                                    <div key={idx} className="p-4 border-b border-zinc-200 dark:border-zinc-700 last:border-b-0">
                                        <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                                            {group.school.name} - {group.grade.name}
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            {group.items.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                                                    <span>{item.name}</span>
                                                    <span>×{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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

export default function CheckoutSuccessPage() {
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
            <CheckoutSuccessContent />
        </Suspense>
    );
}
