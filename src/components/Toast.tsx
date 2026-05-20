'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
    delay?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 3000, delay = 0 }: ToastProps) {
    const onCloseRef = useRef(onClose);
    const [showContent, setShowContent] = useState(false);
    const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    const clearAllTimers = useCallback(() => {
        if (delayTimerRef.current) {
            clearTimeout(delayTimerRef.current);
            delayTimerRef.current = null;
        }
        if (dismissTimerRef.current) {
            clearTimeout(dismissTimerRef.current);
            dismissTimerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (isVisible) {
            delayTimerRef.current = setTimeout(() => {
                setShowContent(true);
                dismissTimerRef.current = setTimeout(() => {
                    onCloseRef.current();
                }, duration);
            }, delay);
        }

        return () => {
            clearAllTimers();
            setTimeout(() => setShowContent(false), 0);
        };
    }, [isVisible, delay, duration, clearAllTimers]);

    if (!showContent) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div
                className="relative bg-(--brand-900) text-(--surface-page) px-5 py-3.5 rounded shadow-(--shadow-lg) overflow-hidden min-w-[280px] animate-toast-lifecycle border border-(--brand-700)"
                style={{ animationDuration: `${duration}ms` }}
                role="status"
                aria-live="polite"
            >
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-(--clay-500) text-(--surface-page) flex-shrink-0">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M5 13l4 4L19 7"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <span className="font-medium text-[0.93rem]">{message}</span>
                </div>

                <div
                    className="absolute bottom-0 left-0 h-[2px] bg-(--clay-500) animate-timer-line"
                    style={{ animationDuration: `${duration}ms` }}
                />
            </div>
        </div>
    );
}
