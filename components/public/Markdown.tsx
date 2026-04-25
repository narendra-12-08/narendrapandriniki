import React from "react";

/**
 * Lightweight markdown renderer. Supports:
 *  # / ## / ### headings
 *  - lists (consecutive lines)
 *  ``` fenced code blocks
 *  paragraphs (blank-line separated)
 *  inline: **bold**, *italic*, `code`, [link](url)
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Tokenise inline. Process in a single regex sweep.
  const tokens: React.ReactNode[] = [];
  // Combined regex for code, bold, italic, link.
  const regex =
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const m = match[0];
    const k = `${keyPrefix}-${i++}`;
    if (m.startsWith("`")) {
      tokens.push(<code key={k}>{m.slice(1, -1)}</code>);
    } else if (m.startsWith("**")) {
      tokens.push(<strong key={k}>{m.slice(2, -2)}</strong>);
    } else if (m.startsWith("*")) {
      tokens.push(<em key={k}>{m.slice(1, -1)}</em>);
    } else if (m.startsWith("[")) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(m);
      if (linkMatch) {
        tokens.push(
          <a
            key={k}
            href={linkMatch[2]}
            target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
            rel={linkMatch[2].startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }
    lastIndex = match.index + m.length;
  }
  if (lastIndex < text.length) tokens.push(text.slice(lastIndex));
  return tokens;
}

export default function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, "").trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(
        <pre
          key={`b${blockKey++}`}
          className="my-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
        >
          <code className="font-mono text-[var(--text-2)]" data-lang={lang}>
            {buf.join("\n")}
          </code>
        </pre>
      );
      continue;
    }

    // Headings
    if (/^### /.test(line)) {
      blocks.push(
        <h3
          key={`b${blockKey++}`}
          className="mt-10 mb-3 text-lg font-semibold text-[var(--text)] tracking-tight"
        >
          {renderInline(line.slice(4), `h3-${blockKey}`)}
        </h3>
      );
      i++;
      continue;
    }
    if (/^## /.test(line)) {
      blocks.push(
        <h2
          key={`b${blockKey++}`}
          className="mt-14 mb-4 text-2xl font-semibold text-[var(--text)] tracking-tight"
        >
          {renderInline(line.slice(3), `h2-${blockKey}`)}
        </h2>
      );
      i++;
      continue;
    }
    if (/^# /.test(line)) {
      blocks.push(
        <h1
          key={`b${blockKey++}`}
          className="mt-12 mb-5 text-3xl md:text-4xl font-semibold text-[var(--text)] tracking-tight"
        >
          {renderInline(line.slice(2), `h1-${blockKey}`)}
        </h1>
      );
      i++;
      continue;
    }

    // Lists
    if (/^- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={`b${blockKey++}`} className="my-5 space-y-2">
          {items.map((it, idx) => (
            <li
              key={idx}
              className="relative pl-6 text-[var(--text-2)] leading-relaxed"
            >
              <span
                className="absolute left-0 top-[0.65em] h-1.5 w-1.5 rounded-sm bg-[var(--accent)]"
                aria-hidden
              />
              {renderInline(it, `li-${blockKey}-${idx}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push(
        <ol key={`b${blockKey++}`} className="my-5 space-y-2 list-decimal pl-6 marker:text-[var(--accent)] marker:font-mono">
          {items.map((it, idx) => (
            <li key={idx} className="text-[var(--text-2)] leading-relaxed pl-2">
              {renderInline(it, `oli-${blockKey}-${idx}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph: collect contiguous non-blank lines that aren't a block start
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,3}\s|- |```|\d+\.\s)/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    const para = paraLines.join(" ");
    blocks.push(
      <p
        key={`b${blockKey++}`}
        className="my-5 text-[var(--text-2)] leading-[1.75] text-[1.0625rem]"
      >
        {renderInline(para, `p-${blockKey}`)}
      </p>
    );
  }

  return <div className="markdown-body">{blocks}</div>;
}
