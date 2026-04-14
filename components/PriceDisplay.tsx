'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface PriceDisplayProps {
  symbol: string;
  current: number;
  previous: number;
}

export default function PriceDisplay({ symbol, current, previous }: PriceDisplayProps) {
  const delta = current - previous;
  const isPositive = delta >= 0;

  return (
    <div className="glass p-6 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <span className="text-gray-400 font-medium text-sm tracking-wider uppercase">{symbol}</span>
        <div className={`px-2 py-1 rounded text-xs font-bold ${isPositive ? 'bg-emerald-500/20 text-[#00FFA3]' : 'bg-rose-500/20 text-[#FF3B69]'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs((delta / previous) * 100).toFixed(2)}%
        </div>
      </div>
      
      <div className="mt-4">
        <motion.div 
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
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
