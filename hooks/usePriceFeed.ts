'use client';
import { useState, useEffect } from 'react';

export function usePriceFeed() {
  const [prices, setPrices] = useState<{ [key: string]: { current: number; previous: number } }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/prices/live');
      if (!res.ok) throw new Error('Price fetch failed');
      const data = await res.json();
      
      setPrices(prev => {
        const next = { ...prev };
        Object.entries(data).forEach(([symbol, price]) => {
          const currentPrice = typeof price === 'number' ? price : (price as any).price;
          next[symbol] = {
            current: currentPrice,
            previous: prev[symbol]?.current || currentPrice
          };
        });
        return next;
      });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 12000);
    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error };
}
