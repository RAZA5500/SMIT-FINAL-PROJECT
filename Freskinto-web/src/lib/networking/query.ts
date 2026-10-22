/**
 * Query string sirf defined values ke saath — khali filter URL mein nahi jata
 * (FLOW-MD 08 §11).
 */
export function withQuery(url: string, params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${url}?${query}` : url;
}
