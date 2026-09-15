export type BlogCategory =
  | "Chemistry"
  | "Research"
  | "Software"
  | "Laboratory"
  | "Methodology";

export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
  url?: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  author: BlogAuthor;
  readingTimeMinutes: number;
  wordCount: number;
  featured?: boolean;
  coverImage?: string;
  takeaways: string[];
  faqs?: BlogFaq[];
  relatedProjectSlug?: string;
  relatedProjectTitle?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}
