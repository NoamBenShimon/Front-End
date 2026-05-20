'use client';

import { useEffect, useCallback } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'default';
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'default',
}: ConfirmDialogProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        },
        [onCancel]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const isDanger = variant === 'danger';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-(--ink-1)/45 backdrop-blur-[2px] animate-fade-in"
                onClick={onCancel}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                className="relative w-full max-w-md bg-card border border-line rounded shadow-(--shadow-lg) animate-scale-in overflow-hidden"
            >
                {/* Accent stripe */}
                <div className={`h-1 w-full ${isDanger ? 'bg-(--bad-500)' : 'bg-(--brand-900)'}`} />

                <div className="px-6 pt-5 pb-6">
                    <h2
                        id="confirm-title"
                        className="font-display text-[1.35rem] tracking-tight text-(--ink-1) mb-1.5"
                    >
                        {title}
                    </h2>
                    <p className="text-[0.93rem] leading-relaxed text-ink-2">
                        {message}
                    </p>

                    <div className="mt-6 flex justify-end gap-2.5">
                        <button onClick={onCancel} className="btn btn-quiet">
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`btn ${isDanger ? 'btn-clay' : 'btn-primary'}`}
                            style={isDanger ? { background: 'var(--bad-500)', borderColor: 'var(--bad-500)' } : undefined}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
