import { Hero } from "@/components/home/hero";
import { IdentityStrip } from "@/components/home/identity-strip";
import { ChemistryFocus } from "@/components/home/chemistry-focus";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ToolsTeaser } from "@/components/home/tools-teaser";
import { HomeBlogTeaser } from "@/components/home/blog-teaser";
import { AvailabilityBanner } from "@/components/home/availability-banner";
import { HomePollTeaser } from "@/components/home/poll-teaser";
import { HomeCta } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <IdentityStrip />
      <ChemistryFocus />
      <FeaturedProjects />
      <ToolsTeaser />
      <HomeBlogTeaser />
      <AvailabilityBanner />
      <HomePollTeaser />
      <HomeCta />
    </div>
  );
}
