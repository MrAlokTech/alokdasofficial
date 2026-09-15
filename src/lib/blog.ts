import { BlogPost, BlogCategory } from "@/types/blog";
import { blogPosts } from "@/data/blog-posts";

/**
 * Calculates estimated reading time and word count from raw text or markdown.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadingTime(content: string): { minutes: number; words: number } {
  const cleanText = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks from word count
    .replace(/[#*`_~$$$$\\\[\]()]/g, " ") // Remove markdown formatting characters
    .trim();

  const words = cleanText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return { minutes, words };
}

function normalizePost(p: BlogPost): BlogPost {
  const { minutes, words } = calculateReadingTime(p.content);
  return {
    ...p,
    readingTimeMinutes: minutes,
    wordCount: words,
  };
}

/**
 * Blog Repository — Database-Ready Abstraction Layer.
 * In the future, these methods can query Supabase, Prisma, PostgreSQL, or MongoDB
 * without requiring ANY changes to the consumer pages or UI components.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  return [...blogPosts]
    .map(normalizePost)
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const post = blogPosts.find((p) => p.slug === slug || p.id === slug);
  return post ? normalizePost(post) : undefined;
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.featured);
}

export async function getPostsByCategory(category: BlogCategory): Promise<BlogPost[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.category === category);
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
}

export async function getAllCategories(): Promise<BlogCategory[]> {
  const all = await getAllPosts();
  const cats = new Set<BlogCategory>();
  all.forEach((p) => cats.add(p.category));
  return Array.from(cats);
}

export async function getAllTags(): Promise<string[]> {
  const all = await getAllPosts();
  const tags = new Set<string>();
  all.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}

export async function getRelatedPosts(currentSlug: string, limit = 2): Promise<BlogPost[]> {
  const all = await getAllPosts();
  const current = all.find((p) => p.slug === currentSlug);
  if (!current) return all.slice(0, limit);

  return all
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category, then overlapping tags
      let scoreA = a.category === current.category ? 2 : 0;
      let scoreB = b.category === current.category ? 2 : 0;
      scoreA += a.tags.filter((t) => current.tags.includes(t)).length;
      scoreB += b.tags.filter((t) => current.tags.includes(t)).length;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}
