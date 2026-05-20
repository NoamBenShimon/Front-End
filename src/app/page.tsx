'use client';

import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import SearchableSelect, { SelectItem } from '@/components/SearchableSelect';
import EquipmentList, { EquipmentData } from '@/components/EquipmentList';
import SaveToCartButton from '@/components/SaveToCartButton';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface SelectionState {
    school: SelectItem | null;
    grade: SelectItem | null;
}

interface EquipmentItemResponse {
    id: number;
    name: string;
    quantity: number;
    unitPrice?: number;
}

type RawEquipmentItem = Omit<EquipmentItemResponse, 'id'> & {
    id: number | string;
    price?: number;
};

interface RawEquipmentResponse {
    items?: RawEquipmentItem[];
    [key: string]: unknown;
}

const isRawEquipmentResponse = (value: unknown): value is RawEquipmentResponse => {
    if (!value || typeof value !== 'object') return false;
    return Array.isArray((value as { items?: unknown }).items);
};

const normalizeEquipmentItems = (items: RawEquipmentItem[]): EquipmentItemResponse[] =>
    items.map(item => ({
        ...item,
        id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id,
        unitPrice:
            typeof item.unitPrice === 'number'
                ? item.unitPrice
                : typeof item.price === 'number'
                    ? item.price
                    : item.unitPrice,
    }));

