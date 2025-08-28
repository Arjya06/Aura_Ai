
import React from 'react';
import { ANOMALY_THRESHOLD } from '../constants';

interface ScoreGaugeProps {
  score: number;
  title: string;
  isMain?: boolean;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, title, isMain = false }) => {
  const radius = 60;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const progress = circumference * score;

  const getStrokeColor = (value: number) => {
    if (value > ANOMALY_THRESHOLD) return '#ef4444'; // red-500
    if (value > ANOMALY_THRESHOLD / 2) return '#f59e0b'; // amber-500
    return isMain ? '#64ffda' : '#22c55e'; // sentinel-cyan or green-500
  };

  const color = getStrokeColor(score);
  const percentage = Math.round(score * 100);

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-sentinel-blue-deep h-full">
      <div className="relative w-40 h-20 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 144 72">
          {/* Background Arc */}
          <path
            d={`M ${strokeWidth/2 + 2},68 A ${radius},${radius} 0 0 1 ${144 - (strokeWidth/2 + 2)},68`}
            fill="none"
            stroke="#334155"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d={`M ${strokeWidth/2 + 2},68 A ${radius},${radius} 0 0 1 ${144 - (strokeWidth/2 + 2)},68`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out' }}
          />
        </svg>
        <div className="absolute bottom-0 w-full text-center">
            <span className={`text-3xl font-bold`} style={{ color }}>{percentage}</span>
            <span className="text-xl text-sentinel-gray">%</span>
        </div>
      </div>
      <h3 className={`mt-2 text-center font-semibold ${isMain ? 'text-sentinel-light-gray' : 'text-sentinel-gray'}`}>
        {title}
      </h3>
    </div>
  );
};

export default ScoreGauge;
