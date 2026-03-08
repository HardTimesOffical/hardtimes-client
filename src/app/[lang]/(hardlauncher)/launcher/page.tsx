// app/[lang]/launcher/page.tsx
// ✅ Server Component — async, no 'use client'
// URLs: /ru/launcher, /en/launcher, /de/launcher ...

import { Metadata } from 'next';
import LauncherClient from './LauncherClient';

// ─── Supported locales (add more as you create dictionary files) ──
export const SUPPORTED_LOCALES = ['ru', 'en'];

// ─── Dictionary loader ────────────────────────────────────────────
async function getDictionary(lang: string) {
  const locale = SUPPORTED_LOCALES.includes(lang) ? lang : 'ru';
  try {
    const mod = await import(`@/dictionaries/${locale}.json`);
    return mod.default.launcher;
  } catch {
    const fallback = await import('@/dictionaries/ru.json');
    return fallback.default.launcher;
  }
}

// ─── generateStaticParams ─────────────────────────────────────────
// Tells Next.js to pre-render /ru/launcher, /en/launcher etc.
// Each locale gets its own static HTML → indexable by search engines
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

// ─── generateMetadata ─────────────────────────────────────────────
// Per-locale <title>, <meta description>, hreflang alternates
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title:
      lang === 'ru'
        ? 'HardLauncher — Лаунчер Minecraft для анархи-серверов'
        : 'HardLauncher — Minecraft Launcher for Anarchy Servers',
    description: dict.hero.subtitle,
    alternates: {
      // hreflang links — tells Google which page is for which language
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/launcher`])
      ),
      canonical: `/${lang}/launcher`,
    },
    openGraph: {
      title: 'HardLauncher',
      description: dict.hero.subtitle,
      locale: lang === 'ru' ? 'ru_RU' : 'en_US',
    },
  };
}

// ─── Page (Server Component) ──────────────────────────────────────
export default async function LauncherPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <LauncherClient dict={dict} lang={lang} />;
}
