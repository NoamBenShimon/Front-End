/**
 * @fileoverview Mock Payment Provider for Development and Testing
 *
 * Simulates a payment provider redirect flow:
 * 1. createSession returns a redirect URL pointing to our local mock payment page
 * 2. verifyPayment always returns success
 *
 * @module services/payment/mock-provider
 */

import { PaymentProvider } from '@/types/payment';
import { Order, PaymentSession, PaymentResult } from '@/types/order';

export class MockPaymentProvider implements PaymentProvider {
    readonly name = 'mock';

    async createSession(
        order: Order,
        callbackUrls: { successUrl: string; failureUrl: string }
    ): Promise<PaymentSession> {
        const mockTransactionId = `mock_txn_${Date.now()}`;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to our own mock payment page, which will simulate
        // the external provider experience and redirect back to callback URLs
        const redirectUrl =
            `/checkout/mock-payment?orderId=${encodeURIComponent(order.id)}` +
            `&transactionId=${encodeURIComponent(mockTransactionId)}` +
            `&successUrl=${encodeURIComponent(callbackUrls.successUrl)}` +
            `&failureUrl=${encodeURIComponent(callbackUrls.failureUrl)}`;

        return {
            sessionId: `mock_session_${Date.now()}`,
            redirectUrl,
            orderId: order.id,
        };
    }

    async verifyPayment(orderId: string, transactionId: string): Promise<PaymentResult> {
        // Simulate verification delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            orderId,
            transactionId,
            status: 'success',
        };
    }
}
