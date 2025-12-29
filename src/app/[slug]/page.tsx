import { Metadata } from "next";
import ServerPageClient from "./ServerPageClient";

type Props = {
  params: { slug: string };
};

// Функция получения данных на сервере для SEO
async function getServerData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/by-slug/${slug}`, {
      // Кэшируем данные, например, на 1 час (3600 сек) для скорости
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}

// ГЕНЕРАЦИЯ МЕТАДАННЫХ (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Ждем разрешения Promise params
  const { slug } = await params; 
  
  const server = await getServerData(slug);

  if (!server) {
    return { title: 'Сервер не найден | MinePromo' };
  }

  const title = `${server.serverName} - Мониторинг серверов Minecraft`;
  const description = server.description?.slice(0, 160) || `Играйте на сервере ${server.serverName}. Версия: ${server.gameVersion}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [server.imageUrl || '/server-placeholder.png'],
    },
    keywords: [server.serverName, 'minecraft server', server.gameVersion, server.gameType, ...(server.tags || [])],
  };
}

// 2. Обновляем основной компонент страницы
export default async function Page({ params }: Props) {
  // Ждем разрешения Promise params перед использованием
  const { slug } = await params; 
  
  const serverData = await getServerData(slug);

  if (!serverData) {
    return <div className="p-10 text-center">Сервер не найден</div>;
  }

  return <ServerPageClient slug={slug} initialData={serverData} />;
}