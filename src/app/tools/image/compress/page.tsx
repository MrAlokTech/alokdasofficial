import { Metadata } from "next";
import { ImageToolHeader } from "@/components/tools/image/common/ImageToolHeader";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { CompressWorkspace } from "@/components/tools/image/compress/CompressWorkspace";

export const metadata: Metadata = {
  title: "Compress Image (MB to KB) | Client-Side Image Studio",
  description:
    "Compress images from MB to exact target KB (e.g. under 50KB or 200KB) with iterative binary-search optimization. 100% private, client-side, zero server uploads.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image/compress",
  },
  openGraph: {
    title: "Compress Image to Exact KB | Alok Das",
    description:
      "Client-side image compressor. Reduce file sizes, hit strict government/job application KB thresholds, and batch compress with zero privacy risk.",
    url: "https://alokdasofficial.in/tools/image/compress",
    type: "website",
  },
};

export default function CompressPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <ImageToolHeader
          title="Compress Image (MB to KB)"
          description="Reduce image file sizes with smart binary-search target KB optimization or manual quality controls. Supports bulk queues with independent per-file target sizes."
          badge="Smart Target KB Matcher"
        />

        <CompressWorkspace />

        <ImageToolFooter />
      </div>
    </div>
  );
}
