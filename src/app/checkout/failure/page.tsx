'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';

function CheckoutFailureContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const errorMessage = searchParams.get('error');

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Payment Failed
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-2">
                        {errorMessage || 'Your payment could not be processed. Please try again.'}
                    </p>
                    {orderId && (
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-8">
                            Order ID: {orderId}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/checkout"
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Try Again
                        </Link>
                        <Link
                            href="/cart"
                            className="px-6 py-3 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Return to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default function CheckoutFailurePage() {
    return (
        <Suspense fallback={
            <Layout>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                            Loading...
                        </h2>
                    </div>
                </div>
            </Layout>
        }>
            <CheckoutFailureContent />
        </Suspense>
    );
}
