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
  time: string; // Ожидается формат "YYYY-MM-DD HH:mm" или ISO
  players: number;
}

interface ServerChartProps {
  data: ChartPoint[];
}

export default function ServerChart({ data }: ServerChartProps) {
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // 1. Сортируем по времени
    const sorted = [...data].sort((a, b) => 
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    // 2. Берем только последние 24 записи (если данные пишутся раз в час)
    // Либо фильтруем по реальному времени:
    const now = new Date().getTime();
    const dayAgo = now - 24 * 60 * 60 * 1000;

    return sorted.filter(point => new Date(point.time).getTime() >= dayAgo);
  }, [data]);

  // Функция для красивого вывода времени на оси (только часы)
  const formatXAxis = (tickItem: string) => {
    try {
      const date = new Date(tickItem);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return tickItem;
    }
  };

  return (
    <div className="w-full h-[300px] md:h-[350px] bg-[#0b1224] p-4 md:p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      
      <h3 className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em] mb-6 italic">
        {t.serverPage.statsTitle || "Activity (24h)"}
      </h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
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
            tickFormatter={formatXAxis}
            // interval="preserveStartEnd" автоматически скрывает лишние метки на мобилках
            interval={window.innerWidth < 768 ? 4 : 2} 
            dy={10}
          />
          
          <YAxis 
            stroke="#ffffff" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tick={{ opacity: 0.3, fontWeight: 700 }}
            tickFormatter={(value) => value.toLocaleString()}
            domain={[0, 'auto']}
          />
          
          <Tooltip 
            cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }}
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}
            labelFormatter={formatXAxis}
            itemStyle={{ color: '#a78bfa' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="players" 
            stroke="url(#lineGradient)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={1500}
            // Плавное соединение точек
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}