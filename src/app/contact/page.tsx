'use client';

import Layout from '@/components/Layout';
import Link from 'next/link';

export default function ContactPage() {
    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
                {/* Hero */}
                <header className="mb-12 max-w-2xl animate-rise-in">
                    <p className="eyebrow mb-3">Get in touch</p>
                    <h1 className="font-display text-[2.6rem] sm:text-[3rem] leading-[1.05] tracking-tight text-(--ink-1) mb-4">
                        We're here to help.
                    </h1>
                    <p className="text-[1.05rem] leading-relaxed text-ink-2">
                        For questions about school equipment orders, payments, or
                        technical issues, reach out to the municipality's service centre
                        or to the developer team.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
                    {/* Municipality — primary card, spans wider */}
                    <section className="lg:col-span-3 surface-card overflow-hidden animate-rise-in delay-1">
                        <div className="px-7 pt-6 pb-1 bg-(--surface-sunken) border-b border-(--line)">
                            <p className="eyebrow mb-1">Municipality</p>
                            <h2 className="font-display text-[1.7rem] tracking-tight text-(--ink-1) mb-3 leading-tight">
                                Kiryat Motzkin City Hall
                            </h2>
                        </div>

                        <div className="px-7 py-6 space-y-6">
                            <ContactRow label="Address">
                                <a
                                    href="https://maps.app.goo.gl/jz7yv3hggruuKcjs9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-(--ink-1) hover:text-(--brand-900) transition-colors underline decoration-(--line-strong) underline-offset-4 hover:decoration-(--brand-700)"
                                >
                                    Lev Hakrayot Centre<br />
                                    Ben Gurion Boulevard 80<br />
                                    Kiryat Motzkin, Israel
                                </a>
                            </ContactRow>

                            <ContactRow label="Service centre">
                                <ul className="space-y-1.5">
                                    <li className="flex items-center justify-between gap-4">
                                        <span className="text-ink-2 text-[13.5px]">Main line</span>
                                        <a href="tel:+97248780900" className="text-(--ink-1) tabular-nums hover:text-(--brand-900) transition-colors">
                                            04-878-0900
                                        </a>
                                    </li>
                                    <li className="flex items-center justify-between gap-4">
                                        <span className="text-ink-2 text-[13.5px]">Quick dial</span>
                                        <a href="tel:*5470" className="text-(--ink-1) tabular-nums hover:text-(--brand-900) transition-colors">
                                            *5470
                                        </a>
                                    </li>
                                    <li className="flex items-center justify-between gap-4">
                                        <span className="text-ink-2 text-[13.5px]">WhatsApp</span>
                                        <a
                                            href="https://wa.me/972542223352"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-(--ink-1) tabular-nums hover:text-(--brand-900) transition-colors"
                                        >
                                            +972 54-222-3352
                                        </a>
                                    </li>
                                </ul>
                            </ContactRow>

                            <ContactRow label="General enquiries">
                                <a href="tel:+97248780222" className="text-(--ink-1) tabular-nums hover:text-(--brand-900) transition-colors">
                                    04-878-0222
                                </a>
                            </ContactRow>

                            <ContactRow label="Website">
                                <a
                                    href="https://www.kiryat-motzkin.muni.il"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-(--brand-700) hover:text-(--brand-900) transition-colors"
                                >
                                    kiryat-motzkin.muni.il →
                                </a>
                            </ContactRow>
                        </div>
                    </section>

                    {/* Development team */}
                    <section className="lg:col-span-2 surface-card flex flex-col animate-rise-in delay-2">
                        <div className="px-7 pt-6 pb-1 bg-(--surface-sunken) border-b border-(--line)">
                            <p className="eyebrow mb-1">Development</p>
                            <h2 className="font-display text-[1.55rem] tracking-tight text-(--ink-1) mb-3 leading-tight">
                                Site &amp; technical support
                            </h2>
                        </div>
                        <div className="px-7 py-6 flex-1 flex flex-col">
                            <p className="text-[14px] leading-relaxed text-ink-2 mb-4">
                                Found a bug or have a feature suggestion? Our development team
                                handles it on GitHub.
                            </p>
                            <p className="text-[14px] leading-relaxed text-ink-2 mb-6">
                                Team profiles and direct links are on the About page.
                            </p>
                            <Link href="/about" className="btn btn-quiet mt-auto self-start">
                                Meet the team →
                            </Link>
                        </div>
                    </section>
                </div>

                {/* Hours */}
                <section className="surface-card p-7 sm:p-8 animate-rise-in delay-3">
                    <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
                        <h2 className="font-display text-[1.4rem] tracking-tight text-(--ink-1)">
                            Office hours
                        </h2>
                        <p className="text-[12px] text-(--ink-3)">All times Israel Time (IST)</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-(--line) border border-(--line) rounded overflow-hidden">
                        <Hours title="Sunday – Tuesday, Thursday" hours="8:00 – 15:30" />
                        <Hours title="Wednesday" hours="8:00 – 13:00\n16:00 – 18:00" />
                        <Hours title="Friday – Saturday" hours="Closed" muted />
                    </div>
                </section>
            </div>
        </Layout>
    );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-[10.5px] uppercase tracking-[0.16em] text-(--ink-3) font-semibold mb-2">
                {label}
            </p>
            <div className="text-[14.5px] leading-relaxed">{children}</div>
        </div>
    );
}

function Hours({ title, hours, muted = false }: { title: string; hours: string; muted?: boolean }) {
    return (
        <div className="bg-(--surface-card) px-5 py-4">
            <p className="text-[11.5px] uppercase tracking-[0.14em] font-semibold text-(--ink-1) mb-1.5">
                {title}
            </p>
            <p className={`text-[14px] tabular-nums whitespace-pre-line ${muted ? 'text-(--ink-3)' : 'text-ink-2'}`}>
                {hours.replace(/\\n/g, '\n')}
            </p>
        </div>
    );
}
