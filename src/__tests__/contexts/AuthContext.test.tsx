/**
 * @fileoverview AuthContext tests
 * Tests that the useAuth hook throws when used outside provider.
 */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from '@/contexts/AuthContext';

// Component that calls useAuth without a provider — it will throw on render.
// Rendering this with React Testing Library propagates the render error, which
// we assert via `expect(() => render(...)).toThrow(...)`. JSX is kept outside
// of any try/catch so the test plays nicely with React's error handling model
// (per the react-hooks/error-boundaries lint rule).
function HookUserOutsideProvider() {
    useAuth();
    return null;
}

describe('AuthContext', () => {
    describe('useAuth Hook', () => {
        it('should throw error when used outside AuthProvider', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => render(<HookUserOutsideProvider />)).toThrow(
                'useAuth must be used within an AuthProvider'
            );

            consoleSpy.mockRestore();
        });
    });
});
