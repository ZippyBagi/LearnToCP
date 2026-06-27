/**
 * Renders a JSON-LD structured-data block. Server component — the JSON is
 * serialized at render time and emitted as a <script> tag that search engines
 * read for rich results.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is built from trusted, server-side values only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
