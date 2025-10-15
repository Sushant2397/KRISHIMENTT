export type SeedPrice = {
  id: string;
  crop: string;
  variety: string;
  state: string;
  market: string;
  unit: string;
  price: number;
  prevPrice?: number;
  updatedAt: string;
};

// Mock data generator. Used when no real API key is available.
const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton'];
const STATES = ['Maharashtra', 'Punjab', 'Gujarat', 'Karnataka', 'UP'];
const VARIETIES = ['Hybrid', 'Desi', 'High-yield', 'Drought-resistant'];

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomPrice(base = 1000): number { return Math.round((base + (Math.random() - 0.5) * 200) * 100) / 100; }

export async function fetchSeedPrices(): Promise<SeedPrice[]> {
  // Simulate latency
  await new Promise(r => setTimeout(r, 250));
  const now = new Date();
  const items: SeedPrice[] = Array.from({ length: 20 }).map((_, i) => {
    const crop = randomItem(CROPS);
    const state = randomItem(STATES);
    const variety = randomItem(VARIETIES);
    const prev = randomPrice();
    const curr = Math.max(100, Math.round((prev + (Math.random() - 0.5) * 50) * 100) / 100);
    return {
      id: `${now.getTime()}-${i}`,
      crop,
      variety,
      state,
      market: `${state} Mandi ${1 + (i % 5)}`,
      unit: '₹/quintal',
      price: curr,
      prevPrice: prev,
      updatedAt: now.toISOString(),
    };
  });
  return items;
}

export function startPollingPrices(callback: (data: SeedPrice[]) => void, intervalMs = 8000) {
  let cancelled = false;
  const tick = async () => {
    try {
      const data = await fetchSeedPrices();
      if (!cancelled) callback(data);
    } finally {
      if (!cancelled) setTimeout(tick, intervalMs);
    }
  };
  tick();
  return () => { cancelled = true; };
}

// Real API: AGMARKNET via data.gov.in (free key, limited page size for sample key)
const AGMARK_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

type AgmarkFilters = {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  date?: string; // YYYY-MM-DD
  limit?: number;
  offset?: number;
};

function buildAgmarkUrl(apiKey: string, filters: AgmarkFilters = {}): string {
  const params = new URLSearchParams();
  params.set('api-key', apiKey);
  params.set('format', 'json');
  params.set('limit', String(filters.limit ?? 50));
  if (filters.offset != null) params.set('offset', String(filters.offset));
  if (filters.state) params.set('filters[state]', filters.state);
  if (filters.district) params.set('filters[district]', filters.district);
  if (filters.market) params.set('filters[market]', filters.market);
  if (filters.commodity) params.set('filters[commodity]', filters.commodity);
  if (filters.variety) params.set('filters[variety]', filters.variety);
  if (filters.date) params.set('filters[arrival_date]', filters.date);
  return `https://api.data.gov.in/resource/${AGMARK_RESOURCE_ID}?${params.toString()}`;
}

export async function fetchAgmarkPrices(apiKey: string, filters: AgmarkFilters = {}): Promise<SeedPrice[]> {
  const url = buildAgmarkUrl(apiKey, filters);
  const res = await fetch(url);
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`AGMARK request failed: ${res.status} ${errText}`);
  }
  const json = await res.json();
  const records = json?.records ?? [];
  const now = new Date();
  const mapped: SeedPrice[] = records.map((r: any, idx: number) => {
    const price = Number(r?.modal_price ?? r?.max_price ?? r?.min_price ?? 0);
    const prev = Number(r?.min_price ?? price);
    const updatedAt = r?.arrival_date ? new Date(r.arrival_date).toISOString() : now.toISOString();
    return {
      id: `${updatedAt}-${idx}-${r?.market ?? ''}`,
      crop: r?.commodity ?? 'Unknown',
      variety: r?.variety ?? '—',
      state: r?.state ?? r?.state_keyword ?? '—',
      market: r?.market ?? '—',
      unit: '₹/quintal',
      price: isFinite(price) ? price : 0,
      prevPrice: isFinite(prev) ? prev : undefined,
      updatedAt,
    };
  });
  return mapped;
}

export function startPollingAgmark(
  apiKey: string,
  callback: (data: SeedPrice[]) => void,
  filters: AgmarkFilters = {},
  intervalMs = 60000,
) {
  let cancelled = false;
  const tick = async () => {
    try {
      const data = await fetchAgmarkPrices(apiKey, filters);
      if (!cancelled) callback(data);
    } finally {
      if (!cancelled) setTimeout(tick, intervalMs);
    }
  };
  tick();
  return () => { cancelled = true; };
}

