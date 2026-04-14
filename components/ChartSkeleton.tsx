'use client';
import React from 'react';

export default function ChartSkeleton() {
  return (
    <div className="glass p-6 h-full w-full min-h-[300px] flex items-center justify-center">
      <div className="w-full h-full bg-white/5 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-gray-600 text-xs uppercase tracking-widest">Initializing Data Feed...</span>
      </div>
    </div>
  );
}
