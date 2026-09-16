import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PersonJsonLd } from "@/components/seo/json-ld";
import { personalData } from "@/data/personal";
import { PomodoroProvider } from "@/context/pomodoro-context";
import { SitePreloaderProvider } from "@/components/ui/site-preloader";

export const metadata: Metadata = {
  metadataBase: new URL("https://alokdasofficial.in"),
  title: {
    default: `${personalData.name} (alokdasofficial) — Chemistry Graduate & Scientific Software Builder`,
    template: `%s | ${personalData.name}`,
  },
  description: `Official website of ${personalData.name} (alokdasofficial) — Chemistry graduate and M.Sc. Chemistry student at Rabindranath Tagore University, Assam. Analytical chemistry, laboratory research, and builder of Alomole, Mileage Tracker, and interactive science simulators.`,
  keywords: [
    "Alok Das",
    "alok das",
    "alokdasofficial",
    "alokdasoffiical",
    "chemistry graduate",
    "M.Sc. Chemistry",
    "Chemistry Student",
    "Chemistry Professional",
    "Rabindranath Tagore University",
    "Hojai Assam",
    "Analytical Chemistry",
    "Phytochemical Analysis",
    "Quality Control Analyst",
    "Laboratory Assistant",
    "Flutter Developer",
    "Mileage Tracker App",
    "Alomole",
    "MrAlokTech",
    "Scientific Software Builder",
  ],
  authors: [{ name: personalData.name, url: personalData.contact.website }],
  creator: personalData.name,
  alternates: {
    canonical: "https://alokdasofficial.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: personalData.contact.website,
    siteName: `${personalData.name} (alokdasofficial)`,
    title: `${personalData.name} (alokdasofficial) — Chemistry Graduate & Scientific Software Builder`,
    description: `Official portfolio of ${personalData.name} (alokdasofficial) — M.Sc. Chemistry student at Rabindranath Tagore University, Assam. Analytical chemistry, laboratory research, and software tools.`,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${personalData.name} — Chemistry Graduate & Scientific Software Builder`,
        type: "image/png",
      },
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${personalData.name} — Chemistry Graduate & Scientific Software Builder`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${personalData.name} (alokdasofficial) — Chemistry Graduate & Scientific Software Builder`,
    description: `Official portfolio of ${personalData.name} (alokdasofficial) — M.Sc. Chemistry student at Rabindranath Tagore University, Assam.`,
    images: ["/og.png"],
    creator: "@alokdasofficial",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:text-emerald-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PomodoroProvider>
            <SitePreloaderProvider>
              <PersonJsonLd />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </SitePreloaderProvider>
          </PomodoroProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
