export const locales = ['en', 'he'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export const localeLabels: Record<Locale, string> = {
    en: 'English',
    he: 'עברית',
};

export function isLocale(value: string | undefined | null): value is Locale {
    return !!value && (locales as readonly string[]).includes(value);
}
