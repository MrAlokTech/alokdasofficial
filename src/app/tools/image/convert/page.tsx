import { Metadata } from "next";
import { ImageToolHeader } from "@/components/tools/image/common/ImageToolHeader";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { ConvertWorkspace } from "@/components/tools/image/convert/ConvertWorkspace";

export const metadata: Metadata = {
  title: "Convert Image Formats (JPG, PNG, WEBP) | Client-Side Image Studio",
  description:
    "Convert images between JPG, PNG, and WEBP formats directly in your browser with zero quality degradation. Batch conversion with ZIP download.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image/convert",
  },
  openGraph: {
    title: "Convert Image Formats | Alok Das",
    description:
      "Fast client-side image transcoding between JPG, PNG, and WEBP. 100% private in-browser processing with bulk conversion.",
    url: "https://alokdasofficial.in/tools/image/convert",
    type: "website",
  },
};

export default function ConvertPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <ImageToolHeader
          title="Convert Image Formats"
          description="Transcode images between JPG, PNG, and WEBP formats with instant local rendering. Handles transparent PNG to JPG conversion gracefully without black box artifacts."
          badge="JPG / PNG / WEBP"
        />

        <ConvertWorkspace />

        <ImageToolFooter />
      </div>
    </div>
  );
}
