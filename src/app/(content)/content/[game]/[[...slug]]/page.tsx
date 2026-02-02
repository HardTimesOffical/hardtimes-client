import { Metadata } from 'next';
import { GAME_PLATFORMS, getGameLabel } from '@/constants/project';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes'; 
import GameContentPage from './GameContentPage';
import axios from 'axios';

type Props = {
  params: Promise<{ game: string; slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

interface ProjectTypeEntry {
  label: string;
  value: string;
}

// 1. Умная генерация мета-тегов (Майнкрафт-специфика)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, slug } = await params;
  const typeValue = slug?.[0];

  const gameLabel = getGameLabel(game);
  const gameKey = game as keyof typeof PROJECT_TYPES_BY_GAME;
  const gameTypes = (PROJECT_TYPES_BY_GAME[gameKey] || []) as ProjectTypeEntry[];
  const currentType = gameTypes.find((t) => t.value === typeValue);

  const versions = "1.21, 1.20.1, 1.16.5, 1.12.2";
  const ruNames: Record<string, string> = {
    minecraft: 'Майнкрафт',
    hytale: 'Хайтейл'
  };
  const gameNameRu = ruNames[game] || gameLabel;

  if (currentType) {
    const title = `${currentType.label} для ${gameLabel} (${versions}) — Скачать актуальное`;
    const description = `Огромный выбор ${currentType.label.toLowerCase()} для ${gameLabel}. От глобальных техно-магических проектов до легких ванильных улучшений и оптимизации ФПС. Все файлы проверены на стабильность для версий ${versions}. Обзоры механик, скриншоты и пошаговые инструкции на HardMonitoring.`;

    return {
      title,
      description,
      alternates: { canonical: `https://hardmonitoring.ru/content/${game}/${typeValue}` },
      openGraph: {
        title,
        description,
        url: `https://hardmonitoring.ru/content/${game}/${typeValue}`,
        siteName: 'HardMonitoring',
        locale: 'ru_RU',
        type: 'website',
      }
    };
  }

  const title = `Все для ${gameLabel} (${gameNameRu}): моды, сборки, текстуры и шейдеры`;
  const description = `Ежедневно обновляемый архив контента для ${gameLabel}. Скачивайте популярные сборки, оптимизированные шейдеры и полезные плагины для ${gameLabel}. Только проверенные дополнения с гарантией безопасности на HardMonitoring.`;

  return {
    title,
    description,
    alternates: { canonical: `https://hardmonitoring.ru/content/${game}` },
  };
}

// 2. Рендеринг страницы
export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const { game, slug } = resolvedParams;
  const resolvedSearchParams = await searchParams;
  
  const currentType = slug?.[0] || 'all';
  // ИСПРАВЛЕНО: Добавляем определение gameLabel здесь
  const gameLabel = getGameLabel(game);

  let initialData = { projects: [], pagination: { total: 0 } };
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects`, {
      params: {
        game,
        type: currentType,
        ...resolvedSearchParams
      }
    });
    initialData = data;
  } catch (e) {
    console.error("Fetch error on server-side:", e);
  }

  const gameKey = game as keyof typeof PROJECT_TYPES_BY_GAME;
  const gameTypes = (PROJECT_TYPES_BY_GAME[gameKey] || []) as ProjectTypeEntry[];
  const typeLabel = gameTypes.find(t => t.value === currentType)?.label || 'Контент';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${typeLabel} для ${gameLabel}`,
    "description": `Список доступных ${typeLabel.toLowerCase()} для игры ${gameLabel}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": initialData.projects.length,
      "itemListElement": initialData.projects.map((p: { slug: string }, i: number) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://hardmonitoring.ru/content/${game}/${currentType}/${p.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GameContentPage 
        initialProjects={initialData.projects} 
        initialTotal={initialData.pagination.total}
        params={resolvedParams}
      />
    </>
  );
}