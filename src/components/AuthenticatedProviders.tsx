'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { OrderProvider } from '@/contexts/OrderContext';

interface AuthenticatedProvidersProps {
    children: ReactNode;
}

export default function AuthenticatedProviders({ children }: AuthenticatedProvidersProps) {
    const { isAuthenticated } = useAuth();

    // Only wrap with providers when authenticated
    if (isAuthenticated) {
        return (
            <CartProvider>
                <OrderProvider>
                    {children}
                </OrderProvider>
            </CartProvider>
        );
    }

    return <>{children}</>;
}
