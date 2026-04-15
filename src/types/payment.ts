/**
 * @fileoverview Payment Provider Interface (Strategy Pattern)
 *
 * Any payment provider (Tranzila, CardCom, PayPlus, mock, etc.)
 * must implement this interface. Swapping providers means implementing
 * this interface and setting the NEXT_PUBLIC_PAYMENT_PROVIDER env var.
 *
 * @module types/payment
 */

import { Order, PaymentSession, PaymentResult } from './order';

export interface PaymentProvider {
    /** Human-readable provider name for logging/debugging */
    readonly name: string;

    /**
     * Creates a payment session with the provider.
     * In real providers, this calls the backend, which calls the provider API
     * and returns a redirect URL.
     *
     * @param order - The order to pay for
     * @param callbackUrls - Where the provider should redirect after payment
     * @returns A PaymentSession with the redirect URL
     */
    createSession(
        order: Order,
        callbackUrls: { successUrl: string; failureUrl: string }
    ): Promise<PaymentSession>;

    /**
     * Verifies a payment after the user returns from the provider.
     * Calls the backend to confirm the transaction is genuine.
     *
     * @param orderId - The order ID
     * @param transactionId - The provider's transaction ID from the callback URL
     * @returns The verified PaymentResult
     */
    verifyPayment(orderId: string, transactionId: string): Promise<PaymentResult>;
}
