// import React, { useEffect, useMemo, useState } from 'react';
// import Header from '../components/Common/Header';
// import { startPollingPrices, startPollingAgmark } from '../services/seedPriceService.ts';

// const Arrow = ({ diff }) => {
//   if (diff > 0) return <span className="text-green-600">▲ {diff.toFixed(2)}</span>;
//   if (diff < 0) return <span className="text-red-600">▼ {Math.abs(diff).toFixed(2)}</span>;
//   return <span className="text-gray-500">—</span>;
// };

// const MarketPrices = () => {
//   const [data, setData] = useState([]);
//   const [query, setQuery] = useState('');
//   const [crop, setCrop] = useState('');
//   const [state, setState] = useState('');
//   const [variety, setVariety] = useState('');

//   useEffect(() => {
//     // If you prefer the free sample API key from data.gov.in, paste it here.
//     // Sample key is limited to 10 records; replace with your own for more.
//     const sampleKey = import.meta.env.VITE_AGMARK_API_KEY;
//     const stop = startPollingAgmark(SAMPLE_KEY, setData, {}, 30000); // every 30s
//     return stop;
//   }, []);

//   const filtered = useMemo(() => {
//     return data.filter((r) => (
//       (!query || r.market.toLowerCase().includes(query.toLowerCase())) &&
//       (!crop || r.crop === crop) &&
//       (!state || r.state === state) &&
//       (!variety || r.variety === variety)
//     ));
//   }, [data, query, crop, state, variety]);

//   const crops = useMemo(() => Array.from(new Set(data.map(d => d.crop))), [data]);
//   const states = useMemo(() => Array.from(new Set(data.map(d => d.state))), [data]);
//   const varieties = useMemo(() => Array.from(new Set(data.map(d => d.variety))), [data]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <main className="max-w-7xl mx-auto p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">Real-time Seed Prices</h1>
//           <span className="text-sm text-gray-600">Auto-updating every ~8s</span>
//         </div>

//         <div className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//           <input className="border rounded px-3 py-2" placeholder="Search market..." value={query} onChange={e => setQuery(e.target.value)} />
//           <select className="border rounded px-3 py-2" value={crop} onChange={e => setCrop(e.target.value)}>
//             <option value="">All Crops</option>
//             {crops.map(c => <option key={c} value={c}>{c}</option>)}
//           </select>
//           <select className="border rounded px-3 py-2" value={state} onChange={e => setState(e.target.value)}>
//             <option value="">All States</option>
//             {states.map(s => <option key={s} value={s}>{s}</option>)}
//           </select>
//           <select className="border rounded px-3 py-2" value={variety} onChange={e => setVariety(e.target.value)}>
//             <option value="">All Varieties</option>
//             {varieties.map(v => <option key={v} value={v}>{v}</option>)}
//           </select>
//         </div>

//         <div className="bg-white rounded-xl shadow overflow-x-auto">
//           <table className="min-w-full text-left text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-4">Crop</th>
//                 <th className="py-2 px-4">Variety</th>
//                 <th className="py-2 px-4">State</th>
//                 <th className="py-2 px-4">Market</th>
//                 <th className="py-2 px-4">Price</th>
//                 <th className="py-2 px-4">Change</th>
//                 <th className="py-2 px-4">Updated</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((row) => {
//                 const diff = (row.price ?? 0) - (row.prevPrice ?? row.price ?? 0);
//                 return (
//                   <tr key={row.id} className="border-t">
//                     <td className="py-2 px-4">{row.crop}</td>
//                     <td className="py-2 px-4">{row.variety}</td>
//                     <td className="py-2 px-4">{row.state}</td>
//                     <td className="py-2 px-4">{row.market}</td>
//                     <td className="py-2 px-4 font-medium">₹{row.price.toFixed(2)} <span className="text-gray-500 text-xs">{row.unit}</span></td>
//                     <td className="py-2 px-4"><Arrow diff={diff} /></td>
//                     <td className="py-2 px-4 text-gray-500">{new Date(row.updatedAt).toLocaleTimeString()}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MarketPrices;


