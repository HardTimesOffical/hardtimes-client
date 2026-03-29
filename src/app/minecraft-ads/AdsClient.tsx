"use client";
import React from "react";
import { HiLightningBolt, HiCursorClick, HiChatAlt2 } from "react-icons/hi";

// Обновленный компонент карточки с увеличенным изображением
const AdCard = ({ title, price, features, icon: Icon, image }: any) => (
  <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/5 p-6 md:p-8 flex flex-col gap-8 hover:border-[#5a6e60]/30 transition-all group relative overflow-hidden shadow-2xl">
    {/* Зеленая полоса слева */}
    <div className="absolute top-0 left-0 w-1 h-full bg-[#5a6e60] opacity-60"></div>
    
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* ── БЛОК ИЗОБРАЖЕНИЯ (Увеличен) ── */}
      <div className="w-full lg:w-[45%] shrink-0 aspect-[16/10] bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-inner group-hover:border-[#5a6e60]/50 transition-colors">
          {/* Декоративные уголки */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#5a6e60]/30" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#5a6e60]/30" />
          
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          {/* Легкое затемнение поверх, которое уходит при наведении */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
      </div>

      {/* ── БЛОК ТЕКСТА ── */}
      <div className="flex-1 space-y-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#5a6e60]/10 border border-[#5a6e60]/20 text-[#5a6e60] shrink-0">
            <Icon className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{title}</h3>
        </div>
        
        <div className="space-y-2.5 text-zinc-300 text-sm font-mc-pixel leading-relaxed bg-black/20 p-4 border border-white/5">
          {features.map((f: string, i: number) => <p key={i}>• {f}</p>)}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-white/5">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block mb-1 tracking-widest">Стоимость</span>
            <span className="text-3xl font-black text-white tracking-tight">{price}</span>
          </div>

          <a 
            href="https://t.me/SakuraMFS" 
            target="_blank"
            className="px-10 py-4 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-[#5a6e60] hover:text-white transition-all active:scale-95 text-center shadow-[0_5px_20px_rgba(0,0,0,0.3)]"
          >
            Заказать рекламу
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default function AdsClient() {
  return (
    // ── ОБЕРТКА С ФОНОМ ──
    <div className="relative min-h-screen w-full" style={{ backgroundColor: '#0a0b0b' }}>
      
      {/* Фиксированное фоновое изображение */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: "url('https://i.pinimg.com/1200x/1c/86/12/1c86122cdfc9fac2b55523ee09b14ccb.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          filter: "saturate(0.5) brightness(0.4)" // Чуть темнее, чтобы карточки выделялись
        }} 
      />
      
      {/* Плавный градиент в темноту (Overlay) */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
        style={{ background: "linear-gradient(to bottom, transparent 0%, #0a0b0b 70%, #0a0b0b 100%)" }} 
      />

      {/* ── КОНТЕНТ (Поверх фона) ── */}
      <div className="relative z-10 max-w-6xl mx-auto py-20 md:py-28 px-4 space-y-16">
        
        {/* Хедер страницы */}
        <div className="text-center space-y-5 bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/5 p-8 shadow-xl">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white">Рекламные услуги</h1>
          <div className="w-20 h-1 bg-[#5a6e60] mx-auto"></div>
          <p className="max-w-2xl mx-auto text-zinc-400 text-sm uppercase font-mc-pixel leading-relaxed tracking-wide">
            Мы проверили разные способы рекламы и оставили только самые эффективные методы продвижения. 
            Ваш онлайн — наша приоритетная задача.
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid gap-10">
          <AdCard 
            title="Баннеры на сайте"
            icon={HiCursorClick}
            price="от 150 ₽ / день"
            image="/banner/adexmp-2.png" // Убедись, что путь верный
            features={[
              "Размещение в топе списка серверов",
              "Сквозное отображение на всех страницах",
              "HTML-баннер за 200₽ (если нет своего)",
              "Прямая ссылка на ваш проект"
            ]}
          />

          <AdCard 
            title="Сервер в Лаунчере"
            icon={HiLightningBolt}
            price="от 1200 ₽ / неделя"
            image="/banner/adexmp-1.png"
            features={[
              "Отображение в HardLauncher",
              "Самая высокая конверсия в игроков",
              "Скидка 15% при заказе на месяц",
              "Приоритетное место в списке"
            ]}
          />

          <AdCard 
            title="Telegram Продвижение"
            icon={HiChatAlt2}
            price="Индивидуально"
            image="/banner/adexmp-3.png"
            features={[
              "Рекламный пост в официальном чате",
              "Закреп сообщения и пуш-уведомление",
              "Живой охват целевой аудитории",
              "Помощь в составлении текста поста"
            ]}
          />
        </div>
        
        {/* Футер блока */}
        <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/5 p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#5a6e60] opacity-50"></div>
          <p className="text-zinc-300 text-base font-mc-pixel mb-6 uppercase tracking-wide">Есть индивидуальное предложение или хотите пакет услуг?</p>
          <a 
            href="https://t.me/SakuraMFS" 
            className="inline-block px-12 py-4 bg-[#5a6e60] text-white font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all shadow-lg"
          >
            Написать администратору
          </a>
        </div>
      </div>
    </div>
  );
}