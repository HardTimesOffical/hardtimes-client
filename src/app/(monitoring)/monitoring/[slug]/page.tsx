import { Metadata } from "next";
import ServerPageClient from "./ServerPageClient";

type Props = {
  params: Promise<{ slug: string }>; // В Next.js 15+ это Promise
};

async function getServerData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/by-slug/${slug}`, {
      next: { revalidate: 60 } // Для SEO лучше небольшой кэш, чем no-store
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; 
  const server = await getServerData(slug);

  if (!server) {
    return { title: 'Сервер не найден | MinecraftMonitoring' };
  }

  // Яндекс любит конкретику: Название + Версия + Режим
  const title = `${server.serverName} — IP адрес, мониторинг и отзывы Майнкрафт ${server.gameVersion}`;
  
  // Описание с призывом к действию (CTR)
  const description = `Игровой сервер Майнкрафт ${server.serverName}. ⚡ IP: ${server.ipAddress?.address || 'указан на странице'}. Версия ${server.gameVersion}, режим: ${server.gameType || 'Выживание'}. ${server.description?.slice(0, 100)}...`;

  const baseUrl = 'https://minecraftmonitoring-mc.ru';

  return {
    title,
    description,
    alternates: {
      // Склеиваем домены: всегда указываем новый домен как каноничный
      canonical: `${baseUrl}/monitoring/${slug}`,
    },
    keywords: [
      `сервер ${server.serverName}`,
      `мониторинг ${server.serverName}`,
      `айпи сервера ${server.serverName}`,
      'майнкрафт сервера',
      server.gameVersion,
      ...(server.tags || [])
    ],
    openGraph: {
      title,
      description,
      url: `${baseUrl}/monitoring/${slug}`,
      siteName: 'MinecraftMonitoring',
      images: [{ url: server.imageUrl || '/server-placeholder.png', width: 1200, height: 630 }],
      type: 'website',
    },
    // Теги для индексации
    robots: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params; 
  const serverData = await getServerData(slug);

  if (!serverData) {
    return (
      <div className="p-10 text-center bg-[#0a0b0b] text-zinc-500 uppercase font-bold tracking-widest pt-40 min-h-screen">
        [ Системная ошибка: Сервер не найден ]
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GameServer",
    "name": serverData.serverName,
    "description": serverData.description,
    "image": serverData.imageUrl,
    "game": "Minecraft",
    "serverStatus": serverData.status?.online ? "https://schema.org/OnlineFull" : "https://schema.org/OfflinePermanently",
    "playersOnline": serverData.status?.players || 0,
    "identifier": serverData.ipAddress?.address,
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: '#0a0b0b' }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── ФОНОВОЕ ИЗОБРАЖЕНИЕ (Fixed) ── */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: "url('https://i.pinimg.com/1200x/1c/86/12/1c86122cdfc9fac2b55523ee09b14ccb.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          filter: "saturate(0.4) brightness(0.4)" 
        }} 
      />
      
      {/* Градиент в темноту */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{ background: "linear-gradient(to bottom, transparent 0%, #0a0b0b 80%, #0a0b0b 100%)" }} 
      />

      {/* ── КОНТЕНТ ── */}
      <div className="relative z-10">
        <ServerPageClient slug={slug} initialData={serverData} />
      </div>
    </div>
  );
}