import { Metadata } from 'next';
import ProjectClient from "./ProjectClient"

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. ГЕНЕРАЦИЯ МЕТАДАННЫХ (Для роботов)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects/${slug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) return { title: 'Проект не найден | HardMonitoring' };
    const project = await res.json();

    const plainDesc = project.description?.replace(/<[^>]*>?/gm, '').substring(0, 160).trim();
    const title = `${project.title} — Скачать ${project.projectType} для ${project.gameType}`;

    return {
      title,
      description: plainDesc || `Скачать проект ${project.title} на HardMonitoring`,
      alternates: { canonical: `https://minecraftmonitoring-mc.ru/content/project/${slug}` },
      openGraph: {
        title,
        description: plainDesc,
        images: project.iconUrl ? [{ url: project.iconUrl }] : [],
      }
    };
  } catch (e) {
    return { title: 'Проект | HardMonitoring' };
  }
}

// 2. САМА СТРАНИЦА (Для пользователей)
export default async function Page({ params }: Props) {
  const { slug } = await params;

  let project = null;

  try {
    // Получаем данные еще раз для рендера страницы
    // Next.js автоматически оптимизирует двойной запрос (deduplication)
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects/${slug}`, {
      cache: 'no-store' // Или используйте revalidate
    });
    
    if (res.ok) {
      project = await res.json();
    }
  } catch (e) {
    console.error("Error loading project data:", e);
  }

  // Теперь переменная 'project' существует и её можно передать
  return <ProjectClient initialData={project} />;
}