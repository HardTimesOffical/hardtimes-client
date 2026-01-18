import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[480px] flex flex-col items-center pt-28 pb-16 px-6 overflow-hidden">
      {/* 1. Фоновый слой с фото */}
      <div 
        className="absolute inset-0 z-0 scale-105" // Легкий scale предотвращает белые края
        style={{ 
          backgroundImage: 'url("/icons/header.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* 2. Наложение градиента для читаемости текста */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/47 via-black/10 to-transparent" />

      {/* 3. Контентная область */}
      <div className="relative z-10 max-w-[1200px] w-full flex flex-col items-start gap-5">
        
        {/* Бейдж над заголовком */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-white/80 text-xs font-medium tracking-wider uppercase">
          Лучший мониторинг
        </div>

        <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
          Мониторинг серверов <span className="text-orange-400">Майнкрафт</span>
        </h1>
        
        <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl font-light">
          С помощью HardTime игроки могут легко найти и выбрать сервер по различным критериям: 
          популярности, режимам игры или версии. Мы предоставляем актуальную статистику и честные рейтинги.
        </p>

        {/* Кнопки */}
        <div className="flex flex-wrap gap-4 mt-2">
          <Link href="/shop" className="bg-white text-orange-600 px-7 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all shadow-lg">
             <img src="/icons/promote.svg" className="w-5 h-5" alt=""/>
             Раскрутить сервер
          </Link>
          <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-7 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all">
             Помощь
          </button>
        </div>

{/* Карточки статистики */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 w-full">
  {[
    { 
      label: 'Серверов онлайн', 
      value: '346', 
      iconPath: '/icons/bow.svg' // Укажи свой путь
    },
    { 
      label: 'Игроков онлайн', 
      value: '43K+', 
      iconPath: '/icons/crown.svg' // Укажи свой путь
    },
    { 
      label: 'Верных пользователей', 
      value: '12K+', 
      iconPath: '/icons/leader.svg' // Укажи свой путь
    }
  ].map((item, idx) => (
    <div 
      key={idx} 
      className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex flex-col gap-3 hover:bg-white/10 transition-colors group"
    >
      <div className="flex items-center gap-3">
        {/* Иконка */}
        <img 
          src={item.iconPath} 
          alt={item.label} 
          className="w-8 h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
        />
        
        {/* Числовое значение */}
        <div className="text-white text-2xl font-black tabular-nums tracking-tight">
          {item.value}
        </div>
      </div>

      {/* Описание */}
      <p className="text-white/40 text-[11px] uppercase font-bold tracking-widest leading-none">
        {item.label}
      </p>
    </div>
  ))}
</div>

      </div>
    </section>
  );
}