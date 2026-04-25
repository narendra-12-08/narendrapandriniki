import type { ReactElement } from "react";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
};

/**
 * Renders a JSON-LD <script> tag for structured data.
 * Server component — safe to render anywhere in the tree.
 */
export default function JsonLd({ data, id }: JsonLdProps): ReactElement {
  return (
    <script
      type="application/ld+json"
      id={id}
      // JSON.stringify is safe — schema.org payloads are author-controlled.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
