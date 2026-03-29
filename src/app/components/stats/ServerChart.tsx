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

// ── Константа бренда ─────────────────────────────────────────
const BRAND = "#84a98c";

interface ChartPoint {
  time: string;
  players: number;
}

interface ServerChartProps {
  data: ChartPoint[];
}

// ── Кастомный тултип ─────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1e211f",
        border: "1px solid rgba(132,169,140,0.25)",
        padding: "8px 12px",
      }}
    >
      <p
        style={{
          color: "#7d8581",
          fontFamily: "inherit",
          fontSize: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "4px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          color: BRAND,
          fontFamily: "inherit",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 700,
        }}
      >
        {payload[0]?.value ?? 0} игроков
      </p>
    </div>
  );
};

// ── Утилита: парсим время из строки типа "HH:MM" или ISO ─────
function parseTime(timeStr: string): number {
  // Пробуем ISO / полную дату
  const iso = new Date(timeStr);
  if (!isNaN(iso.getTime())) return iso.getTime();

  // Пробуем "HH:MM" — добавляем сегодняшнюю дату
  const hmMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (hmMatch) {
    const now = new Date();
    const candidate = new Date(
      now.getFullYear(), now.getMonth(), now.getDate(),
      parseInt(hmMatch[1]), parseInt(hmMatch[2])
    );
    // Если время "впереди" — это вчерашняя точка
    if (candidate.getTime() > now.getTime()) {
      candidate.setDate(candidate.getDate() - 1);
    }
    return candidate.getTime();
  }

  return 0;
}

// ── Форматируем метку оси X ───────────────────────────────────
function formatLabel(timeStr: string): string {
  const t = parseTime(timeStr);
  if (!t) return timeStr;
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ServerChart({ data }: ServerChartProps) {
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    const now = Date.now();
    const cutoff = now - 24 * 60 * 60 * 1000; // 24 часа назад

    return data
      .map(point => ({
        ...point,
        _ts: parseTime(point.time),
        label: formatLabel(point.time),
      }))
      // Фильтруем точки старше 24 часов (если метки — полные даты)
      // Если метки "HH:MM" — парсим с учётом "вчера", фильтр всё равно корректен
      .filter(point => point._ts === 0 || point._ts >= cutoff)
      // Сортируем по реальному времени, не лексикографически
      .sort((a, b) => a._ts - b._ts);
  }, [data]);

  const maxPlayers = useMemo(
    () => Math.max(...chartData.map(p => p.players), 1),
    [chartData]
  );

  return (
    <div className="w-full" translate="no">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 flex-shrink-0" style={{ background: BRAND }} />
          <span
            className="font-mc-pixel text-[9px] uppercase tracking-widest"
            style={{ color: BRAND }}
          >
            {t?.serverPage?.statsTitle || "Активность игроков"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#6fcf97",
              boxShadow: "0 0 6px rgba(111,207,151,0.5)",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            className="font-mc-pixel text-[8px] uppercase tracking-widest"
            style={{ color: "#7d8581" }}
          >
            Live • 24ч
          </span>
        </div>
      </div>

      {/* Пик онлайна */}
      <div className="flex gap-4 mb-4">
        <div>
          <p className="font-mc-pixel text-[8px] uppercase tracking-widest mb-0.5" style={{ color: "#7d8581" }}>
            Пик онлайна
          </p>
          <p className="font-mc-pixel text-sm" style={{ color: "#f2f2f2" }}>
            {maxPlayers}
          </p>
        </div>
        <div>
          <p className="font-mc-pixel text-[8px] uppercase tracking-widest mb-0.5" style={{ color: "#7d8581" }}>
            Точек данных
          </p>
          <p className="font-mc-pixel text-sm" style={{ color: "#f2f2f2" }}>
            {chartData.length}
          </p>
        </div>
      </div>

      {/* График */}
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
          >
            <defs>
              <linearGradient id="brandFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={BRAND} stopOpacity={0.18} />
                <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              stroke="transparent"
              fontSize={8}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#7d8581", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.05em" }}
              dy={8}
              // Показываем не все метки чтобы не было каши
              interval="preserveStartEnd"
            />

            <YAxis
              stroke="transparent"
              fontSize={8}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#7d8581", fontFamily: "inherit", fontWeight: 700 }}
              tickFormatter={(v) => v === 0 ? "" : String(v)}
              allowDecimals={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: `${BRAND}50`, strokeWidth: 1, strokeDasharray: "4 4" }}
            />

            <Area
              type="monotone"
              dataKey="players"
              stroke={BRAND}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#brandFill)"
              animationDuration={800}
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: "#161817",
                fill: BRAND,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}