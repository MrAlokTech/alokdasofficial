import { personalData } from "@/data/personal";

export function PersonJsonLd() {
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://alokdasofficial.in/#person",
        name: personalData.name,
        givenName: personalData.firstName,
        familyName: personalData.lastName,
        additionalName: "alokdasofficial",
        alternateName: [
          "alokdasofficial",
          "alokdasoffiical",
          "Alok Das",
          "alok das",
          "MrAlokTech",
          "Alok Das Chemistry",
        ],
        url: personalData.contact.website,
        image: "https://alokdasofficial.in/og.png",
        jobTitle: "Chemistry Graduate & Scientific Software Builder",
        description:
          "M.Sc. Chemistry student at Rabindranath Tagore University, Assam. Analytical chemistry researcher, laboratory practitioner, and builder of Alomole, Mileage Tracker, and interactive science tools.",
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
            address: {
              "@type": "PostalAddress",
              addressLocality: "Hojai",
              addressRegion: "Assam",
              addressCountry: "India",
            },
          },
          {
            "@type": "EducationalOrganization",
            name: "Jawahar Navodaya Vidyalaya",
          },
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            name: "Bachelor of Science (B.Sc.) in Chemistry (Distinction)",
            recognizedBy: {
              "@type": "EducationalOrganization",
              name: "Rabindranath Tagore University",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Master of Science (M.Sc.) in Chemistry Candidate",
            recognizedBy: {
              "@type": "EducationalOrganization",
              name: "Rabindranath Tagore University",
            },
          },
        ],
        sameAs: [
          personalData.social.github,
          personalData.social.linkedin,
          personalData.social.googlePlay,
          personalData.social.whatsapp,
        ],
        knowsAbout: [
          "Analytical Chemistry",
          "Phytochemical Screening",
          "Thin Layer Chromatography (TLC)",
          "Good Laboratory Practice (GLP)",
          "Volumetric Analysis",
          "UV-Visible Spectrophotometry",
          "Beer-Lambert Law",
          "Flutter Application Development",
          "Next.js Web Development",
          "Scientific Computing & Simulation",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://alokdasofficial.in/#website",
        url: personalData.contact.website,
        name: "Alok Das Official",
        alternateName: [
          "alokdasofficial",
          "Alok Das Portfolio",
          "Alok Das Chemistry",
        ],
        description:
          "Official portfolio, chemistry research, and software tools by Alok Das (alokdasofficial).",
        publisher: {
          "@id": "https://alokdasofficial.in/#person",
        },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfilePage",
        "@id": "https://alokdasofficial.in/#profilepage",
        url: personalData.contact.website,
        name: "Alok Das — Chemistry Graduate & Scientific Software Builder",
        isPartOf: {
          "@id": "https://alokdasofficial.in/#website",
        },
        mainEntity: {
          "@id": "https://alokdasofficial.in/#person",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://alokdasofficial.in/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Who is Alok Das?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Alok Das is a chemistry graduate and scientific software builder from Assam, India. He holds a B.Sc. in Chemistry with Distinction and is completing his M.Sc. in Chemistry at Rabindranath Tagore University. Known online as alokdasofficial, he develops mobile applications, web tools, and interactive laboratory simulators alongside his analytical lab work.",
            },
          },
          {
            "@type": "Question",
            name: "What is Alok Das's educational background and chemistry specialization?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Alok Das completed his schooling at Jawahar Navodaya Vidyalaya, graduated with Distinction in B.Sc. Chemistry from Rabindranath Tagore University, and is currently pursuing his M.Sc. in Chemistry. His research focuses on analytical chemistry, phytochemical screening of regional flora, and chromatographic profiling.",
            },
          },
          {
            "@type": "Question",
            name: "What software applications and tools has Alok Das built?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Alok Das developed Alomole (a specialized molecular weight and stoichiometry calculator), Mileage Tracker (an Android utility available on Google Play), and interactive browser-based science simulators including Titration, Beer-Lambert Law, Reaction Kinetics, and pH Scale models on alokdasofficial.in.",
            },
          },
          {
            "@type": "Question",
            name: "What is Alok Das's official online handle and website?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Alok Das's primary online handle is alokdasofficial across LinkedIn and his website, and MrAlokTech on GitHub. His official portfolio website is https://alokdasofficial.in.",
            },
          },
          {
            "@type": "Question",
            name: "How can I contact Alok Das for scientific or development roles?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can reach Alok Das via email at alok@alokdasofficial.in, connect with him on LinkedIn at https://www.linkedin.com/in/alokdasofficial, or visit his contact page at https://alokdasofficial.in/contact.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
}
