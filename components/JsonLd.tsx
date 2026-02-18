'use client';

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

type JsonLdProps = {
  data: JsonLdValue;
  id?: string;
};

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
