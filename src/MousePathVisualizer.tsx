
import React from 'react';

interface MousePathVisualizerProps {
  path: { x: number; y: number }[];
}

const MousePathVisualizer: React.FC<MousePathVisualizerProps> = ({ path }) => {
  if (path.length < 2) {
    return (
       <div>
        <h3 className="text-lg font-bold text-sentinel-light-gray mb-4">Mouse Path Visualizer</h3>
        <div className="w-full h-32 bg-sentinel-blue-deep rounded-md flex items-center justify-center text-sentinel-gray text-sm">
          Move mouse to see path...
        </div>
      </div>
    );
  }

  // Normalize path to fit within the viewbox (0,0 to 100,100)
  const xs = path.map(p => p.x);
  const ys = path.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const maxRange = Math.max(rangeX, rangeY);

  const points = path.map(p => {
      const normX = ((p.x - minX) / maxRange) * 100;
      const normY = ((p.y - minY) / maxRange) * 100;
      return `${normX.toFixed(2)},${normY.toFixed(2)}`;
  }).join(' ');

  return (
    <div>
        <h3 className="text-lg font-bold text-sentinel-light-gray mb-4">Mouse Path Visualizer</h3>
        <div className="w-full h-32 bg-sentinel-blue-deep rounded-md p-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {path.map((_, index) => {
                    if (index === 0) return null;
                    const segment = points.split(' ').slice(0, index + 1).join(' ');
                    const opacity = Math.max(0, (index / path.length) - 0.2);
                    return (
                        <polyline
                            key={index}
                            points={segment}
                            fill="none"
                            stroke="url(#cometGradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ opacity }}
                        />
                    )
                })}
                 <defs>
                    <linearGradient id="cometGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#64ffda" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    </div>
  );
};

export default MousePathVisualizer;
