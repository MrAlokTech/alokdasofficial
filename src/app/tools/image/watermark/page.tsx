import { Metadata } from "next";
import { ImageToolHeader } from "@/components/tools/image/common/ImageToolHeader";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { WatermarkWorkspace } from "@/components/tools/image/watermark/WatermarkWorkspace";

export const metadata: Metadata = {
  title: "Add Watermark to Images | Client-Side Image Studio",
  description:
    "Add custom text or logo watermarks to images. Customize typography, opacity, colors, 9-point grid anchors, or diagonal repeating tile pattern. 100% private.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image/watermark",
  },
  openGraph: {
    title: "Add Watermarks to Images | Alok Das",
    description:
      "Protect your photos with customizable text watermarks, logo stamps, and diagonal repeating tile security grids. Zero server uploads.",
    url: "https://alokdasofficial.in/tools/image/watermark",
    type: "website",
  },
};

export default function WatermarkPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <ImageToolHeader
          title="Add Watermark to Images"
          description="Protect and brand your photography. Add copyright text, logo stamps, or full-coverage diagonal repeating tile patterns with opacity and color control."
          badge="Text & Logo Stamps"
        />

        <WatermarkWorkspace />

        <ImageToolFooter />
      </div>
    </div>
  );
}
