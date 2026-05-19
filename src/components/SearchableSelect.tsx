'use client';

import { useState, useEffect, useRef } from 'react';

export interface SelectItem {
    id: string | number;
    name: string;
    [key: string]: any;
}

interface SearchableSelectProps {
    label: string;
    items: SelectItem[];
    placeholder?: string;
    onSelect: (item: SelectItem) => void;
    onClear?: () => void;
    disabled?: boolean;
    hint?: string;
}

export default function SearchableSelect({
    label,
    items,
    placeholder = 'Search…',
    onSelect,
    onClear,
    disabled = false,
    hint,
}: SearchableSelectProps) {
    const [query, setQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<SelectItem | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset whenever the source list changes (e.g. parent reloaded options)
    useEffect(() => {
        setQuery('');
        setSelectedItem(null);
    }, [items]);

    const filteredItems = selectedItem
        ? items
        : items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

    const handleSelect = (item: SelectItem) => {
        setSelectedItem(item);
        setQuery(item.name);
        onSelect(item);
        inputRef.current?.blur();
    };

    const handleClear = () => {
        setSelectedItem(null);
        setQuery('');
        onClear?.();
        // Re-focus so keyboard users can immediately search again
        requestAnimationFrame(() => inputRef.current?.focus());
    };

    const showList = !selectedItem && !disabled && items.length > 0;
    const hasNoMatches = showList && filteredItems.length === 0;

    return (
        <div className={`relative w-full mb-5 ${disabled ? 'opacity-60' : ''}`}>
            <label className="field-label flex items-center justify-between">
                <span>{label}</span>
                {selectedItem && (
                    <span className="text-[10.5px] text-(--ok-700) font-medium normal-case tracking-normal">
                        ✓ Selected
                    </span>
                )}
            </label>

            {/* Field */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    disabled={disabled}
                    readOnly={!!selectedItem}
                    className={`field-input pr-10 ${
                        selectedItem
                            ? '!bg-(--brand-50) !border-(--brand-200) !text-(--brand-900) cursor-default font-medium'
                            : ''
                    }`}
                    placeholder={placeholder}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    autoComplete="off"
                    aria-expanded={showList}
                    aria-controls={showList ? `${label}-options` : undefined}
                />

                {/* Trailing affordance — clear (×) when selected, chevron otherwise */}
                {selectedItem ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label={`Clear ${label.toLowerCase()} selection`}
                        title="Clear selection"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded text-(--ink-3) hover:text-(--ink-1) hover:bg-(--surface-sunken) transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M6 6l12 12M18 6l-12 12"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                ) : (
                    <span
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-(--ink-3)"
                        aria-hidden="true"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M3 6.5h12M3 11.5h9M3 16.5h6"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                )}
            </div>

            {hint && !selectedItem && (
                <p className="mt-1.5 text-[12px] text-(--ink-3)">{hint}</p>
            )}

            {/* Inline list — always visible until a choice is made */}
            {showList && (
                <div
                    className="mt-2 bg-(--surface-card) border border-(--line) rounded overflow-hidden animate-rise-in"
                    id={`${label}-options`}
                >
                    {hasNoMatches ? (
                        <p className="px-4 py-3 text-sm text-(--ink-3) italic">
                            No matches for "{query}"
                        </p>
                    ) : (
                        <ul
                            className="max-h-64 overflow-y-auto divide-y divide-(--line)/70"
                            role="listbox"
                            aria-label={label}
                        >
                            {filteredItems.map(item => (
                                <li
                                    key={item.id}
                                    role="option"
                                    aria-selected={false}
                                    onClick={() => handleSelect(item)}
                                    className="group relative px-4 py-3 text-[0.95rem] text-(--ink-2) cursor-pointer hover:text-(--ink-1) hover:bg-(--surface-page)/60 transition-colors"
                                >
                                    {/* Left accent bar — slides in on hover */}
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-0 top-1 bottom-1 w-[2.5px] rounded-r-sm bg-(--brand-700) origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-200 ease-out"
                                    />
                                    <span className="block pl-2 transition-transform duration-200 group-hover:translate-x-0.5">
                                        {item.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
