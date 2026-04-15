/**
 * @fileoverview API-Based Payment Provider
 *
 * Delegates payment operations to the backend API.
 * The backend is responsible for communicating with the actual
 * payment provider (Tranzila, CardCom, PayPlus, etc.).
 *
 * This class does NOT contain provider-specific logic - it calls
 * generic /api/payments/* endpoints, and the backend decides
 * which provider to use.
 *
 * @module services/payment/api-provider
 */

import { PaymentProvider } from '@/types/payment';
import { Order, PaymentSession, PaymentResult } from '@/types/order';
import { createPaymentSession, verifyPaymentResult } from '@/services/api';

export class ApiPaymentProvider implements PaymentProvider {
    readonly name = 'api';

    async createSession(
        order: Order,
        callbackUrls: { successUrl: string; failureUrl: string }
    ): Promise<PaymentSession> {
        return createPaymentSession(order.id, callbackUrls);
    }

    async verifyPayment(orderId: string, transactionId: string): Promise<PaymentResult> {
        return verifyPaymentResult(orderId, transactionId);
    }
}
