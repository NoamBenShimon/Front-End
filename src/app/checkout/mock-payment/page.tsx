'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {useTranslations} from 'next-intl';

function MockPaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const transactionId = searchParams.get('transactionId');
    const successUrl = searchParams.get('successUrl');
    const failureUrl = searchParams.get('failureUrl');
    const t = useTranslations('MockPayment');
    const [processing, setProcessing] = useState(false);

    // Production guard: redirect away if not using mock provider
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER && process.env.NEXT_PUBLIC_PAYMENT_PROVIDER !== 'mock') {
            router.replace('/cart');
        }
    }, [router]);

    const handlePay = () => {
        if (!successUrl) return;
        setProcessing(true);
        setTimeout(() => {
            const separator = successUrl.includes('?') ? '&' : '?';
            window.location.href = `${successUrl}${separator}transactionId=${encodeURIComponent(transactionId || '')}`;
        }, 1500);
    };

    const handleFail = () => {
        if (!failureUrl) return;
        const separator = failureUrl.includes('?') ? '&' : '?';
        window.location.href = `${failureUrl}${separator}error=${encodeURIComponent(t('declined'))}`;
    };

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md border-2 border-yellow-400 dark:border-yellow-600 rounded-lg bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
                {/* Warning banner */}
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-400 dark:border-yellow-600 px-6 py-3">
                    <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium text-center">
                        {t('banner')}
                    </p>
                </div>

                <div className="p-6">
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 text-center">
                        {t('title')}
                    </h1>

                    {orderId && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 text-center">
                            {t('orderLabel', {id: orderId})}
                        </p>
                    )}

                    {/* Simulated card form (non-functional) */}
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                {t('cardNumber')}
                            </label>
                            <input
                                type="text"
                                disabled
                                value="4242 4242 4242 4242"
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    {t('expiry')}
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value="12/29"
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    {t('cvv')}
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value="123"
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handlePay}
                            disabled={processing}
                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    {t('processing')}
                                </span>
                            ) : (
                                t('pay')
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleFail}
                            disabled={processing}
                            className="w-full py-3 px-4 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {t('simulateFailure')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MockPaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
            </div>
        }>
            <MockPaymentContent />
        </Suspense>
    );
}
