import { Metadata } from "next";
import { ImageToolHeader } from "@/components/tools/image/common/ImageToolHeader";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { CropWorkspace } from "@/components/tools/image/crop/CropWorkspace";

export const metadata: Metadata = {
  title: "Crop Image (Interactive Aspect Ratio) | Client-Side Image Studio",
  description:
    "Crop images with interactive visual handles, rule-of-thirds grid, and aspect ratio presets (1:1, 16:9, 4:3, 9:16, Passport 3.5:4.5). 100% private in-browser tool.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image/crop",
  },
  openGraph: {
    title: "Crop Image Interactively | Alok Das",
    description:
      "Interactive client-side image cropping with rule-of-thirds overlay and popular social/passport aspect ratios. Zero server uploads.",
    url: "https://alokdasofficial.in/tools/image/crop",
    type: "website",
  },
};

export default function CropPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <ImageToolHeader
          title="Interactive Image Cropper"
          description="Drag and resize the visual crop box to frame your composition. Choose popular aspect ratios or freely adjust crop bounds with real-time dimension feedback."
          badge="Interactive Canvas"
        />

        <CropWorkspace />

        <ImageToolFooter />
      </div>
    </div>
  );
}
