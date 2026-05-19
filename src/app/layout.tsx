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
