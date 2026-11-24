/** Builds the per-page head() meta set (title, description, OG + Twitter). */
export function pageMeta(title: string, description: string) {
  const full = `${title} | PaymentHouse`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
