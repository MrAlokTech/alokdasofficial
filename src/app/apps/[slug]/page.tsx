import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { appsData } from "@/data/apps";
import { ArrowRight } from "lucide-react";

interface AppPageProps {
  params: {
    slug: string;
  };
}

const APP_TO_PROJECT_MAP: Record<string, string> = {
  "mileage-tracker": "mileage-tracker-app",
  "alomole": "alomole-chemistry-tool",
};

export async function generateStaticParams() {
  return appsData.map((app) => ({
    slug: app.id,
  }));
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const projectId = APP_TO_PROJECT_MAP[params.slug] || params.slug;
  return {
    title: "Redirecting to Project Case Study | Alok Das",
    robots: { index: false, follow: true },
    alternates: {
      canonical: `https://alokdasofficial.in/projects/${projectId}`,
    },
  };
}

export default function AppRedirectPage({ params }: AppPageProps) {
  const projectId = APP_TO_PROJECT_MAP[params.slug];
  if (!projectId) {
    notFound();
  }

  const targetUrl = `/projects/${projectId}`;

  return (
    <div className="py-24 container mx-auto px-4 text-center max-w-xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Redirecting to Project Case Study...
        </h1>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          This application case study is now unified under the Projects portfolio.
        </p>
      </div>
      <div>
        <Link
          href={targetUrl}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-[14px] shadow-sm hover:brightness-105 transition-all"
        >
          <span>Continue to Case Study</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('${targetUrl}');`,
        }}
      />
    </div>
  );
}
