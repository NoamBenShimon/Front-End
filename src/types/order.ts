/**
 * @fileoverview Order and Payment Type Definitions
 *
 * Defines the domain types for orders, payment sessions, and payment results.
 * These types form the contract between frontend and backend.
 *
 * @module types/order
 */

/** All possible order statuses in the lifecycle */
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

/** A single item within an order, derived from CartItem */
export interface OrderItem {
    /** Unique identifier for the equipment item */
    id: number;
    /** Display name of the item */
    name: string;
    /** Quantity of this item */
    quantity: number;
}

/** A group of items for a specific school/grade within an order */
export interface OrderGroup {
    /** The school this group belongs to */
    school: { id: number; name: string };
    /** The grade/class this group belongs to */
    grade: { id: number; name: string };
    /** List of equipment items in this group */
    items: OrderItem[];
}

/** The full Order object as stored/returned by the backend */
export interface Order {
    /** Unique order identifier assigned by the backend */
    id: string;
    /** The user who placed this order */
    userId: string;
    /** Order items grouped by school and grade */
    groups: OrderGroup[];
    /** Current status in the order lifecycle */
    status: OrderStatus;
    /** ISO 8601 timestamp of when the order was created */
    createdAt: string;
    /** ISO 8601 timestamp of last update */
    updatedAt: string;
}

/** Payload sent to create a new order (backend assigns id, timestamps, status) */
export interface CreateOrderPayload {
    /** The user placing the order */
    userId: string;
    /** Order items grouped by school and grade */
    groups: OrderGroup[];
}

/** Result of initiating a payment session with a provider */
export interface PaymentSession {
    /** Provider's session/transaction identifier */
    sessionId: string;
    /** URL to redirect the user to for payment */
    redirectUrl: string;
    /** Our internal order ID */
    orderId: string;
}

/** The result passed back from the payment provider after redirect */
export interface PaymentResult {
    /** Our internal order ID */
    orderId: string;
    /** Provider's transaction ID */
    transactionId: string;
    /** Whether payment succeeded, failed, or is still pending */
    status: 'success' | 'failure' | 'pending';
    /** Error description if payment failed */
    errorMessage?: string;
}
