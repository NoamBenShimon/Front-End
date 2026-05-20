/**
 * @fileoverview Authentication Context Provider
 *
 * Provides authentication state and actions throughout the application.
 * Uses the backend API for session management with localStorage fallback
 * for session persistence across page reloads.
 *
 * @module contexts/AuthContext
 *
 * @example
 * ```tsx
 * // In a component
 * const { isAuthenticated, login, logout, username } = useAuth();
 *
 * if (!isAuthenticated) {
 *   await login('user@example.com', 'password');
 * }
 * ```
 */
'use client';

import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import * as api from '@/services/api';

/**
 * Shape of the authentication context value.
 */
interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    userid: string | null;
    username: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userid, setUserid] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    // `isLoading` is true only until we have *some* answer — either from
    // localStorage (synchronously, on mount) or from the backend. We never
    // wait for a slow/hanging /api/auth/status before flipping it to false.
    const [isLoading, setIsLoading] = useState(true);

    // Helper: persist to localStorage
    const persistAuth = (userid: string, username: string) => {
        localStorage.setItem('userid', userid);
        localStorage.setItem('username', username);
    };
    const clearPersistedAuth = () => {
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
    };

    useEffect(() => {
        let cancelled = false;

        // Step 1 (synchronous): seed state from localStorage so the app renders
        // immediately on cold mount — including the cold mount that happens
        // when the browser back-button returns the user from Stripe.
        const storedUserid = localStorage.getItem('userid');
        const storedUsername = localStorage.getItem('username');
        const hasStoredAuth = Boolean(storedUserid && storedUsername);
        if (hasStoredAuth) {
            setIsAuthenticated(true);
            setUserid(storedUserid);
            setUsername(storedUsername);
        }
        setIsLoading(false);

        // Step 2 (background): verify with the backend. If the session is
        // still valid we refresh the stored userid/username. If it isn't and
        // we had no localStorage credentials either, fall through to logged
        // out. A slow/hanging /api/auth/status no longer blocks the UI.
        (async () => {
            try {
                const data = await api.checkAuth();
                if (cancelled) return;
                setIsAuthenticated(true);
                setUserid(data.userid);
                setUsername(data.username);
                persistAuth(data.userid, data.username);
            } catch {
                if (cancelled || hasStoredAuth) return;
                setIsAuthenticated(false);
                setUserid(null);
                setUsername(null);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const data = await api.login({ username, password });
            setIsAuthenticated(true);
            setUserid(data.userid);
            setUsername(username); // Backend does not return username, so use input
            persistAuth(data.userid, username);
        } catch (err) {
            setIsAuthenticated(false);
            setUserid(null);
            setUsername(null);
            clearPersistedAuth();
            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (err) {
            // Optionally show error, but always log out locally
        }
        setIsAuthenticated(false);
        setUserid(null);
        setUsername(null);
        clearPersistedAuth();
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, isLoading, userid, username, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}