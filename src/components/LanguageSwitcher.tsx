'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useTransition} from 'react';
import {setLocaleCookie} from '@/i18n/actions';
import {Locale, locales} from '@/i18n/config';

export default function LanguageSwitcher() {
    const currentLocale = useLocale() as Locale;
    const t = useTranslations('LanguageSwitcher');
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const next = e.target.value as Locale;
        if (next === currentLocale) return;
        startTransition(() => {
            void setLocaleCookie(next);
        });
    };

    return (
        <label className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="sr-only">{t('label')}</span>
            <select
                aria-label={t('label')}
                value={currentLocale}
                onChange={handleChange}
                disabled={isPending}
                className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {locales.map((loc) => (
                    <option key={loc} value={loc}>
                        {loc === 'he' ? t('hebrew') : t('english')}
                    </option>
                ))}
            </select>
        </label>
    );
}
