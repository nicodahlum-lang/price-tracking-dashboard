'use client';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type PriceData = {
  [key: string]: { current: number; previous: number };
};

const SYMBOLS_MAP: Record<string, string> = {
  'BTCUSDT': 'BTC',
  'ETHUSDT': 'ETH',
  'BNBUSDT': 'BNB',
  'SOLUSDT': 'SOL',
};

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/stream?streams=' + 
  Object.keys(SYMBOLS_MAP).map(s => `${s.toLowerCase()}@ticker`).join('/');

async function fetchInitialPrices(): Promise<PriceData> {
  const res = await fetch('/api/prices/live');
  if (!res.ok) throw new Error('Price fetch failed');
  const data = await res.json();
  
  const priceMap: PriceData = {};
  Object.entries(data).forEach(([symbol, price]) => {
    const currentPrice = typeof price === 'number' ? price : (price as any).price;
    priceMap[symbol] = {
      current: currentPrice,
      previous: currentPrice
    };
  });
  return priceMap;
}

export function usePriceFeed() {
  const queryClient = useQueryClient();

  const { data: prices, isLoading, error } = useQuery({
    queryKey: ['prices'],
    queryFn: fetchInitialPrices,
    staleTime: Infinity, // Let WebSocket handle updates
  });

  useEffect(() => {
    const ws = new WebSocket(BINANCE_WS_URL);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const data = msg.data;
      const binanceSymbol = data.s;
      const currentPrice = parseFloat(data.c);
      const label = SYMBOLS_MAP[binanceSymbol];

      if (label) {
        queryClient.setQueryData<PriceData>(['prices'], (old) => {
          if (!old) return old;
          return {
            ...old,
            [label]: {
              current: currentPrice,
              previous: old[label]?.current || currentPrice
            }
          };
        });
      }
    };

    ws.onerror = (err) => {
      console.error('Binance WebSocket Error:', err);
    };

    return () => ws.close();
  }, [queryClient]);

  return { 
    prices: prices || {}, 
    loading: isLoading, 
    error: error instanceof Error ? error.message : null 
  };
}
