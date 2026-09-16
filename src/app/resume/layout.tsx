import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume & Curriculum Vitae — Alok Das (alokdasofficial)",
  description:
    "Curriculum vitae of Alok Das, chemistry graduate and M.Sc. Chemistry student. Academic credentials, laboratory analytical expertise, QC/QA capabilities, and technical projects.",
  keywords: [
    "Alok Das Resume",
    "Alok Das CV",
    "alokdasofficial",
    "alokdasoffiical",
    "chemistry graduate resume",
    "QC Analyst Resume",
    "M.Sc. Chemistry Assam",
  ],
  alternates: {
    canonical: "https://alokdasofficial.in/resume",
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
