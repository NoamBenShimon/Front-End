'use server';

import {cookies} from 'next/headers';
import {revalidatePath} from 'next/cache';
import {Locale, locales, LOCALE_COOKIE_NAME} from './config';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function setLocaleCookie(locale: Locale) {
    if (!locales.includes(locale)) {
        throw new Error(`Unsupported locale: ${locale}`);
    }
    const cookieStore = await cookies();
    cookieStore.set(LOCALE_COOKIE_NAME, locale, {
        path: '/',
        maxAge: ONE_YEAR_SECONDS,
        sameSite: 'lax',
    });
    revalidatePath('/', 'layout');
}
