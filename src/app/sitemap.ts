import { MetadataRoute } from 'next'

export const revalidate = 0; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hardmonitoring.ru'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/servers/java`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servers/bedrock`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servers/hytale`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
  ]

  let serverPages: MetadataRoute.Sitemap = []

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers`, {
      cache: 'no-store' 
    })

    if (res.ok) {
      const servers = await res.json()
      
      serverPages = servers.map((server: any) => ({
        url: `${baseUrl}/${server.slug}`,
        lastModified: server.updatedAt ? new Date(server.updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Sitemap generation error:', error)
  }

  return [...staticPages, ...serverPages]
}