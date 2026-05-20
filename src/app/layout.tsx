import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthenticatedProviders from "@/components/AuthenticatedProviders";
import ProtectedRoute from "@/components/ProtectedRoute";

const fraunces = Fraunces({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-display-loaded",
    axes: ["SOFT", "WONK", "opsz"],
});

const geist = Geist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-body-loaded",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-mono-loaded",
});

export const metadata: Metadata = {
    title: "Motzkin Store · School Equipment",
    description:
        "Order the school supply list for your child in Kiryat Motzkin.",
};

// Pre-hydration guard for the Stripe back-button hang.
//
// When the user is on /checkout, clicks "Confirm & pay", lands on Stripe, then
// presses browser back, the browser brings them back to /checkout via one of:
//   - bfcache restore (pageshow.persisted === true): React state is frozen
//     with isProcessing=true, the page reappears stuck on the spinner button.
//   - Cold reload (Navigation Timing type === 'back_forward'): the page
//     re-fetches, but Next.js dev mode and our auth gate can leave it stuck on
//     the full-page AuthSpinner before CheckoutPage ever mounts.
//
// Both paths reach /checkout in an unrecoverable state. Doing the redirect
// inside CheckoutPage is too late — its effect doesn't run while ProtectedRoute
// is still showing the spinner. We run this as a synchronous, pre-hydration
// inline script so it fires before React/Next does anything, independent of
// auth/cart state, the router, or whether the page bfcached.
const BACK_NAV_REDIRECT_SCRIPT = `
(function () {
    function onCheckout() {
        return location.pathname === '/checkout' || location.pathname.indexOf('/checkout/') === 0;
    }
    function goHome() { location.replace('/'); }
    try {
        var nav = performance.getEntriesByType('navigation')[0];
        if (nav && nav.type === 'back_forward' && onCheckout()) { goHome(); return; }
    } catch (e) {}
    window.addEventListener('pageshow', function (e) {
        if (e.persisted && onCheckout()) goHome();
    });
})();
`;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            dir="ltr"
            className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: BACK_NAV_REDIRECT_SCRIPT }} />
            </head>
            <body className="antialiased" suppressHydrationWarning>
                <AuthProvider>
                    <AuthenticatedProviders>
                        <ProtectedRoute>{children}</ProtectedRoute>
                    </AuthenticatedProviders>
                </AuthProvider>
            </body>
        </html>
    );
}
