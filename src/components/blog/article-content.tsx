import * as React from "react";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Parse markdown content by line blocks
  const blocks = React.useMemo(() => {
    const lines = content.trim().split("\n");
    const parsed: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Skip blank lines
      if (!line.trim()) {
        i++;
        continue;
      }

      // Horizontal Rule
      if (line.trim() === "---") {
        parsed.push(
          <hr key={`hr-${i}`} className="my-8 border-t border-border/60" />
        );
        i++;
        continue;
      }

      // H2 Heading
      if (line.startsWith("## ")) {
        const title = line.replace("## ", "").trim();
        parsed.push(
          <h2
            key={`h2-${i}`}
            id={title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            className="text-2xl sm:text-[28px] font-bold tracking-tight text-foreground mt-10 mb-4 scroll-mt-20 border-b border-border/40 pb-2"
          >
            {title}
          </h2>
        );
        i++;
        continue;
      }

      // H3 Heading
      if (line.startsWith("### ")) {
        const title = line.replace("### ", "").trim();
        parsed.push(
          <h3
            key={`h3-${i}`}
            id={title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            className="text-lg sm:text-[20px] font-semibold tracking-tight text-foreground mt-6 mb-2 scroll-mt-20"
          >
            {title}
          </h3>
        );
        i++;
        continue;
      }

      // Code block
      if (line.startsWith("```")) {
        const lang = line.replace("```", "").trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        parsed.push(
          <div key={`code-${i}`} className="my-6 rounded-xl overflow-hidden border border-border/70 bg-secondary/50">
            {lang && (
              <div className="px-4 py-1.5 border-b border-border/50 bg-secondary/80 text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                {lang}
              </div>
            )}
            <pre className="p-4 text-[13px] font-mono leading-relaxed overflow-x-auto text-foreground/90">
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>
        );
        continue;
      }

      // Markdown Table
      if (line.startsWith("|") && line.endsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const headerCols = tableLines[0]
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());
          // Line 1 is the separator (|---|---|)
          const bodyRows = tableLines.slice(2).map((row) =>
            row
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim())
          );

          parsed.push(
            <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-xl border border-border/70 bg-card">
              <table className="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-secondary/50">
                    {headerCols.map((th, thIdx) => (
                      <th key={thIdx} className="px-4 py-3 font-semibold text-foreground">
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-secondary/20 transition-colors">
                      {row.map((td, tdIdx) => (
                        <td key={tdIdx} className="px-4 py-3 text-muted-foreground">
                          {td}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Blockquote
      if (line.startsWith("> ")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith("> ")) {
          quoteLines.push(lines[i].replace("> ", ""));
          i++;
        }
        parsed.push(
          <blockquote
            key={`quote-${i}`}
            className="my-6 pl-4 border-l-2 border-primary/70 italic text-[15px] text-muted-foreground"
          >
            {quoteLines.join(" ")}
          </blockquote>
        );
        continue;
      }

      // Unordered List
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const listItems: string[] = [];
        while (
          i < lines.length &&
          (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
        ) {
          listItems.push(lines[i].trim().replace(/^[-*]\s+/, ""));
          i++;
        }
        parsed.push(
          <ul key={`ul-${i}`} className="my-4 space-y-2 list-disc list-inside text-[15px] text-muted-foreground leading-relaxed">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className="pl-1">
                <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered List
      if (/^\d+\.\s/.test(line.trim())) {
        const listItems: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
          i++;
        }
        parsed.push(
          <ol key={`ol-${i}`} className="my-4 space-y-2 list-decimal list-inside text-[15px] text-muted-foreground leading-relaxed">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className="pl-1">
                <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Regular Paragraph
      const pLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].startsWith("##") &&
        !lines[i].startsWith("###") &&
        !lines[i].startsWith("```") &&
        !lines[i].startsWith("> ") &&
        !lines[i].trim().startsWith("- ") &&
        !lines[i].trim().startsWith("* ") &&
        !/^\d+\.\s/.test(lines[i].trim()) &&
        !(lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) &&
        lines[i].trim() !== "---"
      ) {
        pLines.push(lines[i]);
        i++;
      }

      if (pLines.length > 0) {
        parsed.push(
          <p
            key={`p-${i}`}
            className="my-4 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInline(pLines.join(" ")) }}
          />
        );
      }
    }

    return parsed;
  }, [content]);

  return <div className="article-body max-w-none">{blocks}</div>;
}

/**
 * Formats inline bold, italic, inline code, and mathematical subscripts.
 */
function formatInline(str: string): string {
  return str
    // Markdown links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline font-medium">$1</a>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-secondary text-foreground text-[13px] font-mono border border-border/50">$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
    // Math inline $...$
    .replace(/\$([^$]+)\$/g, '<span class="font-serif italic font-medium text-foreground px-0.5">$1</span>');
}
