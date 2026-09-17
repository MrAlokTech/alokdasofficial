import { Metadata } from "next";
import { ImageToolHeader } from "@/components/tools/image/common/ImageToolHeader";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { FiltersWorkspace } from "@/components/tools/image/filters/FiltersWorkspace";

export const metadata: Metadata = {
  title: "Image Filters & LUT Studio | Client-Side Image Studio",
  description:
    "Enhance images with 12+ aesthetic LUT presets (Cinematic, Vintage, Noir, Cyberpunk, Forest) and fine-tune brightness, contrast, saturation, and sharpness. 100% private.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image/filters",
  },
  openGraph: {
    title: "Image Filters & Aesthetic LUTs | Alok Das",
    description:
      "Aesthetic photographic filter presets and manual color grading tools running locally inside your browser with zero latency.",
    url: "https://alokdasofficial.in/tools/image/filters",
    type: "website",
  },
};

export default function FiltersPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <ImageToolHeader
          title="Filters &amp; Aesthetic LUT Studio"
          description="Transform your images with 12+ curated film and mood presets (Cinematic Teal & Orange, Vintage, Classic Noir, Cyberpunk) or fine-tune with manual color grading sliders."
          badge="12+ Aesthetic LUTs"
        />

        <FiltersWorkspace />

        <ImageToolFooter />
      </div>
    </div>
  );
}
