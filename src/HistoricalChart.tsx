import React from 'react';
import { Features } from '../types';

interface HistoricalChartProps {
  history: Features[];
}

const getPathD = (data: number[], width: number, height: number, range: {min: number, max: number}) => {
  if (data.length < 2 || range.max === range.min) return `M 0,${height}`;
  
  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * width : 0;
    const yValue = Math.max(range.min, Math.min(range.max, d)); // Clamp value to range
    const y = height - ((yValue - range.min) / (range.max - range.min)) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return `M ${points[0]} L ${points.slice(1).join(' ')}`;
};

const HistoricalChart: React.FC<HistoricalChartProps> = ({ history }) => {
  const width = 500;
  const height = 150;
  
  const typingSpeedData = history.map(h => h.typingSpeed);
  const swipeIntensityData = history.map(h => h.swipeIntensity);
  
  // Dynamic ranges for y-axis with sensible defaults
  const speedRange = { min: 0, max: Math.max(25, ...typingSpeedData) };
  const intensityRange = { min: 0, max: Math.max(4, ...swipeIntensityData) };

  const typingPath = getPathD(typingSpeedData, width, height, speedRange);
  const intensityPath = getPathD(swipeIntensityData, width, height, intensityRange);

  return (
    <div>
      <h3 className="text-lg font-bold text-sentinel-light-gray mb-4">Behavioral Metrics Over Time</h3>
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="typingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64ffda" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#64ffda" stopOpacity="0"/>
            </linearGradient>
             <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(v => (
             <line key={v} x1="0" y1={v * height} x2={width} y2={v * height} stroke="#1e293b" strokeWidth="1" />
          ))}

          {/* Paths */}
          <path d={typingPath} fill="none" stroke="#64ffda" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <path d={`${typingPath} L ${width},${height} L 0,${height} Z`} fill="url(#typingGradient)" />
          
          <path d={intensityPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <path d={`${intensityPath} L ${width},${height} L 0,${height} Z`} fill="url(#intensityGradient)" />
        </svg>
      </div>
      <div className="flex items-center justify-end space-x-4 mt-2 text-xs">
          <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-sentinel-cyan rounded-sm"></div>
              <span className="text-sentinel-gray">Typing Speed (cps)</span>
          </div>
          <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
              <span className="text-sentinel-gray">Swipe Intensity</span>
          </div>
      </div>
    </div>
  );
};

export default HistoricalChart;
