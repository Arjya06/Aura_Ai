import React from 'react';

interface DistributionPlotProps {
  label: string;
  value: number;
  unit: string;
  normalRange: { min: number; max: number };
  displayRange: { min: number; max: number }; // The full scale of the chart
}

const DistributionPlot: React.FC<DistributionPlotProps> = ({ label, value, unit, normalRange, displayRange }) => {
  const valueToPercent = (val: number) => {
    const boundedVal = Math.max(displayRange.min, Math.min(displayRange.max, val));
    return ((boundedVal - displayRange.min) / (displayRange.max - displayRange.min)) * 100;
  };

  const normalMinPercent = valueToPercent(normalRange.min);
  const normalMaxPercent = valueToPercent(normalRange.max);
  const valuePercent = valueToPercent(value);
  
  const isAnomalous = value < normalRange.min || value > normalRange.max;
  const valueColor = isAnomalous ? 'bg-red-500' : 'bg-sentinel-cyan';

  return (
    <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-baseline">
            <span className="text-sm text-sentinel-gray">{label}</span>
            <span className={`font-mono text-base ${isAnomalous ? 'text-red-400' : 'text-sentinel-light-gray'}`}>
                {value.toFixed(2)} <span className="text-xs text-sentinel-gray">{unit}</span>
            </span>
        </div>
        <div className="relative h-6 w-full pt-1">
            {/* Display Range Background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-sentinel-blue-light rounded-full -translate-y-1/2"></div>
            {/* Normal Range */}
            <div
                className="absolute top-1/2 h-2 bg-sentinel-gray/50 rounded-full -translate-y-1/2"
                style={{
                    left: `${normalMinPercent}%`,
                    width: `${normalMaxPercent - normalMinPercent}%`
                }}
            ></div>
            {/* Value Indicator */}
             <div
                className={`absolute top-1/2 w-3 h-3 ${valueColor} rounded-full border-2 border-sentinel-blue-deep -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out`}
                style={{ left: `${valuePercent}%` }}
                title={`Current value: ${value.toFixed(2)}`}
            ></div>
        </div>
        <div className="flex justify-between text-xs text-sentinel-gray/70 font-mono">
            <span>{displayRange.min}</span>
            <span>{displayRange.max}</span>
        </div>
    </div>
  );
};

export default DistributionPlot;
