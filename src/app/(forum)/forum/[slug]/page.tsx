import { Metadata } from "next";
import { Suspense } from "react";
import PostClient from "./PostClient";
import Footer from "@/app/components/footer/footer";

const API = process.env.NEXT_PUBLIC_SERVER_URL;
const BASE = "https://minecraftmonitoring-mc.ru";

// ── Динамические метаданные для каждого поста ────────────────────
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const res  = await fetch(`${API}/forum/posts/${params.slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Post not found");

    const post = await res.json();

    // Чистый текст из HTML контента — для description
    const plainText = post.content
      ? post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 155)
      : '';

    const title       = post.title || "Тема на форуме Майнкрафт";
    const category    = post.category || "Форум";
    const author      = post.author?.username || "Игрок";
    const description = plainText
      || `${title} — обсуждение на форуме мониторинга серверов Майнкрафт. Раздел: ${category}.`;

    return {
      title: `${title} | Форум мониторинга серверов Майнкрафт`,
      description,
      keywords: [
        "форум майнкрафт",
        "форум мониторинг серверов майнкрафт",
        category.toLowerCase(),
        title.toLowerCase(),
        "обсуждение серверов minecraft",
        "форум minecraft серверов",
      ],
      alternates: {
        canonical: `${BASE}/forum/${params.slug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: `${title} | Форум серверов Майнкрафт`,
        description,
        url: `${BASE}/forum/${params.slug}`,
        siteName: "Мониторинг серверов Майнкрафт",
        locale: "ru_RU",
        type: "article",
        authors: [author],
        publishedTime: post.createdAt,
        modifiedTime:  post.updatedAt,
        images: post.author?.avatar
          ? [{ url: post.author.avatar, width: 400, height: 400, alt: author }]
          : [{ url: `${BASE}/og-forum.jpg`, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary",
        title: `${title} | Форум серверов Майнкрафт`,
        description,
      },
    };
  } catch {
    return {
      title: "Тема | Форум мониторинга серверов Майнкрафт",
      description: "Обсуждение на форуме мониторинга серверов Майнкрафт.",
    };
  }
}

// ── JSON-LD для конкретного поста ────────────────────────────────
async function getPostJsonLd(slug: string) {
  try {
    const res  = await fetch(`${API}/forum/posts/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const post = await res.json();

    return {
      "@context": "https://schema.org",
      "@type": "DiscussionForumPosting",
      "headline": post.title,
      "url": `${BASE}/forum/${slug}`,
      "datePublished": post.createdAt,
      "dateModified": post.updatedAt || post.createdAt,
      "inLanguage": "ru",
      "author": {
        "@type": "Person",
        "name": post.author?.username || "Аноним",
      },
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/LikeAction",
          "userInteractionCount": post.likes?.length || 0,
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/ViewAction",
          "userInteractionCount": post.views || 0,
        },
      ],
      "isPartOf": {
        "@type": "WebSite",
        "name": "Мониторинг серверов Майнкрафт",
        "url": BASE,
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Мониторинг серверов",   "item": BASE },
          { "@type": "ListItem", "position": 2, "name": "Форум Майнкрафт",        "item": `${BASE}/forum` },
          { "@type": "ListItem", "position": 3, "name": post.title,               "item": `${BASE}/forum/${slug}` },
        ],
      },
    };
  } catch { return null; }
}

// ── generateStaticParams — пре-рендер популярных постов ──────────
// Next.js отрендерит эти страницы статически при билде.
// Остальные посты будут рендериться on-demand (ISR revalidate: 3600).
export async function generateStaticParams() {
  try {
    const res  = await fetch(`${API}/forum/posts?limit=200&sort=popular`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.posts || []).map((p: any) => ({ slug: p.slug }));
  } catch { return []; }
}

// Страница рендерится заново не чаще раза в час
export const revalidate = 3600;

// ── Page ─────────────────────────────────────────────────────────
export default async function ForumPostPage(
  { params }: { params: { slug: string } }
) {
  const jsonLd = await getPostJsonLd(params.slug);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="font-mc-pixel text-[10px] text-muted uppercase tracking-widest animate-pulse">
            Загрузка…
          </span>
        </div>
      }>
        <PostClient />
      </Suspense>
    </>
  );
}