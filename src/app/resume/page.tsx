"use client";

import * as React from "react";
import { educationData } from "@/data/education";
import { dissertationData } from "@/data/chemistry";
import { Printer, Mail, MapPin, Globe } from "lucide-react";
import { ProtectedPhone } from "@/components/ui/protected-phone";
import { resumeData } from "@/data/resume";

export default function ResumePage() {
  const [currentDate, setCurrentDate] = React.useState("");

  React.useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-10 md:py-14 bg-secondary/30 print:bg-white print:py-0 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-8">
        {/* Print / Action Toolbar (Hidden during print) */}
        <div className="no-print sticky top-20 z-40 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Curriculum Vitae / Professional Resume
            </h1>
            {/* <p className="text-[16px] text-muted-foreground">
              Standardized format optimized for Chemistry recruiters, QC/QA
              hiring managers, and academic institutions.
            </p> */}
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[16px] font-medium text-primary-foreground shadow-sm hover:brightness-105 active:brightness-95 transition-all cursor-pointer min-h-[44px]"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Resume Sheet (Premium Editorial Document) */}
        <div className="resume-sheet rounded-2xl border border-border/80 bg-card p-8 sm:p-14 shadow-[0_1px_4px_rgba(0,0,0,0.03)] text-foreground space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* Header */}
          <div className="border-b border-border/80 pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground uppercase">
                {resumeData.name}
              </h2>
              <span className="text-[14px] font-mono font-medium text-emerald-700 dark:text-emerald-400">
                {resumeData.currentPosition} &middot; {resumeData.collegeShort}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                {resumeData.location.full}
              </span>
              <span>&bull;</span>
              <ProtectedPhone variant="resume" />
              <span>&bull;</span>
              <a
                href={`mailto:${resumeData.contact.email}`}
                className="flex items-center gap-1.5 hover:text-foreground hover:underline"
              >
                <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                {resumeData.contact.email}
              </a>
              <span>&bull;</span>
              <a
                href={resumeData.contact.website}
                className="flex items-center gap-1.5 hover:text-foreground hover:underline"
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                {resumeData.contact.websiteClean}
              </a>
            </div>
          </div>

          {/* Career Objective */}
          <section className="space-y-2">
            <h3 className="text-[20px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border-b border-border/80 pb-1">
              Career Objective
            </h3>
            <p className="text-[16px] text-muted-foreground leading-relaxed font-normal">
              Chemistry graduate with an ongoing M.Sc. curriculum and practical
              dissertation research experience, seeking an entry-level position
              as a <strong>Laboratory Assistant</strong>,{" "}
              <strong>Project Assistant</strong>, or{" "}
              <strong>Quality Control (QC) Analyst</strong>. Committed to
              applying analytical methodologies, volumetric techniques, and
              structured GLP documentation to advance laboratory and quality
              operations.
            </p>
          </section>

          {/* Education */}
          <section className="space-y-3">
            <h3 className="text-[20px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border-b border-border/80 pb-1">
              Education &amp; Academic Background
            </h3>

            <div className="space-y-3 text-[16px]">
              {educationData.map((edu) => (
                <div
                  key={edu.id}
                  className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                >
                  <div>
                    <span className="font-bold text-foreground">
                      {edu.degree} {edu.field}
                    </span>
                    <br />
                    <span className="text-muted-foreground">
                      {" "}
                      {edu.institution}, {edu.location}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-3 text-muted-foreground sm:text-right font-mono text-[20px] flex-shrink-0"> */}
                  <div className="items-center gap-3 text-muted-foreground sm:text-right font-mono text-[16px] flex-shrink-0">
                    <span className="font-semibold text-foreground">
                      {edu.score}
                    </span>
                    <br />
                    <span>
                      {edu.startYear} – {edu.endYear}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Research & Dissertation */}
          <section className="space-y-3">
            <h3 className="text-[20px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border-b border-border/80 pb-1">
              Dissertation Research Project
            </h3>

            <div className="space-y-2 text-[16px]">
              <span className="font-bold text-foreground">
                {dissertationData.title}
              </span>
              <div className="font-bold text-muted-foreground italic text-[12px] flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span>{dissertationData.institution}</span>
                <span>B.Sc. Chemistry &middot; 2025</span>
              </div>
              <ul className="space-y-1 text-muted-foreground pl-4 list-disc leading-relaxed text-[14pox]">
                <li>
                  Conducted systematic phytochemical screening of indigenous
                  medicinal plants for secondary metabolites including
                  alkaloids, flavonoids, tannins, saponins, and phenolics.
                </li>
                <li>
                  Performed qualitative and quantitative wet chemical assays and
                  Thin Layer Chromatography (TLC) using standardized laboratory
                  protocols.
                </li>
                <li>
                  Compiled experimental observations into a structured
                  scientific dissertation report adhering to Good Laboratory
                  Practice (GLP) documentation guidelines.
                </li>
              </ul>
            </div>
          </section>

          {/* Laboratory & Technical Skills */}
          <section className="space-y-3">
            <h3 className="text-[20px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border-b border-border/80 pb-1">
              Laboratory &amp; Analytical Skills
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Qualitative &amp; quantitative chemical analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Phytochemical extraction &amp; solvent partitioning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>
                  Titration techniques (acid-base, redox, complexometric)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>
                  Thin Layer Chromatography (TLC) &amp; Column separation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>
                  Spectroscopic methods (UV-Vis spectrophotometry basics)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>
                  Reagent standardization, serial dilutions &amp; pH metry
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>
                  Laboratory safety, GLP adherence &amp; chemical handling
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>
                  Scientific report preparation &amp; experimental data
                  recording
                </span>
              </div>
            </div>
          </section>

          {/* Complementary Software Skills & Projects */}
          <section className="space-y-3">
            <h3 className="text-[20px] font-bold uppercase tracking-wider text-primary border-b border-border/80 pb-1">
              Complementary Software Skills &amp; Applications
            </h3>

            <div className="space-y-2 text-[14px]">
              <p className="text-muted-foreground">
                <strong className="text-foreground">
                  Office Capabilities:
                </strong>{" "}
                Proficient in MS Office tools
              </p>
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="font-bold text-foreground">
                    Technical Capabilities:
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    Flutter, Dart, SQLite, Next.js, TypeScript, Tailwind CSS,
                    Git/GitHub, Firebase, Material Design, Google Play Console.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-foreground">
                    Mileage Tracker — Fuel &amp; Cost
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    (Android App on Google Play): Engineered cross-platform
                    vehicle expense tracker with local SQLite database and
                    offline analytics.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-foreground">
                    Alomole — Chemistry Companion
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    (Android App on Googel Play): Built scientific calculation
                    tool with chemical equation balancing and molarity
                    calculators, Search any molecules and have all types of
                    basic information.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Languages */}
          <section className="space-y-2">
            <h3 className="text-[20px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border-b border-border/80 pb-1">
              Language Proficiency
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[14px] text-muted-foreground">
              <div>
                <strong className="text-foreground block">Bengali</strong>
                <span>
                  Native
                  <br />
                  (Read, Write, Speak)
                </span>
              </div>
              <div>
                <strong className="text-foreground block">English</strong>
                <span>
                  Fluent
                  <br />
                  (Read, Write, Speak)
                </span>
              </div>
              <div>
                <strong className="text-foreground block">Hindi</strong>
                <span>
                  Fluent
                  <br />
                  (Read, Write, Speak)
                </span>
              </div>
              <div>
                <strong className="text-foreground block">Assamese</strong>
                <span>Working (Speak)</span>
              </div>
            </div>
          </section>

          {/* Formal Declaration */}
          <section className="pt-6 border-t border-border/80 space-y-4">
            <p className="text-[16px] text-muted-foreground italic leading-relaxed">
              I hereby declare that all information stated in this curriculum
              vitae is true, complete, and correct to the best of my knowledge
              and belief.
            </p>
            <div className="flex items-end justify-between text-[14px] pt-2">
              <div>
                <p className="text-muted-foreground">
                  Location:{" "}
                  <span className="text-foreground">Hojai, Assam, India</span>
                </p>
                <p className="text-muted-foreground">
                  Date: <span className="text-foreground">{currentDate}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-base text-foreground tracking-wide">
                  Alok Das
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Candidate Signature
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
