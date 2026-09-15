import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { BlogListing } from "@/components/blog/blog-listing";
import { BookOpen, FlaskConical, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Writing & Research Blog | Alok Das",
  description:
    "Technical writings and laboratory methodologies across phytochemical research, chemical computation, algorithm design, and offline-first mobile architecture by Alok Das.",
  alternates: {
    canonical: "https://alokdasofficial.in/blog",
  },
  openGraph: {
    title: "Writing & Research Blog | Alok Das",
    description:
      "Technical writings and laboratory methodologies across phytochemical research, chemical computation, and mobile architecture.",
    url: "https://alokdasofficial.in/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Writing & Research Blog | Alok Das",
    description:
      "Technical writings and laboratory methodologies across natural product chemistry, stoichiometry algorithms, and mobile architecture.",
    url: "https://alokdasofficial.in/blog",
    author: {
      "@type": "Person",
      name: "Alok Das",
      url: "https://alokdasofficial.in",
    },
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://alokdasofficial.in/blog/${post.slug}`,
      datePublished: post.publishedAt,
      author: {
        "@type": "Person",
        name: "Alok Das",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3 py-1 text-[12px] font-medium text-foreground">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>WRITING &amp; PERSPECTIVES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.15]">
              Articles, Protocols &amp; Insights
            </h1>
            <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed font-normal">
              Methodological notes on natural product chemistry, stoichiometric algorithm design, and practical software engineering from the laboratory bench to production code.
            </p>
          </div>

          {/* Interactive Listing Component */}
          <BlogListing initialPosts={posts} categories={categories} />

          {/* Recruiter / Cross-Navigation Strip */}
          <section className="rounded-2xl border border-border/70 bg-secondary/30 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <h2 className="text-[18px] font-bold tracking-tight text-foreground">
                Looking for academic verification or full project case studies?
              </h2>
              <p className="text-[13px] text-muted-foreground">
                Review Alok&apos;s verified M.Sc. academic background, laboratory protocols, or downloadable résumé.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/chemistry"
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-background border border-border/80 text-foreground text-[13px] font-medium hover:bg-secondary/60 transition-colors"
              >
                <FlaskConical className="h-4 w-4 text-primary" />
                <span>Chemistry Dossier</span>
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-medium hover:brightness-105 transition-all shadow-sm"
              >
                <FileText className="h-4 w-4" />
                <span>View Résumé</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
