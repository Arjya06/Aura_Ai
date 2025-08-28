
import React from 'react';
import { Features } from '../types';
import { NormalRanges } from '../constants';
import DistributionPlot from './DistributionPlot';

interface FeaturePanelProps {
  features: Features | null;
  normalRanges: NormalRanges;
}

const FeaturePanel: React.FC<FeaturePanelProps> = ({ features, normalRanges }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-sentinel-light-gray mb-4">
        Real-time Feature Analysis
      </h3>
      <p className="text-xs text-sentinel-gray mb-6">
        Comparing current user behavior against their established baseline.
      </p>
      {features ? (
        <div className="space-y-6">
          <DistributionPlot
            label="Typing Speed"
            value={features.typingSpeed}
            unit="cps"
            normalRange={normalRanges.typingSpeed}
            displayRange={{ min: 0, max: 25 }}
          />
          <DistributionPlot
            label="Error Rate"
            value={features.errorRate}
            unit="bks/evt"
            normalRange={normalRanges.errorRate}
            displayRange={{ min: 0, max: 5 }}
          />
           <DistributionPlot
            label="Mouse Speed"
            value={features.mouseSpeed}
            unit="px/s"
            normalRange={normalRanges.mouseSpeed}
            displayRange={{ min: 0, max: 2000 }}
          />
           <DistributionPlot
            label="Mouse Hesitation"
            value={features.mouseHesitation}
            unit="stops"
            normalRange={normalRanges.mouseHesitation}
            displayRange={{ min: 0, max: 10 }}
          />
           <div className="pt-4 border-t border-sentinel-blue-light/50 space-y-2">
                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-sentinel-gray">Session Time</span>
                    <span className={`font-mono text-base ${features.sessionTime === 'unusual' ? 'text-amber-400' : 'text-sentinel-light-gray'}`}>{features.sessionTime}</span>
                </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-sm text-sentinel-gray">Location Risk</span>
                    <span className={`font-mono text-base ${features.locationRisk === 'high' ? 'text-red-400' : features.locationRisk === 'medium' ? 'text-amber-400' : 'text-sentinel-light-gray'}`}>{features.locationRisk}</span>
                </div>
            </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 text-sentinel-gray">
          <p>Waiting for first event...</p>
        </div>
      )}
    </div>
  );
};

export default FeaturePanel;
