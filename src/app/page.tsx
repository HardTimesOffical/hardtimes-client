// app/page.tsx
import HomeClient from "./HomeClient"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HardTimes — Мониторинг серверов Майнкрафт и Хайтейл",
  description: "Рейтинг лучших серверов Minecraft и Hytale. Найди проект с живым онлайном, модами и активным сообществом на нашем форуме.",
};

export default function Page() {
  return (
    <>
      {/* Скрытый заголовок для поисковиков (H1 должен быть один на страницу) */}
      <h1 className="sr-only">
        HardTimes: Мониторинг серверов Майнкрафт, Хайтейл и база игрового контента
      </h1>
      
      <HomeClient />
      
      {/* SEO-блок внизу страницы, который виден роботам сразу */}
      <footer className="sr-only">
        <p>
          Добро пожаловать на HardTimes. Мы предоставляем актуальный список серверов Minecraft 
          всех версий. На нашем форуме вы найдете моды, плагины и текстуры.
        </p>
      </footer>
    </>
  );
}