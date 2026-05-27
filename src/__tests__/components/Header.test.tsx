/**
 * @fileoverview Header component tests
 * Tests navigation links, cart icon, and logout functionality
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/navigation
const mockReplace = jest.fn();
const mockUsePathname = jest.fn(() => '/');
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: mockReplace,
    }),
    usePathname: () => mockUsePathname(),
}));

// Mock next/link
jest.mock('next/link', () => {
    function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
        return <a href={href}>{children}</a>;
    }
    MockLink.displayName = 'MockLink';
    return MockLink;
});

// Mock next/image
jest.mock('next/image', () => {
    function MockImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} {...props} />;
    }
    MockImage.displayName = 'MockImage';
    return MockImage;
});

// Mock next-intl translations used by Header
jest.mock('next-intl', () => ({
    useTranslations: (namespace: string) => {
        const messages: Record<string, Record<string, string>> = {
            Header: {
                brand: 'Motzkin Store',
                tagline: 'City of Kiryat Motzkin',
                home: 'Home',
                about: 'About',
                contact: 'Contact',
                cart: 'Cart',
                signOut: 'Sign out',
                openMenu: 'Open menu',
                cartListSingular: 'list',
                cartListPlural: 'lists',
            },
        };

        return (key: string, values?: Record<string, unknown>) => {
            if (namespace === 'Header' && key === 'cartAriaLabel') {
                const count = values?.count ?? 0;
                const list = values?.list ?? 'lists';
                return `Cart, ${count} ${list}`;
            }
            return messages[namespace]?.[key] ?? key;
        };
    },
    useLocale: () => 'en',
}));

// Auth mock state
let mockIsAuthenticated = false;
const mockLogout = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: mockIsAuthenticated,
        logout: mockLogout,
    }),
}));

// Cart mock state
let mockCartEntries: { id: string; items: unknown[] }[] = [];

jest.mock('@/contexts/CartContext', () => ({
    useCart: () => ({
        cartEntries: mockCartEntries,
    }),
}));

import Header from '@/components/Header';

describe('Header', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockIsAuthenticated = false;
        mockCartEntries = [];
    });

    describe('Navigation Links', () => {
        it('should render Home link', () => {
            render(<Header />);

            const homeLink = screen.getByRole('link', { name: /home/i });
            expect(homeLink).toBeInTheDocument();
            expect(homeLink).toHaveAttribute('href', '/');
        });

        it('should render About link', () => {
            render(<Header />);

            const aboutLink = screen.getByRole('link', { name: /about/i });
            expect(aboutLink).toBeInTheDocument();
            expect(aboutLink).toHaveAttribute('href', '/about');
        });

        it('should render Contact link', () => {
            render(<Header />);

            const contactLink = screen.getByRole('link', { name: /contact/i });
            expect(contactLink).toBeInTheDocument();
            expect(contactLink).toHaveAttribute('href', '/contact');
        });

        it('should render store name/logo link', () => {
            render(<Header />);

            const logoLink = screen.getByRole('link', { name: /motzkin store/i });
            expect(logoLink).toBeInTheDocument();
            expect(logoLink).toHaveAttribute('href', '/');
        });
    });

    describe('Unauthenticated State', () => {
        beforeEach(() => {
            mockIsAuthenticated = false;
        });

        it('should NOT show cart icon when not authenticated', () => {
            render(<Header />);

            expect(screen.queryByRole('link', { name: /cart/i })).not.toBeInTheDocument();
        });

        it('should NOT show logout button when not authenticated', () => {
            render(<Header />);

            expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument();
        });
    });

    describe('Authenticated State', () => {
        beforeEach(() => {
            mockIsAuthenticated = true;
        });

        it('should show cart link when authenticated', () => {
            render(<Header />);

            const cartLink = screen.getByRole('link', { name: /cart/i });
            expect(cartLink).toHaveAttribute('href', '/cart');
        });

        it('should show logout button when authenticated', () => {
            render(<Header />);

            expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
        });

        it('should show empty cart badge when cart is empty', () => {
            mockCartEntries = [];
            render(<Header />);

            const cartLink = screen.getByRole('link', { name: /cart/i });
            expect(cartLink).not.toHaveTextContent(/1/);
        });

        it('should show cart badge when cart has items', () => {
            mockCartEntries = [{ id: '1', items: [] }];
            render(<Header />);

            const cartLink = screen.getByRole('link', { name: /cart/i });
            expect(cartLink).toHaveTextContent(/1/);
        });

        it('should link cart icon to cart page', () => {
            render(<Header />);

            const cartLink = screen.getByRole('link', { name: /cart/i });
            expect(cartLink).toHaveAttribute('href', '/cart');
        });
    });

    describe('Logout Functionality', () => {
        beforeEach(() => {
            mockIsAuthenticated = true;
        });

        it('should call logout when logout button is clicked', () => {
            render(<Header />);

            const logoutButton = screen.getByRole('button', { name: /sign out/i });
            fireEvent.click(logoutButton);

            expect(mockLogout).toHaveBeenCalledTimes(1);
        });

        it('should redirect to login page after logout', () => {
            render(<Header />);

            const logoutButton = screen.getByRole('button', { name: /sign out/i });
            fireEvent.click(logoutButton);

            expect(mockReplace).toHaveBeenCalledWith('/login');
        });
    });
});

