import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";

export async function HomeBlogTeaser() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 3);

  if (recentPosts.length === 0) return null;

  return (
    <section className="py-14 md:py-18 border-b border-border/60 bg-secondary/15">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>Writing &amp; Research</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              From the Blog
            </h2>
            <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
              Notes on laboratory screening protocols, chemical computing algorithms, and software design.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline flex-shrink-0 min-h-[44px]"
          >
            <span>View All Posts</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3-Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {recentPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-border transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={post.category === "Chemistry" || post.category === "Research" ? "chem" : "tech"}>
                    {post.category}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readingTimeMinutes} min read
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-[17px] font-bold text-foreground leading-snug tracking-tight">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[12px] text-muted-foreground">
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline min-h-[44px]"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
