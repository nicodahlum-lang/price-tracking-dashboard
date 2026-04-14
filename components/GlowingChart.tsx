'use client';
import React, { useEffect, useRef } from 'react';
import { createChart, Color, IChartApi, ISeriesApi, AreaSeries } from 'lightweight-charts';

interface GlowingChartProps {
  data: any[];
  dataKey: string;
  color: string;
}

export default function GlowingChart({ data, dataKey, color }: GlowingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        backgroundColor: 'transparent',
        textColor: '#707a8a',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
    });

    const areaSeries = chart.addAreaSeries({
      lineColor: color,
      topColor: `${color}44`, // Low opacity
      bottomColor: `${color}00`, // Fully transparent
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 2,
      },
    });

    // Prepare data
    const formattedData = data
      .map(d => ({
        time: new Date(d.time).getTime() / 1000,
        value: d[dataKey],
      }))
      .sort((a, b) => a.time - b.time);

    areaSeries.setData(formattedData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update data when prop changes
  useEffect(() => {
    if (!seriesRef.current || !data) return;
    
    const formattedData = data
      .map(d => ({
        time: new Date(d.time).getTime() / 1000,
        value: d[dataKey],
      }))
      .sort((a, b) => a.time - b.time);
      
    seriesRef.current.setData(formattedData);
  }, [data, dataKey]);

  return (
    <div className="glass p-6 h-full w-full min-h-[300px] relative overflow-hidden">
      <div ref={chartContainerRef} className="w-full h-full" />
      {/* Visual overlay to maintain the 'glowing' effect */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]" />
    </div>
  );
}
