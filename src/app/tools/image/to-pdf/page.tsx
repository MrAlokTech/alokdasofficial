import { Metadata } from "next";
import { ImageToolHeader } from "@/components/tools/image/common/ImageToolHeader";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { ImageToPdfWorkspace } from "@/components/tools/image/to-pdf/ImageToPdfWorkspace";

export const metadata: Metadata = {
  title: "Export Images to PDF (Single or Bulk) | Client-Side Image Studio",
  description:
    "Combine multiple images into a multi-page PDF document. Reorder pages, select ISO A4 / US Letter / Auto-fit page sizes, adjust margins, and export 100% locally.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image/to-pdf",
  },
  openGraph: {
    title: "Export Images to PDF | Alok Das",
    description:
      "Client-side image to PDF converter. Combine single or bulk photos into professional PDF documents without server uploads.",
    url: "https://alokdasofficial.in/tools/image/to-pdf",
    type: "website",
  },
};

export default function ImageToPdfPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-6">
        <ImageToolHeader
          title="Export Images to PDF"
          description="Convert single photos or bulk image sets into a single multi-page PDF document. Easily rearrange page sequences, customize page sizes (A4, Letter, Auto-fit), and set margin spacing."
          badge="Bulk Multi-Page PDF"
        />

        <ImageToPdfWorkspace />

        <ImageToolFooter />
      </div>
    </div>
  );
}
