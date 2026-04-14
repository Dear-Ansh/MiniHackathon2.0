import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  score: number;
  size?: number;
}

export default function TrustGauge({ score, size = 180 }: Props) {
  const color = score >= 70 ? 'hsl(var(--trust))' : score >= 40 ? 'hsl(var(--caution))' : 'hsl(var(--danger))';
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75; // 270 degrees
  const offset = arc - (arc * score) / 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={10}
          strokeDasharray={`${arc} ${circ}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={`${arc} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <text
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          className="fill-foreground text-3xl font-bold"
          style={{ fontSize: size * 0.2 }}
        >
          {score}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 16}
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
          style={{ fontSize: size * 0.07 }}
        >
          Trust Score
        </text>
      </svg>
    </div>
  );
}
