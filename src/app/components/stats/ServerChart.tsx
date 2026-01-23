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
      className="w-full h-[280px] bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm relative overflow-hidden"
      translate="no"
    >
      {/* Тонкий технический заголовок в твоем стиле */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-400 text-[8px] uppercase font-black tracking-[0.2em] italic">
          {t.serverPage.statsTitle || "Activity Log"}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-gray-300 text-[7px] font-black uppercase tracking-widest">Live Sync</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            {/* Градиент заливки под оранжевый стиль */}
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
            {/* Линия графика */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="4 4" 
            stroke="#000000" 
            vertical={false} 
            opacity={0.05} 
          />
          
          <XAxis 
            dataKey="time" 
            stroke="#000000" 
            fontSize={8}
            tickLine={false}
            axisLine={false}
            tick={{ opacity: 0.3, fontWeight: 900 }}
            dy={10}
          />
          
          <YAxis 
            stroke="#000000" 
            fontSize={8}
            tickLine={false}
            axisLine={false}
            tick={{ opacity: 0.3, fontWeight: 900 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          
          <Tooltip 
            cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid rgba(0,0,0,0.05)', 
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '900',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '8px 12px'
            }}
            itemStyle={{ color: '#f97316', textTransform: 'uppercase' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '2px', fontSize: '8px' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="players" 
            stroke="url(#lineGradient)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={1500}
            // Сглаживание точек
            activeDot={{ r: 4, strokeWidth: 0, fill: '#f97316' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Декоративный элемент в углу */}
      <div className="absolute bottom-3 right-5 text-[7px] font-black text-gray-200 tracking-tighter uppercase italic">
        Database: Nodes_Primary
      </div>
    </div>
  );
}