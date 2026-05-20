'use client';

import { useState, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import Toast from './Toast';
import { CartEntryPayload } from '@/types/cart';

interface SaveToCartButtonProps {
    school: { id: number; name: string } | null;
    grade: { id: number; name: string } | null;
    selectedIds: Set<number>;
    quantities: Map<number, number>;
    items: { id: number; name: string; quantity: number; unitPrice?: number }[];
    disabled?: boolean;
}

const DISABLED_DURATION = 3000;

export default function SaveToCartButton({
    school,
    grade,
    selectedIds,
    quantities,
    items,
    disabled = false,
}: SaveToCartButtonProps) {
    const { addToCart } = useCart();
    const [isTemporarilyDisabled, setIsTemporarilyDisabled] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleSaveToCart = useCallback(() => {
        if (!school || !grade) return;

        const cartItems: CartEntryPayload['items'] = items
            .filter(item => selectedIds.has(item.id))
            .map(item => ({
                id: Number(item.id),
                name: item.name,
                quantity: quantities.get(item.id) ?? item.quantity,
                unitPrice: item.unitPrice,
            }))
            .filter(item => item.quantity > 0);

        if (cartItems.length === 0) return;

        addToCart({
            school: { id: school.id, name: school.name },
            grade: { id: grade.id, name: grade.name },
            items: cartItems,
        });

        setShowToast(true);
        setIsTemporarilyDisabled(true);
        setTimeout(() => setIsTemporarilyDisabled(false), DISABLED_DURATION);
    }, [school, grade, selectedIds, quantities, items, addToCart]);

    const handleCloseToast = useCallback(() => setShowToast(false), []);

    const isButtonDisabled =
        disabled || isTemporarilyDisabled || !school || !grade || selectedIds.size === 0;

    const validItemCount = items
        .filter(item => selectedIds.has(item.id))
        .filter(item => (quantities.get(item.id) ?? item.quantity) > 0)
        .length;

    return (
        <>
            <div className="mt-6">
                <button
                    onClick={handleSaveToCart}
                    disabled={isButtonDisabled}
                    className="relative w-full btn btn-primary !py-4 !text-[1rem] overflow-hidden"
                >
                    <span className="relative z-10 inline-flex items-center gap-2.5">
                        {isTemporarilyDisabled ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Saved to cart
                            </>
                        ) : (
                            <>
                                Save list to cart
                                {validItemCount > 0 && (
                                    <span className="tabular-nums opacity-70 font-normal">
                                        · {validItemCount} {validItemCount === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </>
                        )}
                    </span>

                    {isTemporarilyDisabled && (
                        <div
                            className="absolute bottom-0 left-0 h-[2px] bg-(--clay-500) animate-timer-line"
                            style={{ animationDuration: `${DISABLED_DURATION}ms` }}
                        />
                    )}
                </button>
            </div>

            <Toast
                message="List saved to cart"
                isVisible={showToast}
                onClose={handleCloseToast}
                duration={DISABLED_DURATION}
                delay={100}
            />
        </>
    );
}