import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Common/Header';
import { startPollingAgmark } from '../services/seedPriceService.ts';
import { useTranslation } from 'react-i18next';
import { Search, TrendingUp, TrendingDown, Minus, Sprout } from 'lucide-react';

const Arrow = ({ diff }) => {
  if (diff > 0) return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700"><TrendingUp className="h-3.5 w-3.5" />{diff.toFixed(2)}</span>;
  if (diff < 0) return <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 font-medium text-rose-700"><TrendingDown className="h-3.5 w-3.5" />{Math.abs(diff).toFixed(2)}</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground"><Minus className="h-3.5 w-3.5" />—</span>;
};

const MarketPrices = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [crop, setCrop] = useState('');
  const [state, setState] = useState('');
  const [variety, setVariety] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const apiKey = import.meta.env.VITE_AGMARK_API_KEY;
    if (!apiKey) {
      setLoadError(t('Market data is unavailable because the data service is not configured.'));
      return undefined;
    }
    const stop = startPollingAgmark(apiKey, (prices) => {
      setData(prices);
      setLoadError('');
    }, {}, 30000, (error) => setLoadError(error.message));
    return stop;
  }, [t]);

  const filtered = useMemo(() => {
    return data.filter((r) =>
      (!query || r.market.toLowerCase().includes(query.toLowerCase())) &&
      (!crop || r.crop === crop) &&
      (!state || r.state === state) &&
      (!variety || r.variety === variety)
    );
  }, [data, query, crop, state, variety]);

  const crops = useMemo(() => Array.from(new Set(data.map(d => d.crop))), [data]);
  const states = useMemo(() => Array.from(new Set(data.map(d => d.state))), [data]);
  const varieties = useMemo(() => Array.from(new Set(data.map(d => d.variety))), [data]);

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {loadError && (
          <p role="alert" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {loadError}
          </p>
        )}
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-primary"><Sprout className="h-4 w-4" />{t('marketPrices.market')}</div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t('marketPrices.title')}</h1>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />{t('marketPrices.autoUpdate')}</span>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:grid-cols-4">
          <input
            className="form-input"
            aria-label={t('marketPrices.searchPlaceholder')}
            placeholder={t('marketPrices.searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select className="form-input" aria-label={t('marketPrices.allCrops')} value={crop} onChange={e => setCrop(e.target.value)}>
            <option value="">{t('marketPrices.allCrops')}</option>
            {crops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-input" aria-label={t('marketPrices.allStates')} value={state} onChange={e => setState(e.target.value)}>
            <option value="">{t('marketPrices.allStates')}</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="form-input" aria-label={t('marketPrices.allVarieties')} value={variety} onChange={e => setVariety(e.target.value)}>
            <option value="">{t('marketPrices.allVarieties')}</option>
            {varieties.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#F1E8D8]/55 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2 px-4">{t('marketPrices.crop')}</th>
                <th className="py-2 px-4">{t('marketPrices.variety')}</th>
                <th className="py-2 px-4">{t('marketPrices.state')}</th>
                <th className="py-2 px-4">{t('marketPrices.market')}</th>
                <th className="py-2 px-4">{t('marketPrices.price')}</th>
                <th className="py-2 px-4">{t('marketPrices.change')}</th>
                <th className="py-2 px-4">{t('marketPrices.updated')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const diff = (row.price ?? 0) - (row.prevPrice ?? row.price ?? 0);
                return (
                  <tr key={row.id} className="border-t border-border/70 transition-colors hover:bg-[#F1E8D8]/25">
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-foreground">{row.crop}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">{row.variety}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">{row.state}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-medium text-foreground">{row.market}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-primary">
                      ₹{row.price.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-muted-foreground">{row.unit}</span>
                    </td>
                    <td className="py-2 px-4"><Arrow diff={diff} /></td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">{new Date(row.updatedAt).toLocaleTimeString()}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-14 text-center text-muted-foreground"><Search className="mx-auto mb-3 h-8 w-8 text-primary/50" />{t('marketPrices.noResults', 'No market prices match these filters.')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
