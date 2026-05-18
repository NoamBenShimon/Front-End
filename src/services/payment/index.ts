/**
 * @fileoverview Payment Provider Factory
 *
 * Selects the active payment provider based on the
 * NEXT_PUBLIC_PAYMENT_PROVIDER environment variable.
 *
 * Usage:
 *   import { getPaymentProvider } from '@/services/payment';
 *   const provider = getPaymentProvider();
 *   const session = await provider.createSession(order, urls);
 *
 * To swap providers: set NEXT_PUBLIC_PAYMENT_PROVIDER=api (or mock)
 * and implement the PaymentProvider interface if adding a new one.
 *
 * @module services/payment
 */

import { PaymentProvider } from '@/types/payment';
import { MockPaymentProvider } from './mock-provider';
import { ApiPaymentProvider } from './api-provider';

type ProviderName = 'mock' | 'api';

const providers: Record<ProviderName, () => PaymentProvider> = {
    mock: () => new MockPaymentProvider(),
    api: () => new ApiPaymentProvider(),
};

let cachedProvider: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
    if (cachedProvider) return cachedProvider;

    const providerName = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'mock') as ProviderName;

    const factory = providers[providerName];
    if (!factory) {
        throw new Error(
            `[Payment] Unknown provider "${providerName}". ` +
            `Valid options: ${Object.keys(providers).join(', ')}`
        );
    }
    cachedProvider = factory();

    return cachedProvider;
}
