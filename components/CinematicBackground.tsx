'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function CinematicBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-1/2 -left-1/2 w-full h-full bg-emerald-500/10 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-rose-500/10 rounded-full blur-[120px]"
      />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:40px_40px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0E11]" />
    </div>
  );
}
