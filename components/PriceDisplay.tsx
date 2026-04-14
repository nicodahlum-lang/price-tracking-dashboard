'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PriceDisplayProps {
  symbol: string;
  current: number;
  previous: number;
}

export default function PriceDisplay({ symbol, current, previous }: PriceDisplayProps) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  
  useEffect(() => {
    if (current > previous) setFlash('up');
    else if (current < previous) setFlash('down');
    
    const timer = setTimeout(() => setFlash(null), 500);
    return () => clearTimeout(timer);
  }, [current, previous]);

  const delta = current - previous;
  const isPositive = delta >= 0;

  return (
    <div className="glass p-6 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Flash Effect Layer */}
      <AnimatePresence>
        {flash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 pointer-events-none ${flash === 'up' ? 'bg-emerald-500' : 'bg-rose-500'}`}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-start relative z-10">
        <span className="text-gray-400 font-medium text-sm tracking-wider uppercase">{symbol}</span>
        <div className={`px-2 py-1 rounded text-xs font-bold ${isPositive ? 'bg-emerald-500/20 text-[#00FFA3]' : 'bg-rose-500/20 text-[#FF3B69]'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs((delta / previous) * 100).toFixed(2)}%
        </div>
      </div>
      
      <div className="mt-4 relative z-10">
        <motion.div 
          key={current}
          initial={{ opacity: 0.8, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-3xl font-bold tracking-tight ${isPositive ? 'neon-green' : 'neon-red'}`}
        >
          ${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </motion.div>
        <div className="text-gray-500 text-xs mt-1">
          Prev: ${previous.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}
