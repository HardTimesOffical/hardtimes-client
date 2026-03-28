'use client';
import Link from "next/link";
import { HiOutlineFire, HiOutlineCube, HiArrowRight } from "react-icons/hi2";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const MC_GREEN       = '#5aac44';
const MC_GREEN_DARK  = '#3c8527';
const MC_ORANGE      = '#f97316';
const MC_ORANGE_DARK = '#c2570f';
const MC_AMBER       = '#eab308';

const CARDS = [
  {
    href: '/monitoring',
    title: 'Рейтинг серверов Майнкрафт',
    heading: 'Мониторинг\nСерверов',
    desc: 'Актуальный рейтинг лучших игровых серверов. Продвигай свой проект или найди сервер с живым онлайном.',
    cta: 'Смотреть список',
    Icon: HiOutlineFire,
    accent: MC_GREEN,
    accentDark: MC_GREEN_DARK,
    glow: 'rgba(90,172,68,0.15)',
    tag: 'Серверы',
    img: 'https://i.pinimg.com/736x/a3/aa/a1/a3aaa1843014edfea417cc8fa1c9058b.jpg',
  },
  {
    href: '/forum',
    title: 'Форум игроков HardTimes',
    heading: 'Игровой\nФорум',
    desc: 'Сообщество HardTimes: обсуждай новости, ищи команду и делись гайдами по Minecraft и Hytale.',
    cta: 'К обсуждениям',
    Icon: HiOutlineChatBubbleLeftRight,
    accent: MC_ORANGE,
    accentDark: MC_ORANGE_DARK,
    glow: 'rgba(249,115,22,0.15)',
    tag: 'Форум',
    img: 'https://i.pinimg.com/736x/ee/71/cc/ee71cc8aaa5a29ed3e0ebf0d931c4192.jpg',
  },
  {
    href: '/content',
    title: 'Скачать моды и текстуры',
    heading: 'База\nКонтента',
    desc: 'Огромная библиотека: готовые сборки, уникальные моды, шейдеры и текстуры для твоего клиента.',
    cta: 'В каталог модов',
    Icon: HiOutlineCube,
    accent: MC_AMBER,
    accentDark: '#a16207',
    glow: 'rgba(234,179,8,0.13)',
    tag: 'Контент',
    img: 'https://cdnb.artstation.com/p/assets/images/images/018/843/029/original/brendan-sullivan-minecraftdungeonsfanart-500.gif?1560943169',
  },
];

const BANNERS = [
  {
    href: '/ru/launcher',
    label: 'HardLauncher',
    sub: 'Скачать бесплатно',
    desc: 'Быстрый лаунчер с авто-обновлением и поддержкой модов.',
    accent: MC_GREEN,
    accentDark: MC_GREEN_DARK,
    img: 'https://www.minecraft.net/content/dam/games/minecraft/key-art/MC_Vanilla_PMP_Keyart_1280x720.jpg',
  },
  {
    href: '/monitoring/servers/java',
    label: 'Java Edition',
    sub: 'Серверы Java',
    desc: 'Сотни Java-серверов с онлайном, модами и уникальными режимами.',
    accent: MC_ORANGE,
    accentDark: MC_ORANGE_DARK,
    img: 'https://i.pinimg.com/736x/8f/76/79/8f7679614d8a2b6b5f2d8a99f74c7f57.jpg',
  },
  {
    href: '/content/minecraft/mods',
    label: 'Моды',
    sub: 'Каталог модов',
    desc: 'Forge, Fabric, NeoForge — все популярные моды для любой версии.',
    accent: MC_AMBER,
    accentDark: '#a16207',
    img: 'https://i.pinimg.com/736x/71/04/d8/7104d8ab700c6a328377b5fd9fcefaaa.jpg',
  },
  {
    href: '/monitoring/servers/bedrock',
    label: 'Bedrock',
    sub: 'Серверы Bedrock',
    desc: 'Играй с мобильными и консольными игроками на Bedrock-серверах.',
    accent: MC_GREEN,
    accentDark: MC_GREEN_DARK,
    img: 'https://cdna.artstation.com/p/assets/images/images/014/719/504/large/meghan-hetrick-minecraft-final-a.jpg?1545159026',
  },
];

