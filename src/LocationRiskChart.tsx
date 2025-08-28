import React from 'react';
import { Features } from '../types';

interface LocationRiskChartProps {
  history: Features[];
}

const getRiskColor = (risk: 'low' | 'medium' | 'high'): string => {
  switch (risk) {
    case 'high':
      return '#ef4444'; // red-500
    case 'medium':
      return '#f59e0b'; // amber-500
    case 'low':
    default:
      return '#22c55e'; // green-500
  }
};

const LocationRiskChart: React.FC<LocationRiskChartProps> = ({ history }) => {
  const width = 500;
  const height = 40;
  const barWidth = history.length > 0 ? width / history.length : 0;

  return (
    <div>
      <h3 className="text-lg font-bold text-sentinel-light-gray mb-4">Location Risk Over Time</h3>
      <div className="relative bg-sentinel-blue-light rounded">
        {history.length > 0 ? (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {history.map((feature, index) => (
              <rect
                key={index}
                x={index * barWidth}
                y={0}
                width={barWidth}
                height={height}
                fill={getRiskColor(feature.locationRisk)}
                shapeRendering="crispEdges"
              >
                <title>{`Event ${index + 1}: ${feature.locationRisk} risk`}</title>
              </rect>
            ))}
          </svg>
        ) : (
          <div className="flex items-center justify-center h-10 text-sm text-sentinel-gray">
              No historical data available.
          </div>
        )}
      </div>
       <div className="flex items-center justify-end space-x-4 mt-2 text-xs">
          <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span className="text-sentinel-gray">Low Risk</span>
          </div>
           <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
              <span className="text-sentinel-gray">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span className="text-sentinel-gray">High Risk</span>
          </div>
      </div>
    </div>
  );
};

export default LocationRiskChart;
