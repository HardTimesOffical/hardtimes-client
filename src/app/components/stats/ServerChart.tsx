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

  const chartData = useMemo(() => {
    return [...data].sort((a, b) => a.time.localeCompare(b.time));
  }, [data]);

  return (
    <div 
      className="w-full h-[280px] bg-card p-5 rounded-lg border border-border shadow-sm relative overflow-hidden"
      translate="no"
    >
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-muted-foreground text-[10px] uppercase font-black tracking-widest">
          {t.serverPage?.statsTitle || "Активность игроков"}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          <span className="text-muted-foreground text-[8px] font-bold uppercase tracking-widest">Синхронизация Live</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="currentColor" 
            vertical={false} 
            className="text-border"
            opacity={0.1} 
          />
          
          <XAxis 
            dataKey="time" 
            stroke="currentColor" 
            className="text-muted-foreground"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            tick={{ opacity: 0.6, fontWeight: 700 }}
            dy={10}
          />
          
          <YAxis 
            stroke="currentColor" 
            className="text-muted-foreground"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            tick={{ opacity: 0.6, fontWeight: 700 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          
          <Tooltip 
            cursor={{ stroke: '#f97316', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              border: '1px solid var(--border)', 
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '800',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '8px 12px'
            }}
            itemStyle={{ color: '#f97316', textTransform: 'uppercase' }}
            labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '9px', fontWeight: 'bold' }}
            // Исправленный форматер для TS
            formatter={(value: number | string) => {
                const numValue = typeof value === 'string' ? parseFloat(value) : value;
                return [numValue, "Игроков"] as [number, string];
            }}
            labelFormatter={(label) => `Время: ${label}`}
          />
          
          <Area 
            type="monotone" 
            dataKey="players" 
            stroke="url(#lineGradient)" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={1000}
            // Убрали несуществующий shadow
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff', fill: '#f97316' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}