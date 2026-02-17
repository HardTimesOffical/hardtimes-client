import { MetadataRoute } from 'next';
import { GAME_PLATFORMS } from '@/constants/project';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';

export const revalidate = 3600; // Кэшируем на час

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hardmonitoring.ru';
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // 1. Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/monitoring/servers/java`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/monitoring/servers/bedrock`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/monitoring/servers/hytale`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
  ];

  // 2. Категории контента (Генерация из констант)
  const contentCategoryPages: MetadataRoute.Sitemap = [];
  GAME_PLATFORMS.forEach((game) => {
    contentCategoryPages.push({
      url: `${baseUrl}/content/${game.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });

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

  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // --- ЗАГРУЗКА СЕРВЕРОВ ---
    const serversRes = await fetch(`${apiUrl}/servers?limit=1000`, { next: { revalidate: 3600 } });
    if (serversRes.ok) {
      const data = await serversRes.json();
      // Твой бэкенд шлет { items: [...] }, проверяем это:
      const servers = data.items || (Array.isArray(data) ? data : []);
      
      const serverUrls = servers.map((s: any) => ({
        url: `${baseUrl}/monitoring/${s.slug}`,
        lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }));
      dynamicPages = [...dynamicPages, ...serverUrls];
    }

    // --- ЗАГРУЗКА ПРОЕКТОВ ---
    const projectsRes = await fetch(`${apiUrl}/projects/all-slugs`, { next: { revalidate: 3600 } });
    if (projectsRes.ok) {
      const projects = await projectsRes.json();
      // Проверяем, массив это или объект с полем data
      const projectsList = Array.isArray(projects) ? projects : (projects.data || []);
      
      const projectUrls = projectsList.map((p: any) => ({
        url: `${baseUrl}/content/project/${p.slug}`, 
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
      dynamicPages = [...dynamicPages, ...projectUrls];
    }

    console.log(`[Sitemap] Успешно добавлено ${dynamicPages.length} динамических ссылок`);
  } catch (e) {
    console.error("[Sitemap] Ошибка при загрузке данных:", e);
  }

  return [...staticPages, ...contentCategoryPages, ...dynamicPages];
}