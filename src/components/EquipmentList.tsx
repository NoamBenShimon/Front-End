'use client';

export interface EquipmentItem {
    id: number;
    name: string;
    quantity: number;
    unitPrice?: number;
}

export interface EquipmentData {
    classId: number;
    className: string;
    items: EquipmentItem[];
}

interface EquipmentListProps {
    data: EquipmentData;
    selectedIds: Set<number>;
    quantities: Map<number, number>;
    onToggle: (id: number) => void;
    onQuantityChange: (id: number, quantity: number) => void;
}

const MIN_QUANTITY = 0;
const formatCurrency = (amount: number) => `${amount.toFixed(2)} ILS`;

export default function EquipmentList({
    data,
    selectedIds,
    quantities,
    onToggle,
    onQuantityChange,
}: EquipmentListProps) {
    // Subtotal for currently selected items
    const subtotal = data.items.reduce((sum, item) => {
        if (!selectedIds.has(item.id)) return sum;
        const qty = quantities.get(item.id) ?? item.quantity;
        return sum + qty * (item.unitPrice ?? 0);
    }, 0);

    const selectedCount = data.items.filter(i => selectedIds.has(i.id)).length;

    return (
        <section className="mt-8 animate-rise-in">
            <header className="flex items-end justify-between mb-3 gap-4">
                <div>
                    <p className="eyebrow mb-1">Equipment list</p>
                    <h3 className="font-display text-[1.55rem] tracking-tight text-(--ink-1) leading-tight">
                        {data.className}
                    </h3>
                </div>
                <p className="text-[12.5px] text-ink-3 tabular-nums whitespace-nowrap">
                    {selectedCount} of {data.items.length} selected
                </p>
            </header>

            <div className="surface-card overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 px-5 py-3 bg-sunken border-b border-line">
                    <span className="w-5" aria-hidden="true" />
                    <span className="eyebrow !text-(--ink-3)">Item</span>
                    <span className="eyebrow !text-(--ink-3) text-right w-28">Price</span>
                    <span className="eyebrow !text-(--ink-3) text-center w-24">Qty</span>
                </div>

                {/* Items */}
                <ul className="divide-y divide-(--line)">
                    {data.items.map(item => {
                        const isSelected = selectedIds.has(item.id);
                        const currentQty = quantities.get(item.id) ?? item.quantity;
                        const maxQty = item.quantity;

                        return (
                            <li
                                key={item.id}
                                className={`grid grid-cols-[auto_1fr_auto_auto] gap-x-4 px-5 py-3.5 transition-colors ${
                                    isSelected ? 'bg-(--surface-card)' : 'bg-(--surface-muted)'
                                }`}
                            >
                                {/* Checkbox */}
                                <button
                                    type="button"
                                    onClick={() => onToggle(item.id)}
                                    aria-pressed={isSelected}
                                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${item.name}`}
                                    className={`w-5 h-5 rounded-[3px] border flex items-center justify-center transition-all flex-shrink-0 self-center ${
                                        isSelected
                                            ? 'bg-(--brand-900) border-(--brand-900) text-(--surface-page)'
                                            : 'bg-(--surface-card) border-(--line-strong) hover:border-(--brand-700)'
                                    }`}
                                >
                                    {isSelected && (
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>

                                {/* Name */}
                                <button
                                    type="button"
                                    onClick={() => onToggle(item.id)}
                                    className={`text-left text-[0.97rem] self-center transition-colors ${
                                        isSelected ? 'text-(--ink-1)' : 'text-(--ink-3) line-through decoration-(--ink-3)/30'
                                    }`}
                                >
                                    {item.name}
                                </button>

                                {/* Price */}
                                <span className={`self-center text-right w-28 tabular-nums text-[0.92rem] ${
                                    isSelected ? 'text-(--ink-2)' : 'text-(--ink-3)'
                                }`}>
                                    {formatCurrency(item.unitPrice ?? 0)}
                                </span>

                                {/* Quantity */}
                                <div className="w-24 self-center flex items-center justify-center">
                                    <div className={`inline-flex items-center rounded border ${
                                        isSelected
                                            ? 'border-(--line-strong) bg-(--surface-card)'
                                            : 'border-(--line) bg-(--surface-sunken)'
                                    }`}>
                                        <button
                                            type="button"
                                            onClick={() => onQuantityChange(item.id, Math.max(MIN_QUANTITY, currentQty - 1))}
                                            disabled={!isSelected || currentQty <= MIN_QUANTITY}
                                            className="w-7 h-8 flex items-center justify-center text-(--ink-2) hover:bg-(--surface-sunken) hover:text-(--ink-1) disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Decrease quantity"
                                        >−</button>
                                        <input
                                            type="number"
                                            min={MIN_QUANTITY}
                                            max={maxQty}
                                            value={currentQty}
                                            onChange={e => {
                                                const val = parseInt(e.target.value) || 0;
                                                onQuantityChange(item.id, Math.max(MIN_QUANTITY, Math.min(maxQty, val)));
                                            }}
                                            disabled={!isSelected}
                                            className="w-9 h-8 text-center text-[0.9rem] tabular-nums bg-transparent text-(--ink-1) disabled:text-(--ink-3) border-x border-(--line) outline-none focus:bg-(--brand-50)"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => onQuantityChange(item.id, Math.min(maxQty, currentQty + 1))}
                                            disabled={!isSelected || currentQty >= maxQty}
                                            className="w-7 h-8 flex items-center justify-center text-(--ink-2) hover:bg-(--surface-sunken) hover:text-(--ink-1) disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Increase quantity"
                                        >+</button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* Subtotal band */}
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-(--line) bg-(--surface-sunken)">
                    <span className="text-[12.5px] uppercase tracking-[0.16em] font-semibold text-(--ink-2)">
                        List subtotal
                    </span>
                    <span className="font-display text-[1.25rem] tabular-nums text-(--clay-900)">
                        {formatCurrency(subtotal)}
                    </span>
                </div>
            </div>
        </section>
    );
}
