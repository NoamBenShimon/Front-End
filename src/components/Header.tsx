'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Cart count — gracefully unavailable when not authenticated
    let cartCount = 0;
    try {
        const cart = useCart();
        cartCount = cart.cartEntries.length;
    } catch { /* CartProvider not mounted */ }

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ];

    const isCurrent = (href: string) =>
        href === '/' ? pathname === '/' : pathname?.startsWith(href);

    return (
        <header className="relative z-30 bg-[var(--surface-page)]/85 backdrop-blur-md border-b border-[var(--line)]">
            {/* fine top accent rule */}
            <div className="h-[3px] w-full bg-[var(--brand-900)]" />

            <nav className="max-w-6xl mx-auto px-5 sm:px-8">
                <div className="flex justify-between items-center h-[72px]">
                    {/* Brand cluster — crest + wordmark + municipal tagline */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <span className="crest" aria-hidden="true">M</span>
                        <span className="flex flex-col leading-none">
                            <span className="font-display text-[1.45rem] tracking-tight text-[var(--ink-1)] group-hover:text-[var(--brand-900)] transition-colors">
                                Motzkin Store
                            </span>
                            <span className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--ink-3)] mt-1">
                                City of Kiryat Motzkin
                            </span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <ul className="flex items-center gap-7">
                            {navLinks.map(link => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="nav-link"
                                        aria-current={isCurrent(link.href) ? 'page' : undefined}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="hair-v h-5" />

                        {/* Language toggle stub — future i18n */}
                        <div
                            className="flex items-center text-[12px] font-medium select-none"
                            role="group"
                            aria-label="Language (coming soon)"
                            title="Hebrew support coming soon"
                        >
                            <span className="px-1.5 py-0.5 rounded-sm text-[var(--ink-1)] bg-[var(--surface-sunken)]">
                                EN
                            </span>
                            <span className="mx-1 text-[var(--ink-3)]">/</span>
                            <span className="px-1.5 py-0.5 rounded-sm text-[var(--ink-3)] hover:text-[var(--ink-2)] cursor-not-allowed">
                                עב
                            </span>
                        </div>

                        {isAuthenticated && (
                            <>
                                <div className="hair-v h-5" />

                                <Link
                                    href="/cart"
                                    className="relative inline-flex items-center gap-2 nav-link"
                                    aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'list' : 'lists'}`}
                                >
                                    <CartIcon filled={cartCount > 0} />
                                    <span className="text-[var(--ink-2)]">Cart</span>
                                    {cartCount > 0 && (
                                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10.5px] font-semibold leading-none rounded-full bg-[var(--clay-700)] text-[#FFF8EF] tabular-nums">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="text-[13px] font-medium text-[var(--ink-3)] hover:text-[var(--ink-1)] transition-colors"
                                >
                                    Sign out
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile trigger */}
                    <button
                        type="button"
                        className="md:hidden p-2 -mr-2 text-[var(--ink-1)]"
                        aria-label="Open menu"
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen(v => !v)}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            {mobileOpen ? (
                                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            ) : (
                                <>
                                    <path d="M4 7h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                    <path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                    <path d="M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile drawer */}
                {mobileOpen && (
                    <div className="md:hidden pb-6 pt-2 animate-rise-in">
                        <ul className="flex flex-col gap-1 border-t border-[var(--line)] pt-4">
                            {navLinks.map(link => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="block py-2.5 px-2 text-[0.95rem] text-[var(--ink-1)] hover:bg-[var(--surface-sunken)] rounded"
                                        aria-current={isCurrent(link.href) ? 'page' : undefined}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            {isAuthenticated && (
                                <>
                                    <li>
                                        <Link
                                            href="/cart"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-between py-2.5 px-2 text-[0.95rem] text-[var(--ink-1)] hover:bg-[var(--surface-sunken)] rounded"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <CartIcon filled={cartCount > 0} />
                                                Cart
                                            </span>
                                            {cartCount > 0 && (
                                                <span className="text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full bg-[var(--clay-50)] text-[var(--clay-900)]">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => { setMobileOpen(false); handleLogout(); }}
                                            className="w-full text-left py-2.5 px-2 text-[0.95rem] text-[var(--ink-2)] hover:bg-[var(--surface-sunken)] rounded"
                                        >
                                            Sign out
                                        </button>
                                    </li>
                                </>
                            )}
                            <li className="pt-3 mt-2 border-t border-[var(--line)]">
                                <div className="px-2 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-3)]">
                                    Language · Hebrew coming soon
                                </div>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
}

function CartIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M3 4h2.2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="10" cy="20" r="1.2" fill="currentColor" />
            <circle cx="17" cy="20" r="1.2" fill="currentColor" />
            {filled && (
                <path
                    d="M7.2 9.5h11.4l-1.1 5.3a1.2 1.2 0 0 1-1.2 1H9.8a1.2 1.2 0 0 1-1.2-1L7.2 9.5z"
                    fill="var(--clay-700)"
                    opacity="0.85"
                />
            )}
        </svg>
    );
}
