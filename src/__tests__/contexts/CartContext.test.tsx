/**
 * @fileoverview CartContext tests
 * Tests that the useCart hook throws when used outside provider.
 */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useCart } from '@/contexts/CartContext';

// See AuthContext.test.tsx for why this pattern (component that throws,
// asserted via expect(...).toThrow) replaces the JSX-in-try/catch approach.
function HookUserOutsideProvider() {
    useCart();
    return null;
}

describe('CartContext', () => {
    describe('useCart Hook', () => {
        it('should throw error when used outside CartProvider', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => render(<HookUserOutsideProvider />)).toThrow(
                'useCart must be used within a CartProvider'
            );

            consoleSpy.mockRestore();
        });
    });
});
