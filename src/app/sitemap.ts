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
    const [serversRes, projectsRes] = await Promise.all([
      fetch(`${apiUrl}/servers?limit=1000`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/projects/all-slugs`, { next: { revalidate: 3600 } })
    ]);

    if (!serversRes.ok || !projectsRes.ok) {
        throw new Error("Backend is unreachable");
    }

    const serversData = await serversRes.json();
    const projectsData = await projectsRes.json();

    const servers = serversData.items || (Array.isArray(serversData) ? serversData : []);
    const projects = Array.isArray(projectsData) ? projectsData : (projectsData.data || []);

    // ВАЖНАЯ ПРОВЕРКА: Если данных подозрительно мало или 0, а раньше было много
    if (servers.length === 0 && projects.length === 0) {
       console.warn("[Sitemap] Внимание: API вернуло 0 объектов. Отмена обновления.");
       // Возвращаем статику + категории, но в идеале здесь можно бросить ошибку, 
       // чтобы Next.js оставил старый файл (если он уже был сгенерирован)
    }

    const serverUrls = servers.map((s: any) => ({
      url: `${baseUrl}/monitoring/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    const projectUrls = projects.map((p: any) => ({
      url: `${baseUrl}/content/project/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    dynamicPages = [...serverUrls, ...projectUrls];

  } catch (e) {
    console.error("[Sitemap] Критическая ошибка загрузки. Сайтмап не обновлен:", e);
    // Если произошла ошибка, можно либо вернуть только статику, 
    // либо пробросить ошибку выше (throw e), тогда Next.js не перезапишет рабочий кэш.
    throw e; 
  }

  return [...staticPages, ...contentCategoryPages, ...dynamicPages];
}