// Пиксельный разделитель секций
const PixelDivider = ({ colors }: { colors: string[] }) => (
  <div className="flex justify-center mt-3 gap-px">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="w-3 h-[3px]" style={{ background: colors[i % colors.length] }} />
    ))}
  </div>
);

export default function Home() {
  return (
    <div className="flex flex-col bg-background text-foreground min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ height: 'clamp(360px, 60vh, 700px)' }}>
        <img
          src="https://i.pinimg.com/webp/1200x/f7/f3/8f/f7f38f14c444548b8d2f780d28eff584.webp"
          alt="Minecraft landscape"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'saturate(0.8) brightness(0.42)' }}
        />
        {/* Плавный переход в фон */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 80%, var(--background) 100%)',
        }} />
        {/* Сканлайны */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 4px)',
        }} />

        {/* Контент */}
        <div className="absolute inset-0 flex flex-col items-start justify-end px-6 md:px-14 pb-12 md:pb-16">
          <div className="max-w-lg">
            {/* Большой заголовок — font-mc-title максимальный */}
            <h1 className="font-mc-pixel leading-[1.0] mb-5"
              style={{
                fontSize: 'clamp(30px, 6vw, 30px)',
                color: '#fff',
              }}>
              HardMonitoring
            </h1>

            <p className="font-standard text-[14px] md:text-[15px] mb-7 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px' }}>
              Мониторинг серверов, моды и живое сообщество для игроков Minecraft.
            </p>

            <div className="flex flex-wrap gap-2">
              <Link href="/monitoring"
                className="inline-flex items-center gap-2 px-5 py-2.5 font-standard font-bold text-[13px] text-white no-underline transition-all hover:brightness-110 active:scale-95"
                style={{
                  background: MC_GREEN_DARK,
                  boxShadow: `inset 1px 1px 0 ${MC_GREEN}, inset -1px -1px 0 #2a5e1a, 0 2px 0 #2a5e1a`,
                }}>
                Найти сервер <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/ru/launcher"
                className="inline-flex items-center gap-2 px-5 py-2.5 font-standard font-semibold text-[13px] no-underline transition-all hover:brightness-110 active:scale-95 border border-border"
                style={{ color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.06)' }}>
                Скачать лаунчер
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── ОСНОВНОЙ КОНТЕНТ ───────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-4 md:px-8 pb-20">

        {/* Заголовок секции карточек */}
        <div className="w-full max-w-[1100px] mt-10 mb-5 text-center">
          {/* Средний заголовок — font-mc-title меньшего размера */}
          <h2 className="font-mc-title"
            style={{ fontSize: 'clamp(16px, 2.2vw, 24px)', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
            Разделы сайта
          </h2>
        </div>

        {/* Три основные карточки */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-[1100px]">
          {CARDS.map(({ href, title, heading, desc, cta, accent, accentDark, glow, tag, img }) => (
            <article key={href}>
              <Link href={href} title={title}
                className="group flex flex-col h-full bg-card border-2 border-border overflow-hidden no-underline transition-all duration-200"
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = accentDark;
                  el.style.boxShadow = `0 0 0 1px ${accentDark}, 0 6px 20px ${glow}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '';
                  el.style.boxShadow = '';
                }}
              >
                {/* Картинка */}
                <div className="relative overflow-hidden" style={{ height: '180px' }}>
                  <img src={img} alt={heading.replace('\n', ' ')}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    style={{ filter: 'saturate(0.55) brightness(0.48)' }} />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to bottom, transparent 65%, var(--card) 100%)',
                  }} />
                  <span className="absolute top-2.5 left-2.5 font-mc-pixel text-[8px] uppercase tracking-widest px-2 py-0.5 text-white"
                    style={{ background: accentDark }}>
                    {tag}
                  </span>
                </div>

                <div className="flex flex-col flex-1 px-5 pt-2 pb-5">

                  {/* Средний заголовок карточки */}
                  <h3 className="font-mc-pixel whitespace-pre-line leading-snug mb-2"
                    style={{ fontSize: 'clamp(12px, 1.3vw, 15px)', textShadow: '2px 2px 0 rgba(0,0,0,0.25)' }}>
                    {heading}
                  </h3>

                  <p className="font-standard text-[12px] text-muted leading-relaxed flex-1 mb-4">
                    {desc}
                  </p>

                  <div className="flex items-center gap-1.5 font-standard font-bold text-[12px] transition-all duration-200 group-hover:gap-2.5"
                    style={{ color: accent }}>
                    {cta} <HiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>

        {/* Заголовок баннерной сетки */}
        <div className="w-full max-w-[1100px] mt-14 mb-5 text-center">
          <h2 className="font-mc-title"
            style={{ fontSize: 'clamp(16px, 2.2vw, 24px)', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
            Популярные разделы
          </h2>
        </div>

        {/* Баннерная сетка 4 в ряд */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-[1100px]">
          {BANNERS.map(({ href, label, sub, desc, accent, accentDark, img }) => (
            <Link key={href} href={href}
              className="group relative overflow-hidden border-2 border-border bg-card no-underline transition-all duration-200 flex flex-col"
              style={{ minHeight: '200px' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = accentDark; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ''; }}
            >
              {/* Фото */}
              <div className="absolute inset-0">
                <img src={img} alt={label}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  style={{ filter: 'saturate(0.5) brightness(0.38)' }} />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.88) 45%, transparent 100%)',
                }} />
              </div>

              {/* Контент */}
              <div className="relative mt-auto p-4">
                <p className="font-mc-pixel text-[8px] uppercase tracking-widest mb-1" style={{ color: accent }}>
                  {sub}
                </p>
                <h3 className="font-mc-pixel text-white leading-tight mb-1.5"
                  style={{ fontSize: 'clamp(11px, 1.2vw, 14px)', textShadow: '2px 2px 0 rgba(0,0,0,0.6)' }}>
                  {label}
                </h3>
                <p className="font-standard text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {desc}
                </p>
                <div className="flex items-center gap-1 mt-3 font-standard font-bold text-[11px] transition-all duration-200 group-hover:gap-2"
                  style={{ color: accent }}>
                  Перейти <HiArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Линия снизу */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: accent }} />
            </Link>
          ))}
        </section>

        {/* Быстрые ссылки-теги */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
          {[
            { href: '/monitoring/servers/java',    label: 'Java серверы',    color: MC_GREEN },
            { href: '/monitoring/servers/bedrock', label: 'Bedrock серверы', color: MC_GREEN },
            { href: '/content/minecraft/mods',     label: 'Моды',            color: MC_ORANGE },
            { href: '/content/minecraft/shaders',  label: 'Шейдеры',         color: MC_ORANGE },
            { href: '/content/hytale',             label: 'Hytale',          color: MC_AMBER },
            { href: '/ru/launcher',                label: 'Лаунчер',         color: MC_AMBER },
          ].map(({ href, label, color }) => (
            <Link key={href} href={href}
              className="font-standard font-semibold text-[12px] text-muted border border-border px-3 py-1.5 no-underline transition-all duration-150"
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = color; el.style.color = color; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = ''; el.style.color = ''; }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* SEO (скрытый) */}
        <section className="sr-only">
          <h2>HardTimes — Лучший мониторинг серверов для игры Майнкрафт и Хайтел в России</h2>
          <p>Мы собираем IP адреса серверов Майнкрафт, помогаем игрокам найти сервера с модами или мини-играми и без лагов.</p>
        </section>
      </main>
    </div>
  );
}