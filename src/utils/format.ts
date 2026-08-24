export function formatCurrency(value: number): string {
  const formatted = Math.round(value).toLocaleString('pt-BR');
  return `R$ ${formatted}`;
}

export function cleanStoreUrl(url?: string): { fullUrl: string; displayLabel: string } | null {
  if (!url || !url.trim()) return null;
  let fullUrl = url.trim();
  if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
    fullUrl = `https://${fullUrl}`;
  }

  try {
    const parsed = new URL(fullUrl);
    let host = parsed.hostname.replace(/^www\./, '');
    return {
      fullUrl,
      displayLabel: `${host} ↗`,
    };
  } catch {
    return {
      fullUrl,
      displayLabel: `${fullUrl} ↗`,
    };
  }
}
