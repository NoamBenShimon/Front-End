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

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    userid: string | null;
    username: string | null;
}

const INITIAL_AUTH_STATE: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    userid: null,
    username: null,
};

const LOGGED_OUT_STATE: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    userid: null,
    username: null,
};

const isSameAuthState = (a: AuthState, b: AuthState): boolean =>
    a.isAuthenticated === b.isAuthenticated &&
    a.isLoading === b.isLoading &&
    a.userid === b.userid &&
    a.username === b.username;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    // Auth state is one object so the mount effect only fires a single
    // bail-outable setter (satisfies react-hooks/set-state-in-effect).
    const [authState, setAuthState] = useState<AuthState>(INITIAL_AUTH_STATE);

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

        // This effect is the canonical "subscribe to an external system on
        // mount" case the react-hooks/set-state-in-effect rule's documentation
        // explicitly permits: we read from localStorage (an external system)
        // and from the backend (another external system) and propagate their
        // values into React state. The static analyzer can't distinguish this
        // from accidental setState-in-effect, so we disable the rule here with
        // a bail-outable functional updater for safety.
        const storedUserid = localStorage.getItem('userid');
        const storedUsername = localStorage.getItem('username');
        const hasStoredAuth = Boolean(storedUserid && storedUsername);
        const seeded: AuthState = hasStoredAuth
            ? {
                isAuthenticated: true,
                isLoading: false,
                userid: storedUserid,
                username: storedUsername,
            }
            : LOGGED_OUT_STATE;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuthState(prev => (isSameAuthState(prev, seeded) ? prev : seeded));

        (async () => {
            try {
                const data = await api.checkAuth();
                if (cancelled) return;
                const verified: AuthState = {
                    isAuthenticated: true,
                    isLoading: false,
                    userid: data.userid,
                    username: data.username,
                };
                setAuthState(prev => (isSameAuthState(prev, verified) ? prev : verified));
                persistAuth(data.userid, data.username);
            } catch {
                if (cancelled || hasStoredAuth) return;
                setAuthState(prev => (isSameAuthState(prev, LOGGED_OUT_STATE) ? prev : LOGGED_OUT_STATE));
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const data = await api.login({ username, password });
            setAuthState({
                isAuthenticated: true,
                isLoading: false,
                userid: data.userid,
                username, // Backend does not return username, so use input
            });
            persistAuth(data.userid, username);
        } catch (err) {
            setAuthState(LOGGED_OUT_STATE);
            clearPersistedAuth();
            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch {
            // Optionally show error, but always log out locally
        }
        setAuthState(LOGGED_OUT_STATE);
        clearPersistedAuth();
    };

    return (
        <AuthContext.Provider value={{...authState, login, logout}}>
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