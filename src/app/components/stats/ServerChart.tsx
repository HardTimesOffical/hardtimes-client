"use client";

import React, { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useLanguage } from "@/context/LanguageContext";

interface ChartPoint {
  time: string;
  players: number;
}

interface ServerChartProps {
  data: ChartPoint[];
}

export default function ServerChart({ data }: ServerChartProps) {
  const { t } = useLanguage();

  // Безопасная сортировка копии массива (исправляет ошибку Read-only)
  const chartData = useMemo(() => {
    return [...data].sort((a, b) => a.time.localeCompare(b.time));
  }, [data]);

  return (
    <div className="w-full h-[320px] bg-[#0b1224] p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Фиолетовая полоска-акцент сверху */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      
      <h3 className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em] mb-6 italic">
        {t.serverPage.statsTitle || "Активность игроков"}
      </h3>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={chartData}>
          <defs>
            {/* Градиент для заливки под линией */}
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            {/* Градиент для самой линии */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="10 10" 
            stroke="#ffffff" 
            vertical={false} 
            opacity={0.03} 
          />
          
          <XAxis 
            dataKey="time" 
            stroke="#ffffff" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tick={{ opacity: 0.3, fontWeight: 700 }}
            dy={10}
          />
          
          <YAxis 
            stroke="#ffffff" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tick={{ opacity: 0.3, fontWeight: 700 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          
          <Tooltip 
            cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }}
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ color: '#a78bfa' }}
            labelStyle={{ color: '#64748b', marginBottom: '4px' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="players" 
            stroke="url(#lineGradient)" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}