import { MetadataRoute } from 'next';
import { GAME_PLATFORMS } from '@/constants/project';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';
import { GAME_VERSIONS } from '@/constants/gameVersions';
import { locales } from '@/middleware';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hardmonitoring.ru';
  const base2   = 'https://minecraftmonitoring-mc.ru';
  const apiUrl  = process.env.NEXT_PUBLIC_SERVER_URL;

  const toSlug = (v: string) => v.replace(/\./g, "-");
  const JAVA_VERSIONS    = GAME_VERSIONS["Minecraft Java"];
  const BEDROCK_VERSIONS = GAME_VERSIONS["Minecraft Bedrock"];

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                                    lastModified: new Date(), changeFrequency: 'daily',  priority: 1    },
    { url: `${baseUrl}/monitoring`,                    lastModified: new Date(), changeFrequency: 'hourly', priority: 0.95 },
    { url: `${baseUrl}/monitoring/servers/java`,       lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9  },
    { url: `${baseUrl}/monitoring/servers/bedrock`,    lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9  },
    { url: `${baseUrl}/monitoring/servers/hytale`,     lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8  },
    { url: `${baseUrl}/monitoring/servers/new`,        lastModified: new Date(), changeFrequency: 'hourly', priority: 0.85 },
    { url: `${baseUrl}/forum`,                         lastModified: new Date(), changeFrequency: 'hourly', priority: 0.85 },
    // Страницы по версиям Java — каждая версия отдельная SEO-страница
    ...JAVA_VERSIONS.map(v => ({
      url: `${baseUrl}/monitoring/servers/java/${toSlug(v)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    // Страницы по версиям Bedrock
    ...BEDROCK_VERSIONS.map(v => ({
      url: `${baseUrl}/monitoring/servers/bedrock/${toSlug(v)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.75,
    })),
  ];

  // ── 2. Второй домен — зеркало ключевых страниц ───────────────
  // canonical в metadata каждой страницы указывает на hardmonitoring.ru —
  // Яндекс считает его главным, minecraftmonitoring-mc.ru приносит
  // дополнительный трафик по схожим запросам.
  const mirrorPages: MetadataRoute.Sitemap = [
    { url: base2,                                   lastModified: new Date(), changeFrequency: 'daily',  priority: 0.8  },
    { url: `${base2}/monitoring`,                   lastModified: new Date(), changeFrequency: 'hourly', priority: 0.75 },
    { url: `${base2}/monitoring/servers/java`,      lastModified: new Date(), changeFrequency: 'hourly', priority: 0.75 },
    { url: `${base2}/monitoring/servers/bedrock`,   lastModified: new Date(), changeFrequency: 'hourly', priority: 0.75 },
    { url: `${base2}/forum`,                        lastModified: new Date(), changeFrequency: 'hourly', priority: 0.7  },
  ];

  // ── 3. Лаунчер (все языки, оба домена) ───────────────────────
  const launcherPages: MetadataRoute.Sitemap = [
    ...locales.map((lang) => ({
      url: `${baseUrl}/${lang}/launcher`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/launcher`])),
      },
    })),
    ...locales.map((lang) => ({
      url: `${base2}/${lang}/launcher`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];

  // ── 4. Категории контента ─────────────────────────────────────
  const contentPages: MetadataRoute.Sitemap = [];
  GAME_PLATFORMS.forEach((game) => {
    contentPages.push({ url: `${baseUrl}/content/${game.id}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 });
    (PROJECT_TYPES_BY_GAME[game.id as keyof typeof PROJECT_TYPES_BY_GAME] || []).forEach((type) => {
      contentPages.push({ url: `${baseUrl}/content/${game.id}/${type.value}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 });
    });
  });

  // ── 5. Динамические страницы ──────────────────────────────────
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const [serversRes, projectsRes, forumRes] = await Promise.all([
      fetch(`${apiUrl}/servers?limit=1000`,      { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/projects/all-slugs`,       { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/forum/posts?limit=1000`,   { next: { revalidate: 3600 } }),
    ]);

    if (!serversRes.ok || !projectsRes.ok) throw new Error('Backend unreachable');

    const serversData  = await serversRes.json();
    const projectsData = await projectsRes.json();

    const servers  = serversData.items  || (Array.isArray(serversData)  ? serversData  : []);
    const projects = Array.isArray(projectsData) ? projectsData : (projectsData.data || []);

    if (servers.length === 0 && projects.length === 0) {
      console.warn('[Sitemap] API вернуло 0 объектов.');
    }

    const serverUrls: MetadataRoute.Sitemap = servers.map((s: any) => ({
      url: `${baseUrl}/monitoring/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    const projectUrls: MetadataRoute.Sitemap = projects.map((p: any) => ({
      url: `${baseUrl}/content/project/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    let forumUrls: MetadataRoute.Sitemap = [];
    if (forumRes.ok) {
      const forumData = await forumRes.json();
      forumUrls = (forumData.posts || []).map((p: any) => ({
        url: `${baseUrl}/forum/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      }));
    }

    dynamicPages = [...serverUrls, ...projectUrls, ...forumUrls];
  } catch (e) {
    console.warn('[Sitemap] Бэкенд недоступен при билде:', e);
  }

  return [
    ...staticPages,
    ...mirrorPages,
    ...launcherPages,
    ...contentPages,
    ...dynamicPages,
  ];
}