import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects & Applications — Alok Das (alokdasofficial)",
  description:
    "Explore scientific tools, mobile applications, and academic chemistry projects built by Alok Das (alokdasofficial), including Alomole, Mileage Tracker, and interactive lab simulators.",
  keywords: [
    "Alok Das Projects",
    "alokdasofficial",
    "alokdasoffiical",
    "Alomole",
    "Mileage Tracker App",
    "Flutter Apps Alok Das",
    "Chemistry Software",
  ],
  alternates: {
    canonical: "https://alokdasofficial.in/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
