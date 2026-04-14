'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendUp, TrendDown } from '@phosphor-icons/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    
    const timer = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(timer);
  }, [current, previous]);

  const delta = current - previous;
  const isPositive = delta >= 0;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "liquid-glass p-6 flex flex-col justify-between h-full relative overflow-hidden cursor-pointer transition-all duration-300",
        isPositive ? "glow-shadow-green" : "glow-shadow-red"
      )}
    >
      {/* Sophisticated Flash Effect Layer */}
      <AnimatePresence>
        {flash && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 pointer-events-none z-0",
              flash === 'up' ? 'bg-emerald-500' : 'bg-rose-500'
            )}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-start relative z-10">
        <span className="text-gray-400 font-semibold text-[10px] tracking-[0.2em] uppercase">
          Asset Intelligence: {symbol}
        </span>
        <div className={cn(
          "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight",
          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
        )}>
          {isPositive ? <TrendUp size={10} weight="bold" /> : <TrendDown size={10} weight="bold" />}
          {Math.abs((delta / previous) * 100).toFixed(2)}%
        </div>
      </div>
      
      <div className="mt-6 relative z-10">
        <motion.div 
          key={current}
          initial={{ opacity: 0.9, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "text-3xl font-bold tracking-tighter",
            isPositive ? 'neon-green' : 'neon-red'
          )}
        >
          ${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </motion.div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600 text-[10px] uppercase tracking-wider">Baseline Reference</span>
          <span className="text-gray-500 text-[11px] font-medium">
            ${previous.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
