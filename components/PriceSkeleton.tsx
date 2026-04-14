'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function PriceSkeleton() {
  return (
    <div className="glass p-6 flex flex-col justify-between h-full overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="w-12 h-4 bg-white/10 rounded animate-pulse" />
        <div className="w-16 h-6 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="mt-4">
        <div className="w-32 h-8 bg-white/10 rounded animate-pulse" />
        <div className="w-20 h-4 bg-white/10 rounded animate-pulse mt-2" />
      </div>
    </div>
  );
}
