import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://serverswamp.ru'

  // 1. Получаем список всех серверов из БД через API
  // Важно: здесь лучше запрашивать только slug и updatedAt, чтобы не грузить сеть
  let serverEntries: MetadataRoute.Sitemap = []
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers`, {
      next: { revalidate: 3600 } // Обновляем карту сайта раз в час
    })
    const servers = await res.json()

    serverEntries = servers.map((server: any) => ({
      url: `${baseUrl}/${server.slug}`,
      lastModified: server.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.8, // Страницы серверов имеют высокий приоритет
    }))
  } catch (error) {
    console.error('Sitemap error:', error)
  }

  // 2. Статические страницы (главная и т.д.)
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...serverEntries,
  ]
}