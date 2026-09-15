import { personalData } from "@/data/personal";

export function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalData.name,
    url: personalData.contact.website,
    jobTitle: "M.Sc. Chemistry Student",
    description: personalData.bio.short,
    address: {
      "@type": "PostalAddress",
      addressLocality: personalData.location.city,
      addressRegion: personalData.location.state,
      postalCode: personalData.location.postalCode,
      addressCountry: "India",
    },
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Rabindranath Tagore University",
      },
      {
        "@type": "EducationalOrganization",
        name: "Jawahar Navodaya Vidyalaya",
      },
    ],
    sameAs: [
      personalData.social.github,
      personalData.social.linkedin,
      personalData.social.googlePlay,
    ],
    knowsAbout: [
      "Analytical Chemistry",
      "Phytochemical Screening",
      "Thin Layer Chromatography",
      "Good Laboratory Practice (GLP)",
      "Volumetric Analysis",
      "Flutter Application Development",
      "Web Development",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
