import { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { projectsData } from "@/data/projects";
import { defaultPolls } from "@/data/polls";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://alokdasofficial.in";
  const lastModified = new Date();

  const coreRoutes = [
    "",
    "/about",
    "/chemistry",
    "/projects",
    "/blog",
    "/resume",
    "/contact",
    "/tools",
    "/tools/pdf",
    "/tools/pdf/merge",
    "/tools/pdf/split",
    "/tools/pdf/compress",
    "/tools/pdf/sign",
    "/tools/pdf/edit",
    "/tools/pdf/scan",
    "/tools/pdf/privacy",
    "/tools/pdf/terms",
    "/tools/image",
    "/tools/image/compress",
    "/tools/image/resize",
    "/tools/image/crop",
    "/tools/image/rotate",
    "/tools/image/convert",
    "/tools/image/watermark",
    "/tools/image/filters",
    "/tools/image/to-pdf",
    "/tools/image/privacy",
    "/tools/image/terms",
    "/tools/morse",
    "/tools/pomodoro",
    "/tools/world-clock",
    "/tools/chemistry-challenge",
    "/tools/labs",
    "/tools/labs/ph-scale",
    "/tools/labs/titration",
    "/tools/labs/beer-lambert",
    "/tools/labs/reaction-kinetics",
    "/tools/labs/ohms-law",
    "/tools/labs/refraction",
    "/tools/labs/measurement-sigfigs",
    "/polls",
  ];

  const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);
  const projectRoutes = projectsData.map((project) => `/projects/${project.id}`);
  const pollRoutes = defaultPolls
    .filter((poll) => poll.indexable !== false)
    .map((poll) => `/polls/${poll.slug}`);

  const allRoutes = [...coreRoutes, ...blogRoutes, ...projectRoutes, ...pollRoutes];

  const internalRoutes = allRoutes.map((route) => {
    let priority = 0.7;
    let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "monthly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "weekly";
    } else if (route === "/resume" || route === "/chemistry") {
      priority = 0.9;
    } else if (route === "/blog" || route.startsWith("/blog/")) {
      priority = 0.85;
      changeFrequency = "weekly";
    } else if (route.startsWith("/projects/")) {
      priority = 0.8;
    } else if (route.startsWith("/tools/labs")) {
      priority = 0.8;
    } else if (route === "/polls" || route.startsWith("/polls/")) {
      priority = 0.75;
      changeFrequency = "weekly";
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });

  const externalUrls: MetadataRoute.Sitemap = [
    {
      url: "https://me.alokdasofficial.in",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://mileage.alokdasofficial.in",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://notes.alokdasofficial.in",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: "https://shorturl.alokdasofficial.in",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: "https://tickly.alokdasofficial.in",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: "https://alomolecule.web.app",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  return [...internalRoutes, ...externalUrls];
}
