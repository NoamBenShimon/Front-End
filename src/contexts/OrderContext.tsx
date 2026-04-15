/**
 * @fileoverview Order Context Provider
 *
 * Manages the current checkout order state. Unlike CartContext which
 * persists across the session, OrderContext tracks a single active
 * order through the checkout flow.
 *
 * @module contexts/OrderContext
 */
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import * as api from '@/services/api';
import { Order, CreateOrderPayload } from '@/types/order';

/**
 * Shared checkout order state and actions exposed by OrderContext.
 */
interface OrderContextType {
    /** The active order in the current checkout flow, or null when none is loaded. */
    currentOrder: Order | null;
    /** True while creating or fetching an order. */
    loading: boolean;
    /** User-facing error message from the most recent failed operation. */
    error: string | null;
    /** Creates an order, stores it as currentOrder, and returns the created order. */
    createOrder: (payload: CreateOrderPayload) => Promise<Order>;
    /** Fetches an order by id, stores it as currentOrder, and returns the order. */
    fetchOrder: (orderId: string) => Promise<Order>;
    /** Clears the active order and any existing error message. */
    clearCurrentOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
 * Provides order state and order-related actions for the checkout flow.
 */
export function OrderProvider({ children }: { children: ReactNode }) {
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createOrder = useCallback(async (payload: CreateOrderPayload): Promise<Order> => {
        setLoading(true);
        setError(null);
        try {
            const order = await api.createOrder(payload);
            setCurrentOrder(order);
            return order;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create order';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrder = useCallback(async (orderId: string): Promise<Order> => {
        setLoading(true);
        setError(null);
        try {
            const order = await api.getOrder(orderId);
            setCurrentOrder(order);
            return order;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to fetch order';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearCurrentOrder = useCallback(() => {
        setCurrentOrder(null);
        setError(null);
    }, []);

    return (
        <OrderContext.Provider value={{
            currentOrder, loading, error,
            createOrder, fetchOrder, clearCurrentOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
}

/**
 * Returns the current order context value.
 * @throws {Error} When used outside an OrderProvider.
 */
export function useOrder() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
}
