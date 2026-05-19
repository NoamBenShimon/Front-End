import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 mt-auto border-t border-[var(--line)] bg-[var(--surface-band)]">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
                {/* Upper band — three columns */}
                <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-8 md:gap-12 mb-10">
                    {/* Brand block */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="crest" aria-hidden="true">M</span>
                            <span className="flex flex-col leading-none">
                                <span className="font-display text-[1.25rem] tracking-tight text-[var(--ink-1)]">
                                    Motzkin Store
                                </span>
                                <span className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--ink-3)] mt-1">
                                    City of Kiryat Motzkin
                                </span>
                            </span>
                        </div>
                        <p className="text-[13.5px] leading-relaxed text-[var(--ink-2)] max-w-sm">
                            Order school equipment for children attending schools in
                            Kiryat Motzkin.
                        </p>
                    </div>

                    <div>
                        <h4 className="eyebrow mb-3">Site</h4>
                        <ul className="space-y-2 text-[14px] text-[var(--ink-2)]">
                            <li><Link href="/" className="hover:text-[var(--ink-1)] transition-colors">Order equipment</Link></li>
                            <li><Link href="/cart" className="hover:text-[var(--ink-1)] transition-colors">Cart</Link></li>
                            <li><Link href="/about" className="hover:text-[var(--ink-1)] transition-colors">About</Link></li>
                            <li><Link href="/contact" className="hover:text-[var(--ink-1)] transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="eyebrow mb-3">Help</h4>
                        <ul className="space-y-2 text-[14px] text-[var(--ink-2)]">
                            <li>
                                <a href="tel:+97248780900" className="hover:text-[var(--ink-1)] transition-colors">
                                    Service centre · 04-878-0900
                                </a>
                            </li>
                            <li>
                                <a href="tel:*5470" className="hover:text-[var(--ink-1)] transition-colors">
                                    Quick dial · *5470
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.kiryat-motzkin.muni.il"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[var(--ink-1)] transition-colors"
                                >
                                    kiryat-motzkin.muni.il
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="divider-soft mb-6" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[12.5px] text-[var(--ink-3)]">
                    <p>
                        © {currentYear} Motzkin Store · Built for the
                        <span className="text-[var(--ink-2)]"> City of Kiryat Motzkin</span>.
                    </p>
                    <div className="flex items-center gap-5">
                        <a href="/privacy" className="hover:text-[var(--ink-1)] transition-colors">Privacy policy</a>
                        <span className="text-[var(--line-strong)]">·</span>
                        <a href="/terms" className="hover:text-[var(--ink-1)] transition-colors">Terms of service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
