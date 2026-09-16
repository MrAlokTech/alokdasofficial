import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Alok Das (alokdasofficial)",
  description:
    "Get in touch with Alok Das (alokdasofficial) for chemistry research collaborations, laboratory opportunities, or software development inquiries.",
  keywords: [
    "Contact Alok Das",
    "alokdasofficial",
    "alokdasoffiical",
    "Alok Das Email",
    "Alok Das Assam",
    "Chemistry Graduate Contact",
  ],
  alternates: {
    canonical: "https://alokdasofficial.in/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
