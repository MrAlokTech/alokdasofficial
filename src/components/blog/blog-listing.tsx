"use client";

import * as React from "react";
import Link from "next/link";
import { BlogPost, BlogCategory } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Search, ArrowRight, BookOpen, Tag } from "lucide-react";

interface BlogListingProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export function BlogListing({ initialPosts, categories }: BlogListingProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPosts = React.useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "all" || post.category.toLowerCase() === activeCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, activeCategory, searchQuery]);

  const featuredPost = initialPosts.find((p) => p.featured) || initialPosts[0];

  return (
    <div className="space-y-10">
      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        {/* Category Tabs */}
        <div className="inline-flex p-1 bg-secondary/60 rounded-xl border border-border/60 max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveCategory("all")}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
              activeCategory === "all"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Articles ({initialPosts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`min-h-[40px] px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-border/70 bg-card text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            aria-label="Search blog posts"
          />
        </div>
      </div>

      {/* Featured Article Banner (only when showing 'all' and no active search) */}
      {activeCategory === "all" && !searchQuery && featuredPost && (
        <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-secondary/50 via-card to-card p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden group">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground">
                Featured Research
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-secondary text-foreground border border-border/60">
                {featuredPost.category}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{featuredPost.readingTimeMinutes} min read</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
              <Link href={`/blog/${featuredPost.slug}`}>
                {featuredPost.title}
              </Link>
            </h2>

            <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
              {featuredPost.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-medium shadow-sm hover:brightness-105 active:brightness-95 transition-all"
              >
                <span>Read Full Article</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-sm hover:border-border transition-all group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-foreground font-medium text-[11px] border border-border/50">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  <span>{post.readingTimeMinutes} min read</span>
                </span>
              </div>

              <h3 className="text-[18px] font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-6 space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50 text-[12px]">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-primary hover:underline flex items-center gap-1 min-h-[36px] items-center"
                >
                  <span>Read</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 space-y-3 rounded-2xl border border-dashed border-border/80 p-8">
          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-[15px] font-medium text-foreground">No articles match your search</p>
          <p className="text-[13px] text-muted-foreground">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-2 text-[13px] font-semibold text-primary hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
