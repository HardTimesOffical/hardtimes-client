import { MetadataRoute } from 'next';
import { GAME_PLATFORMS } from '@/constants/project';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hardmonitoring.ru';

  // 1. Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/monitoring/servers/java`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/monitoring/servers/bedrock`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/monitoring/servers/hytale`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
  ];

  // 2. Динамические категории КОНТЕНТА из PROJECT_TYPES_BY_GAME
  const contentCategoryPages: MetadataRoute.Sitemap = [];

  GAME_PLATFORMS.forEach((game) => {
    // Страница всей игры (напр. /content/minecraft)
    contentCategoryPages.push({
      url: `${baseUrl}/content/${game.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });

    // Получаем типы конкретно для этой игры (mods, plugins и т.д.)
    const gameTypes = PROJECT_TYPES_BY_GAME[game.id as keyof typeof PROJECT_TYPES_BY_GAME] || [];
    
    gameTypes.forEach((type) => {
      contentCategoryPages.push({
        url: `${baseUrl}/content/${game.id}/${type.value}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.6,
      });
    });
  });

  // 3. Загрузка серверов и конкретных проектов из БД
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // Получаем серверы
    const serversRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers`);
    if (serversRes.ok) {
      const servers = await serversRes.json();
      const serverUrls = servers.map((s: any) => ({
        url: `${baseUrl}/monitoring/${s.slug}`,
        lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }));
      dynamicPages = [...dynamicPages, ...serverUrls];
    }

    // Получаем конкретные моды/плагины (если есть эндпоинт)
    const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects/all-slugs`);
    if (projectsRes.ok) {
      const projects = await projectsRes.json();
      const projectUrls = projects.map((p: any) => ({
        // Используем ПРЯМОЙ путь к проекту, а не через категории
        url: `${baseUrl}/content/project/${p.slug}`, 
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
      dynamicPages = [...dynamicPages, ...projectUrls];
    }
  } catch (e) {
    console.error("Sitemap dynamic fetch error:", e);
  }

  return [...staticPages, ...contentCategoryPages, ...dynamicPages];
}