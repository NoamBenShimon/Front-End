'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { OrderProvider } from '@/contexts/OrderContext';

interface AuthenticatedProvidersProps {
    children: ReactNode;
}

export default function AuthenticatedProviders({ children }: AuthenticatedProvidersProps) {
    // Providers must always be mounted so that pages depending on useCart/useOrder
    // never error out during transient unauthenticated states (e.g. after returning
    // from an external redirect like Stripe Checkout, while auth is re-checked).
    // The providers themselves no-op their API calls when there is no userid.
    return (
        <CartProvider>
            <OrderProvider>
                {children}
            </OrderProvider>
        </CartProvider>
    );
}
