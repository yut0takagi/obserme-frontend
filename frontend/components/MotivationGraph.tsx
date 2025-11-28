
import React, { useMemo } from 'react';
import { DiaryEntry } from '../types';

interface MotivationGraphProps {
  entries: DiaryEntry[];
  days?: number; // 表示する日数
  height?: number;
}

export const MotivationGraph = ({ entries, days = 14, height = 200 }: MotivationGraphProps) => {
  const data = useMemo(() => {
    // 直近N日分の日付を生成
    const result = [];
    const today = new Date();
    
    // エントリをMap化して高速検索
    const entryMap = new Map<string, number>();
    entries.forEach(e => {
        // 同じ日に複数ある場合は最新（または平均）を取る簡易ロジック
        if (!entryMap.has(e.date)) {
            entryMap.set(e.date, e.moodScore);
        }
    });

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      
      result.push({
        date: dateStr,
        label,
        // データがない日は直前のデータを引き継ぐか、nullにするか。
        // ここではnullにして線をつながない、または50（中立）にするなどの処理が必要
        // 今回はデータが存在するポイントのみでグラフを描画するためにフィルタリングするアプローチをとる
        score: entryMap.get(dateStr)
      });
    }
    return result;
  }, [entries, days]);

  // スコアが存在するデータポイントのみ抽出
  const points = data.filter(d => d.score !== undefined) as { date: string, label: string, score: number }[];

  if (points.length < 2) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        データが不足しています（最低2日分必要です）
      </div>
    );
  }

  // SVG描画用の計算
  const width = 1000; // 内部座標系
  const paddingX = 40;
  const paddingY = 20;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // X座標の計算
  const getX = (index: number) => {
    return paddingX + (index / (points.length - 1)) * graphWidth;
  };

  // Y座標の計算 (0-100) -> (height - 0)
  const getY = (score: number) => {
    return paddingY + graphHeight - (score / 100) * graphHeight;
  };

  // Pathの生成
  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.score)}`
  ).join(' ');

  // Gradient用のArea Path
  const areaD = `
    ${pathD}
    L ${getX(points.length - 1)} ${height - paddingY}
    L ${getX(0)} ${height - paddingY}
    Z
  `;

  return (
    <div className="w-full h-full min-h-[200px] select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines (Horizontal) */}
        {[0, 25, 50, 75, 100].map(val => (
          <line 
            key={val}
            x1={paddingX} 
            y1={getY(val)} 
            x2={width - paddingX} 
            y2={getY(val)} 
            stroke="currentColor" 
            className="text-gray-200 dark:text-gray-700" 
            strokeWidth="1" 
            strokeDasharray="4 4"
          />
        ))}

        {/* Area Fill */}
        <path d={areaD} fill="url(#gradient)" />

        {/* Line Graph */}
        <path 
          d={pathD} 
          fill="none" 
          stroke="currentColor" 
          className="text-indigo-500" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <g key={i} className="group">
            <circle 
              cx={getX(i)} 
              cy={getY(p.score)} 
              r="4" 
              className="fill-white dark:fill-gray-800 stroke-indigo-500 stroke-2 transition-all group-hover:r-6" 
            />
            {/* Tooltip-like Label */}
            <text 
              x={getX(i)} 
              y={getY(p.score) - 15} 
              textAnchor="middle" 
              className="text-xs fill-gray-600 dark:fill-gray-300 opacity-0 group-hover:opacity-100 transition-opacity font-bold"
            >
              {p.score}
            </text>
            
            {/* X Axis Label */}
            <text 
              x={getX(i)} 
              y={height - 2} 
              textAnchor="middle" 
              className="text-[10px] fill-gray-400 dark:fill-gray-500"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