export default function Home() {
    const { isAuthenticated } = useAuth();

    const [selection, setSelection] = useState<SelectionState>({ school: null, grade: null });
    const [schools, setSchools] = useState<SelectItem[]>([]);
    const [grades, setGrades] = useState<SelectItem[]>([]);
    const [equipmentData, setEquipmentData] = useState<EquipmentData | null>(null);

    const [selectedEquipment, setSelectedEquipment] = useState<Set<number>>(new Set());
    const [quantities, setQuantities] = useState<Map<number, number>>(new Map());
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(
        async <T,>(
            endpoint: string,
            setter: (data: T) => void,
            resetSelections: boolean = true
        ) => {
            if (resetSelections) {
                setter([] as T);
                setEquipmentData(null);
            }

            setIsLoading(true);
            try {
                const url = `${API_BASE_URL}${endpoint}`;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch ${endpoint}. Status: ${response.status}`);
                const data = (await response.json()) as unknown;
                let payload: unknown = data;
                if (endpoint.startsWith('/api/equipment') && isRawEquipmentResponse(data)) {
                    payload = {
                        ...data,
                        items: data.items ? normalizeEquipmentItems(data.items) : [],
                    };
                }
                setter(payload as T);
            } catch (error) {
                console.error(`Error fetching ${endpoint}:`, error);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData('/api/schools', setSchools, false);
    }, [fetchData, isAuthenticated]);

    useEffect(() => {
        if (equipmentData) {
            const allIds = new Set(equipmentData.items.map(item => item.id));
            setSelectedEquipment(allIds);
            const initialQuantities = new Map(equipmentData.items.map(item => [item.id, item.quantity]));
            setQuantities(initialQuantities);
        }
    }, [equipmentData]);

    const handleSchoolSelect = useCallback(
        (item: SelectItem) => {
            setSelection({ school: item, grade: null });
            setGrades([]);
            setEquipmentData(null);
            fetchData(`/api/grades?school_id=${item.id}`, setGrades);
        },
        [fetchData]
    );

    const handleSchoolClear = useCallback(() => {
        setSelection({ school: null, grade: null });
        setGrades([]);
        setEquipmentData(null);
    }, []);

    const handleGradeSelect = useCallback(
        (item: SelectItem) => {
            setSelection(prev => ({ ...prev, grade: item }));
            setEquipmentData(null);
            const endpoint = `/api/equipment?school_id=${selection.school?.id}&grade_id=${item.id}`;
            fetchData(endpoint, setEquipmentData);
        },
        [fetchData, selection.school?.id]
    );

    const handleGradeClear = useCallback(() => {
        setSelection(prev => ({ ...prev, grade: null }));
        setEquipmentData(null);
    }, []);

    const handleToggleEquipment = (id: number) => {
        setSelectedEquipment(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        setQuantities(prev => {
            const newMap = new Map(prev);
            newMap.set(id, quantity);
            return newMap;
        });
    };

    // Step progression
    const currentStep = equipmentData ? 3 : selection.school ? 2 : 1;

    return (
        <Layout>
            <div className="relative">
                {/* Decorative arched band, very subtle — gives the hero a sense of "place" */}
                <div className="absolute inset-x-0 top-0 h-[280px] pointer-events-none overflow-hidden">
                    <div
                        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[400px] rounded-[50%]"
                        style={{
                            background:
                                'radial-gradient(ellipse at center, rgba(31, 122, 146, 0.07) 0%, transparent 70%)',
                        }}
                    />
                </div>

                <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-12 pb-20">
                    {/* Hero */}
                    <header className="text-center mb-10 animate-rise-in">
                        <p className="eyebrow mb-3">School supplies</p>
                        <h1 className="font-display text-[2.6rem] sm:text-[3.2rem] leading-[1.05] tracking-tight text-(--ink-1) mb-4">
                            Order your child&#39;s
                            <br />
                            <span className="text-(--brand-900) italic" style={{ fontVariationSettings: '"WONK" 1' }}>
                                school list
                            </span>
                            <span className="text-(--ink-1)">, in one go.</span>
                        </h1>
                        <p className="text-[1.05rem] leading-relaxed text-ink-2 max-w-xl mx-auto">
                            Pick your school and your child&#39;s grade to see the equipment list,
                            then check out in one payment.
                        </p>
                    </header>

                    {/* Step indicator */}
                    <ol className="flex items-center justify-center gap-2 mb-10 text-[12px] uppercase tracking-[0.14em] animate-rise-in delay-1">
                        <Step label="School" index={1} current={currentStep} />
                        <Connector active={currentStep > 1} />
                        <Step label="Grade" index={2} current={currentStep} />
                        <Connector active={currentStep > 2} />
                        <Step label="Items" index={3} current={currentStep} />
                    </ol>

                    {/* Selection card */}
                    <div className="surface-card p-6 sm:p-8 animate-rise-in delay-2">
                        <SearchableSelect
                            label="School"
                            items={schools}
                            placeholder={isLoading && schools.length === 0 ? 'Loading schools…' : 'Search for a school'}
                            onSelect={handleSchoolSelect}
                            onClear={handleSchoolClear}
                            disabled={isLoading && schools.length === 0}
                            hint={!selection.school ? 'Start by selecting the school your child attends.' : undefined}
                        />

                        {grades.length > 0 && (
                            <div className="animate-rise-in">
                                <SearchableSelect
                                    label="Grade"
                                    items={grades}
                                    placeholder={selection.school ? 'Search for a grade' : 'Select a school first'}
                                    onSelect={handleGradeSelect}
                                    onClear={handleGradeClear}
                                    disabled={!selection.school || isLoading}
                                    hint={!selection.grade && selection.school ? 'Pick the grade your child is starting.' : undefined}
                                />
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex items-center justify-center gap-3 py-6 text-(--ink-3)">
                                <svg className="animate-spin-slow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
                                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span className="text-[13px]">Loading…</span>
                            </div>
                        )}

                        {!selection.school && !isLoading && (
                            <div className="mt-6 flex items-start gap-3 p-4 bg-(--brand-50) border border-(--brand-200) rounded">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-(--brand-700) text-(--surface-page) text-[10px] font-bold flex-shrink-0 mt-0.5">i</span>
                                <p className="text-[13px] leading-relaxed text-(--brand-900)">
                                    If something on the list looks wrong, please check with the
                                    school secretariat first.
                                </p>
                            </div>
                        )}
                    </div>

                    {equipmentData && (
                        <div className="animate-rise-in">
                            <EquipmentList
                                data={equipmentData}
                                selectedIds={selectedEquipment}
                                quantities={quantities}
                                onToggle={handleToggleEquipment}
                                onQuantityChange={handleQuantityChange}
                            />
                            <SaveToCartButton
                                school={
                                    selection.school
                                        ? { id: Number(selection.school.id), name: selection.school.name }
                                        : null
                                }
                                grade={
                                    selection.grade
                                        ? { id: Number(selection.grade.id), name: selection.grade.name }
                                        : null
                                }
                                selectedIds={selectedEquipment}
                                quantities={quantities}
                                items={equipmentData.items}
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

function Step({ label, index, current }: { label: string; index: number; current: number }) {
    const state = current === index ? 'current' : current > index ? 'done' : 'pending';
    return (
        <li className="flex items-center gap-2">
            <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold border transition-colors tabular-nums ${
                    state === 'current'
                        ? 'bg-(--brand-900) text-(--surface-page) border-(--brand-900)'
                        : state === 'done'
                            ? 'bg-(--ok-500) text-white border-(--ok-500)'
                            : 'bg-(--surface-card) text-(--ink-3) border-(--line-strong)'
                }`}
                aria-current={state === 'current' ? 'step' : undefined}
            >
                {state === 'done' ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    index
                )}
            </span>
            <span
                className={`text-[11.5px] font-semibold ${
                    state === 'current' ? 'text-(--ink-1)' : state === 'done' ? 'text-(--ok-700)' : 'text-(--ink-3)'
                }`}
            >
                {label}
            </span>
        </li>
    );
}

function Connector({ active }: { active: boolean }) {
    return (
        <span
            aria-hidden="true"
            className={`block w-8 h-px transition-colors ${active ? 'bg-(--ok-500)' : 'bg-(--line-strong)'}`}
        />
    );
}
