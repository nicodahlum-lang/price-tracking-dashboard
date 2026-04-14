'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PriceDisplay from '@/components/PriceDisplay';
import GlowingChart from '@/components/GlowingChart';
import { usePriceFeed } from '@/hooks/usePriceFeed';

export default function Dashboard() {
  const { prices, loading, error } = usePriceFeed();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        if (Array.isArray(data)) setHistory(data);
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
    loadHistory();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400 font-medium tracking-widest uppercase">
      Loading Terminal...
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen text-rose-500 font-medium">
      System Error: {error}
    </div>
  );

  const assets = Object.entries(prices);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-bold tracking-tighter"
          >
            FINTECH<span className="text-emerald-400">.</span>MASTER
          </motion.h1>
          <p className="text-gray-500 mt-2 font-medium">Real-time Institutional Asset Monitoring</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase tracking-widest">System Status</div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            LIVE FEED ACTIVE
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.map(([symbol, data], i) => (
          <motion.div 
            key={symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <PriceDisplay symbol={symbol} current={data.current} previous={data.previous} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold px-2">Market Momentum</h3>
          <GlowingChart 
            data={history} 
            dataKey="price" 
            color="#00FFA3" 
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold px-2">Volatility Index</h3>
          <GlowingChart 
            data={history} 
            dataKey="volatility" 
            color="#FF3B69" 
          />
        </motion.div>
      </div>

      <footer className="pt-12 border-t border-white/5 flex justify-between items-center text-gray-600 text-xs uppercase tracking-widest">
        <div>&copy; 2026 Fintech Masterpiece OS</div>
        <div className="flex gap-4">
          <span>Latency: 12ms</span>
          <span>Encrypted: AES-256</span>
        </div>
      </footer>
    </div>
  );
}
