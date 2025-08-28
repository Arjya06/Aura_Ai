import React from 'react';

interface ControlPanelProps {
  isSimulating: boolean;
  onToggle: () => void;
  mode: 'simulation' | 'live';
  onModeChange: (mode: 'simulation' | 'live') => void;
  captureError: string | null;
}

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75h-3zm7.5 0a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" />
    </svg>
);


const ControlPanel: React.FC<ControlPanelProps> = ({ isSimulating, onToggle, mode, onModeChange, captureError }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-start w-full sm:w-auto">
            <div className="flex items-center space-x-2 p-2 rounded-md bg-sentinel-blue-deep">
                <button 
                    onClick={() => onModeChange('simulation')}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${mode === 'simulation' ? 'bg-sentinel-cyan text-sentinel-blue-deep' : 'bg-transparent text-sentinel-gray hover:bg-sentinel-blue-light'}`}>
                    Simulation
                </button>
                <button 
                    onClick={() => onModeChange('live')}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${mode === 'live' ? 'bg-sentinel-cyan text-sentinel-blue-deep' : 'bg-transparent text-sentinel-gray hover:bg-sentinel-blue-light disabled:opacity-50 disabled:cursor-not-allowed'}`}
                    disabled={!!captureError}
                    title={captureError || 'Capture live user input'}
                >
                    Live Capture
                </button>
            </div>
            {captureError && (
              <p className="text-xs text-red-400 mt-2 px-2">
                <span className="font-bold">Live Capture Failed:</span> {captureError}
              </p>
            )}
        </div>
        <div className="flex items-center space-x-3">
             <div className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
             <span className="text-sentinel-gray font-medium">
                {isSimulating ? `${mode === 'live' ? 'Capturing...' : 'Simulating...'}` : 'Paused'}
            </span>
        </div>
        <button
            onClick={onToggle}
            className="flex items-center space-x-2 bg-sentinel-cyan text-sentinel-blue-deep font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-all duration-200"
        >
            {isSimulating ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
            <span>{isSimulating ? 'Pause' : 'Start'}</span>
        </button>
    </div>
  );
};

export default ControlPanel;