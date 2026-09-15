import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { ArticleContent } from "@/components/blog/article-content";
import { ShareButton } from "@/components/blog/share-button";
import {
  Clock,
  Calendar,
  ChevronLeft,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  FlaskConical,
  FileText,
} from "lucide-react";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Article Not Found | Alok Das",
    };
  }

  const url = `https://alokdasofficial.in/blog/${post.slug}`;

  return {
    title: `${post.title} | Alok Das`,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug, 2);
  const pageUrl = `https://alokdasofficial.in/blog/${post.slug}`;

  // Structured Data (BlogPosting & BreadcrumbList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        url: pageUrl,
        articleSection: post.category,
        keywords: post.tags.join(", "),
        timeRequired: `PT${post.readingTimeMinutes}M`,
        wordCount: post.wordCount,
        author: {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.role,
          url: post.author.url,
        },
        publisher: {
          "@type": "Person",
          name: "Alok Das",
          url: "https://alokdasofficial.in",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://alokdasofficial.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://alokdasofficial.in/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: pageUrl,
          },
        ],
      },
      ...(post.faqs
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-10">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to all articles</span>
            </Link>
            <ShareButton title={post.title} url={pageUrl} />
          </div>

          {/* Article Header */}
          <header className="space-y-6 border-b border-border/60 pb-8">
            <div className="flex flex-wrap items-center gap-2.5 text-[12px]">
              <span className="px-2.5 py-1 rounded-full bg-secondary text-foreground font-semibold uppercase tracking-wider text-[11px] border border-border/60">
                {post.category}
              </span>
              <span className="text-muted-foreground">&middot;</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{post.readingTimeMinutes} min read</span>
                <span className="text-[11px]">({post.wordCount} words)</span>
              </span>
              <span className="text-muted-foreground">&middot;</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-foreground leading-[1.2]">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-[17px] sm:text-[19px] text-muted-foreground leading-relaxed font-normal">
                {post.subtitle}
              </p>
            )}

            {/* Author Byline Card */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[14px] border border-primary/20">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-foreground">
                  {post.author.name}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  {post.author.role}
                </span>
              </div>
            </div>
          </header>

          {/* AEO Key Takeaways Box */}
          {post.takeaways && post.takeaways.length > 0 && (
            <section
              aria-label="Key Takeaways"
              className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-7 space-y-3"
            >
              <div className="flex items-center gap-2 text-primary font-semibold text-[14px]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Executive Summary &amp; Key Takeaways</span>
              </div>
              <ul className="space-y-2.5 text-[14px] text-muted-foreground leading-relaxed">
                {post.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Rendered Article Body */}
          <ArticleContent content={post.content} />

          {/* FAQs Accordion / Section */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="space-y-4 pt-8 border-t border-border/60">
              <div className="flex items-center gap-2 text-foreground font-bold text-[18px]">
                <HelpCircle className="h-4 w-4 text-primary" />
                <span>Frequently Asked Questions</span>
              </div>
              <div className="space-y-3">
                {post.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/70 bg-card p-5 space-y-2"
                  >
                    <h3 className="text-[15px] font-semibold text-foreground">
                      {faq.question}
                    </h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          <div className="pt-6 border-t border-border/60">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-medium text-muted-foreground mr-1">
                Topics:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] font-medium px-3 py-1 rounded-full bg-secondary text-foreground border border-border/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Associated Project Case Study */}
          {post.relatedProjectSlug && (
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-1 max-w-lg">
                <span className="text-[11px] font-mono text-primary font-semibold uppercase tracking-wider">
                  Associated Project &amp; Case Study
                </span>
                <h4 className="text-[17px] font-bold text-foreground">
                  {post.relatedProjectTitle}
                </h4>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Explore the complete interactive case study, problem statement, technical stack, and verified outcomes.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href={`/projects/${post.relatedProjectSlug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:brightness-105 transition-all shadow-sm min-h-[44px]"
                >
                  <span>View Project Case Study</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Author Profile Footer */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-lg">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                About the Author
              </span>
              <h4 className="text-[17px] font-bold text-foreground">
                {post.author.name}
              </h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                M.Sc. Chemistry student at Rabindranath Tagore University specializing in analytical methodology and phytochemical investigations, with practical engineering background in Flutter and web applications.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/chemistry"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-xl border border-border/80 bg-background text-[12px] font-medium text-foreground hover:bg-secondary/60 transition-colors"
              >
                <FlaskConical className="h-3.5 w-3.5 text-primary" />
                <span>Chemistry Profile</span>
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-[12px] font-medium hover:brightness-105 transition-all shadow-sm"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>View CV</span>
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-border/60">
              <h3 className="text-[18px] font-bold text-foreground tracking-tight">
                Related Reading &amp; Protocols
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group rounded-xl border border-border/70 bg-card p-5 space-y-2 hover:border-border transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-semibold text-primary uppercase tracking-wider">
                          {related.category}
                        </span>
                        <span>{related.readingTimeMinutes} min read</span>
                      </div>
                      <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {related.title}
                      </h4>
                      <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {related.excerpt}
                      </p>
                    </div>
                    <div className="pt-3 flex items-center gap-1 text-[12px] font-medium text-primary">
                      <span>Read article</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
