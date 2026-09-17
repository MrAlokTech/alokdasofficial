import { Metadata } from "next";
import { ImageToolHeader } from "@/components/tools/image/common/ImageToolHeader";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { ResizeWorkspace } from "@/components/tools/image/resize/ResizeWorkspace";

export const metadata: Metadata = {
  title: "Resize Image (Dimensions & Scale) | Client-Side Image Studio",
  description:
    "Resize images by width and height, lock aspect ratio, scale by percentage, or choose standard resolutions (Full HD, Passport photo 350x450, Social). 100% private.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image/resize",
  },
  openGraph: {
    title: "Resize Image | Alok Das",
    description:
      "Client-side image resizer. Scale pixel dimensions, batch resize images, and retain crisp quality without server uploads.",
    url: "https://alokdasofficial.in/tools/image/resize",
    type: "website",
  },
};

export default function ResizePage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <ImageToolHeader
          title="Resize Image Dimensions"
          description="Adjust image resolution with aspect ratio lock, percentage scale factors (25%–200%), and standard dimension presets. Process single or bulk images with independent overrides."
          badge="Aspect Lock & Scale"
        />

        <ResizeWorkspace />

        <ImageToolFooter />
      </div>
    </div>
  );
}
