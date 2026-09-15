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
    default: `${personalData.name} — M.Sc. Chemistry Student & Builder`,
    template: `%s | ${personalData.name}`,
  },
  description: `${personalData.brandStatement} M.Sc. Chemistry student at Rabindranath Tagore University, Assam. Analytical chemistry, laboratory skills, and practical software applications.`,
  keywords: [
    "Alok Das",
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
  ],
  authors: [{ name: personalData.name, url: personalData.contact.website }],
  creator: personalData.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: personalData.contact.website,
    siteName: personalData.name,
    title: `${personalData.name} — Chemistry Professional & Builder`,
    description: personalData.brandStatement,
  },
  twitter: {
    card: "summary_large_image",
    title: `${personalData.name} — Chemistry Professional & Builder`,
    description: personalData.brandStatement,
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
