import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getActiveListings } from '../../services/marketService';
import { getItemById } from '../../utils/itemUtils';
import ListingRow from './ListingRow';
import SellForm from './SellForm';
import type { MarketListing } from '../../types';

export default function MarketplaceView() {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Viittaus viimeisimpään hakuajankohtaan optimaalisuutta varten
  const lastFetchTime = useRef<number>(0);
  const FETCH_COOLDOWN = 30000; // 30 sekunnin suoja-aika automaattihauille

  const { user } = useAuth();

  const fetchListings = useCallback(async (force = false) => {
    const now = Date.now();

    // Estetään haku, jos cooldown on käynnissä (eikä kyseessä ole pakotettu haku)
    if (!force && now - lastFetchTime.current < FETCH_COOLDOWN) {
      return;
    }

    setLoading(true);
    try {
      const data = await getActiveListings();
      setListings(data);
      lastFetchTime.current = now;
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Haetaan vain, kun tullaan Buy-näkymään ensi kertaa tai cooldown on ohi
  useEffect(() => {
    if (tab === 'buy') {
      fetchListings();
    }
  }, [tab, fetchListings]);

  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    return listings.filter((l) => {
      const item = getItemById(l.itemId);
      return item?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [listings, searchQuery]);

  if (!user)
    return (
      <div className="p-10 text-slate-500 font-mono italic">
        Disconnected...
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans overflow-hidden">
      <div className="p-4 md:p-6 border-b border-white/5 flex flex-col gap-4 shrink-0 bg-slate-900/20">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight uppercase">
              World Relay Market
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-slate-500 font-mono uppercase">
                Status: Connected
              </p>
              {/* REFRESH NAPPI */}
              {tab === 'buy' && (
                <button
                  onClick={() => fetchListings(true)}
                  disabled={loading}
                  className="text-[9px] bg-slate-800 hover:bg-slate-700 text-cyan-400 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                >
                  {loading ? 'SYNCING...' : '⟳ REFRESH RELAY'}
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-1 bg-slate-900 p-1 rounded border border-slate-800">
            {(['buy', 'sell'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                  tab === t
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t === 'buy' ? 'Browse' : 'Distribute'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'buy' && (
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-600 text-xs">🔍</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resource by name..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded px-9 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-600"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'buy' ? (
          <div className="h-full overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex items-center gap-4 px-4 py-2 bg-slate-900/50 border-b border-white/5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
              <span className="w-48">Item Resource</span>
              <span className="hidden md:flex flex-1">Merchant Profile</span>
              <span className="w-32 text-right pr-4">Cost Value</span>
              <span className="w-24"></span>
            </div>

            {loading && listings.length === 0 ? (
              <div className="py-20 text-center text-slate-700 animate-pulse font-mono text-xs uppercase">
                Parsing relay frequencies...
              </div>
            ) : (
              <>
                {filteredListings.map((l) => (
                  <ListingRow
                    key={l.id}
                    listing={l}
                    myUid={user.uid}
                    // MUUTOS: onPurchase ei enää pakota hakua, vaan odottaa refreshia tai cooldownia
                    onPurchase={() => fetchListings(false)}
                  />
                ))}
                {filteredListings.length === 0 && (
                  <div className="py-20 text-center text-slate-600 italic text-sm">
                    {searchQuery
                      ? `No records found for "${searchQuery}"`
                      : 'Relay is silent.'}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <SellForm myUid={user.uid} onComplete={() => setTab('buy')} />
        )}
      </div>
    </div>
  );
}
