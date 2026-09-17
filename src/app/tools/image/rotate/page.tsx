import { Metadata } from "next";
import { ImageToolHeader } from "@/components/tools/image/common/ImageToolHeader";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { RotateWorkspace } from "@/components/tools/image/rotate/RotateWorkspace";

export const metadata: Metadata = {
  title: "Rotate & Flip Image | Client-Side Image Studio",
  description:
    "Rotate images 90°, 180°, flip horizontally or vertically, and straighten fine angles. 100% private in-browser image manipulation.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image/rotate",
  },
  openGraph: {
    title: "Rotate & Flip Images | Alok Das",
    description:
      "Client-side image rotation and mirror flipping. Reorient photos and apply adjustments in single or bulk queues.",
    url: "https://alokdasofficial.in/tools/image/rotate",
    type: "website",
  },
};

export default function RotatePage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <ImageToolHeader
          title="Rotate &amp; Flip Images"
          description="Rotate images clockwise, counter-clockwise, or 180 degrees. Mirror horizontally or vertically, with support for batch orientation adjustments and independent controls."
          badge="Lossless Canvas"
        />

        <RotateWorkspace />

        <ImageToolFooter />
      </div>
    </div>
  );
}
