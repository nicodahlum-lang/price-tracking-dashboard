'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PriceDisplay from '@/components/PriceDisplay';
import GlowingChart from '@/components/GlowingChart';
import PriceSkeleton from '@/components/PriceSkeleton';
import ChartSkeleton from '@/components/ChartSkeleton';
import CinematicBackground from '@/components/CinematicBackground';
import { usePriceFeed } from '@/hooks/usePriceFeed';
import { ShieldCheck, Activity, Zap, Globe } from '@phosphor-icons/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  },
};

export default function Dashboard() {
  const { prices, loading, error } = usePriceFeed();
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        if (Array.isArray(data)) setHistory(data);
      } catch (e) {
        console.error('Failed to load history', e);
      } finally {
        setHistoryLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (error) return (
    <div className="flex items-center justify-center min-h-screen text-rose-500 font-bold tracking-tighter text-2xl">
      SYSTEM_CRITICAL_ERROR: {error}
    </div>
  );

  const assets = Object.entries(prices);

  return (
    <div className="relative min-h-screen p-6 md:p-12 max-w-[1600px] mx-auto font-sans text-white">
      <CinematicBackground />

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
      >
        <div>
          <motion.h1 
            className="text-6xl md:text-7xl font-extrabold tracking-tighter italic"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            QUANT<span className="text-emerald-400">CORE</span>
          </motion.h1>
          <motion.p 
            className="text-gray-500 mt-3 font-medium tracking-wide uppercase text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Institutional Intelligence & Real-time Asset Analytics
          </motion.p>
        </div>
        <div className="flex gap-4 text-right">
          <div className="liquid-glass px-4 py-2 flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest">Network Latency</span>
              <span className="text-xs font-bold text-emerald-400">12ms</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest">Uptime</span>
              <span className="text-xs font-bold text-emerald-400">99.99%</span>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* Main Asset Intelligence Feed - Large Bento Card */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <PriceSkeleton key={i} />)
          ) : (
            assets.map(([symbol, data], i) => (
              <PriceDisplay key={symbol} symbol={symbol} current={data.current} previous={data.previous} />
            ))
          )}
        </motion.div>

        {/* System Metrics - Small Bento Card */}
        <motion.div variants={itemVariants} className="md:col-span-4 space-y-6">
          <div className="liquid-glass p-6 h-full flex flex-col justify-center items-center text-center space-y-4">
            <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-400">
              <ShieldCheck size={40} weight="duotone" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Security Protocol</h3>
              <p className="text-gray-500 text-xs mt-1">AES-256 Hardware Encryption Active</p>
            </div>
            <div className="w-full h-px bg-white/5" />
            <div className="flex justify-between w-full text-[10px] uppercase tracking-widest font-bold text-gray-600">
              <span>Node: Tokyo-01</span>
              <span>Sovereign Layer</span>
            </div>
          </div>
        </motion.div>

        {/* Market Momentum - Medium/Large Bento Card */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-7 space-y-4"
        >
          <div className="flex items-center gap-2 px-2">
            <Activity size={20} className="text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Market Momentum Analysis</h3>
          </div>
          {historyLoading ? <ChartSkeleton /> : (
            <div className="h-[400px]">
              <GlowingChart 
                data={history} 
                dataKey="price" 
                color="#00FFA3" 
              />
            </div>
          )}
        </motion.div>

        {/* Volatility Index - Medium Bento Card */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-5 space-y-4"
        >
          <div className="flex items-center gap-2 px-2">
            <Zap size={20} className="text-rose-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Volatility Matrix</h3>
          </div>
          {historyLoading ? <ChartSkeleton /> : (
            <div className="h-[400px]">
              <GlowingChart 
                data={history} 
                dataKey="volatility" 
                color="#FF3B69" 
              />
            </div>
          )}
        </motion.div>

        {/* Global Reach - Small Bento Card */}
        <motion.div variants={itemVariants} className="md:col-span-4 liquid-glass p-6 flex flex-col justify-between h-48 overflow-hidden relative group cursor-pointer">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={18} className="text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-tighter">Global Liquidity</span>
            </div>
            <p className="text-2xl font-bold tracking-tighter">Aggregated Feed</p>
            <p className="text-gray-500 text-[10px] mt-1">Syncing 14 Institutional Exchanges</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <Globe size={120} weight="bold" />
          </div>
        </motion.div>

        {/* Performance Stats - Small Bento Card */}
        <motion.div variants={itemVariants} className="md:col-span-4 liquid-glass p-6 flex flex-col justify-between h-48 group cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-white/5 rounded-lg">
              <Activity size={20} className="text-gray-400" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">STABLE</span>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest">Core Processing</p>
            <p className="text-2xl font-bold tracking-tighter">0.42ms <span className="text-sm font-normal text-gray-600">avg</span></p>
          </div>
        </motion.div>

        {/* Legal/Compliance - Small Bento Card */}
        <motion.div variants={itemVariants} className="md:col-span-4 liquid-glass p-6 flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-white/5 rounded-lg">
              <ShieldCheck size={20} className="text-gray-400" />
            </div>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">SEC COMPLIANT</span>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest">Compliance Layer</p>
            <p className="text-2xl font-bold tracking-tighter">ISO-27001</p>
          </div>
        </motion.div>
      </motion.div>

      <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-[10px] uppercase tracking-[0.2em] font-medium">
        <div>&copy; 2026 QuantCore OS // Terminal v4.2.0-alpha</div>
        <div className="flex gap-8">
          <span className="hover:text-white transition-colors cursor-pointer">System Logs</span>
          <span className="hover:text-white transition-colors cursor-pointer">API Documentation</span>
          <span className="hover:text-white transition-colors cursor-pointer">Quantum Encryption</span>
        </div>
      </footer>
    </div>
  );
}
