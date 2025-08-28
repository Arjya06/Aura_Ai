import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RawEvent, Features, Scores, EventType } from '../types';
import { generateEvent } from '../services/simulationService';
import { startRealtimeCapture, stopRealtimeCapture } from '../services/realtimeCaptureService';
import { ANOMALY_THRESHOLD, MAX_EVENTS_IN_STREAM, SIMULATION_INTERVAL_MS, MAX_HISTORY_LENGTH, UserProfile } from '../constants';

import ScoreGauge from './ScoreGauge';
import EventStream from './EventStream';
import FeaturePanel from './FeaturePanel';
import AlertModal from './AlertModal';
import ControlPanel from './ControlPanel';
import HistoricalChart from './HistoricalChart';
import LocationRiskChart from './LocationRiskChart';
import MousePathVisualizer from './MousePathVisualizer';
import BaselineModal from './BaselineModal';

type InputMode = 'simulation' | 'live';

interface DashboardProps {
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const [events, setEvents] = useState<RawEvent[]>([]);
  const [currentFeatures, setCurrentFeatures] = useState<Features | null>(null);
  const [featuresHistory, setFeaturesHistory] = useState<Features[]>([]);
  const [scores, setScores] = useState<Scores>({ behavior: 0, context: 0, fused: 0 });
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showBaseline, setShowBaseline] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<InputMode>('simulation');
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [mousePath, setMousePath] = useState<{x: number, y: number}[]>([]);
  
  const simulationIntervalRef = useRef<number | null>(null);

  const processEvent = useCallback((event: RawEvent) => {
    // 1. Feature Engineering
    const features: Features = {
      typingSpeed: 1000 / (event.behavioral.keyPressInterval || 100),
      errorRate: event.behavioral.backspaceCount || 0,
      swipeIntensity: (event.behavioral.swipeVelocity || 0) * (event.behavioral.swipePressure || 0),
      mouseSpeed: event.behavioral.mouseSpeed || 0,
      mouseHesitation: event.behavioral.mouseHesitation || 0,
      sessionTime: event.contextual.timeOfDay === 'night' ? 'unusual' : 'typical',
      locationRisk: event.contextual.location === 'unfamiliar' ? 'high' : event.contextual.location === 'work' ? 'medium' : 'low',
    };
    
    setEvents(prevEvents => [event, ...prevEvents.slice(0, MAX_EVENTS_IN_STREAM - 1)]);
    setCurrentFeatures(features);
    setFeaturesHistory(prev => [features, ...prev.slice(0, MAX_HISTORY_LENGTH - 1)]);
    if (event.type === EventType.MOUSE_MOVE && event.behavioral.mousePath) {
        setMousePath(event.behavioral.mousePath.map(p => ({x: p.x, y: p.y})));
    }

    // 2. Anomaly Scoring
    const normalRanges = userProfile.normalRanges;
    const getOutOfBoundsScore = (value: number, range: {min: number, max: number}) => {
      if (range.max === 0) return 0; // Avoid division by zero for inactive features
      const deviation = value < range.min ? range.min - value : value > range.max ? value - range.max : 0;
      if (deviation === 0) return 0;
      const rangeSize = range.max - range.min;
      return Math.min(1.0, deviation / (rangeSize * 0.75)); // More sensitive
    }

    const typingScore = getOutOfBoundsScore(features.typingSpeed, normalRanges.typingSpeed);
    const errorScore = getOutOfBoundsScore(features.errorRate, normalRanges.errorRate);
    const mouseSpeedScore = getOutOfBoundsScore(features.mouseSpeed, normalRanges.mouseSpeed);
    const mouseHesitationScore = getOutOfBoundsScore(features.mouseHesitation, normalRanges.mouseHesitation);

    let behaviorScore = (typingScore * 0.3) + (errorScore * 0.2) + (mouseSpeedScore * 0.3) + (mouseHesitationScore * 0.2);
    behaviorScore = Math.min(1, behaviorScore * 1.5); 
    
    let contextScore = 0;
    if (features.sessionTime === 'unusual') contextScore += 0.5;
    if (features.locationRisk === 'high') contextScore += 0.8;
    else if (features.locationRisk === 'medium') contextScore += 0.2;
    contextScore = Math.min(1, contextScore);

    // 3. Fusion Engine
    const fusedScore = (behaviorScore * 0.65) + (contextScore * 0.35);
    
    const newScores: Scores = { behavior: behaviorScore, context: contextScore, fused: fusedScore };
    setScores(newScores);

    // 4. Trigger Alert
    if (fusedScore > ANOMALY_THRESHOLD && !showAlert) {
      setShowAlert(true);
    }
  }, [userProfile, showAlert]);

  const stopAllActivity = () => {
     if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
     stopRealtimeCapture();
  };

  useEffect(() => {
    stopAllActivity();
    setCaptureError(null); // Reset error on change

    if (isSimulating) {
        if (inputMode === 'simulation') {
            simulationIntervalRef.current = window.setInterval(() => {
                const newEvent = generateEvent(userProfile);
                processEvent(newEvent);
            }, SIMULATION_INTERVAL_MS);
        } else if (inputMode === 'live') {
            try {
                startRealtimeCapture(processEvent);
            } catch (error) {
                console.error(error);
                setCaptureError(error instanceof Error ? error.message : "An unknown error occurred during live capture setup.");
                // Fallback to simulation mode visually
                setInputMode('simulation'); 
            }
        }
    }
    return stopAllActivity;
  }, [isSimulating, inputMode, processEvent, userProfile]);
  

  const handleCloseAlert = () => setShowAlert(false);
  const toggleSimulation = () => setIsSimulating(prev => !prev);

  const handleModeChange = (mode: InputMode) => {
      setIsSimulating(false);
      setTimeout(() => {
          setInputMode(mode);
          setEvents([]);
          setCurrentFeatures(null);
          setFeaturesHistory([]);
          setScores({ behavior: 0, context: 0, fused: 0 });
          setCaptureError(null);
          setIsSimulating(true);
      }, 100);
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-sentinel-blue-dark rounded-lg border border-sentinel-blue-light">
        <ScoreGauge title="Behavior Score" score={scores.behavior} />
        <ScoreGauge title="Context Score" score={scores.context} />
        <ScoreGauge title="Fused Anomaly Score" score={scores.fused} isMain={true} />
        <div className="flex flex-col items-center justify-center">
            <button onClick={() => setShowBaseline(true)} className="w-full h-full bg-sentinel-blue-light border border-sentinel-gray/30 rounded-lg text-sentinel-gray hover:bg-sentinel-blue-deep hover:text-sentinel-light-gray transition-colors">
                View Baseline
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 bg-sentinel-blue-dark rounded-lg border border-sentinel-blue-light">
            <HistoricalChart history={featuresHistory.slice().reverse()} />
          </div>
          <div className="p-6 bg-sentinel-blue-dark rounded-lg border border-sentinel-blue-light">
            <LocationRiskChart history={featuresHistory.slice().reverse()} />
          </div>
           <div className="p-4 bg-sentinel-blue-dark rounded-lg border border-sentinel-blue-light">
            <ControlPanel 
              isSimulating={isSimulating} 
              onToggle={toggleSimulation} 
              mode={inputMode} 
              onModeChange={handleModeChange} 
              captureError={captureError}
            />
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-sentinel-blue-dark rounded-lg border border-sentinel-blue-light">
            <FeaturePanel features={currentFeatures} normalRanges={userProfile.normalRanges} />
          </div>
          <div className="grid grid-rows-2 gap-6">
             <div className="p-6 bg-sentinel-blue-dark rounded-lg border border-sentinel-blue-light row-span-1">
                <MousePathVisualizer path={mousePath} />
             </div>
             <div className="p-6 bg-sentinel-blue-dark rounded-lg border border-sentinel-blue-light row-span-1">
               <EventStream events={events} />
             </div>
          </div>
        </div>
      </div>
       
      {showAlert && currentFeatures && (
        <AlertModal
          score={scores.fused}
          initialFeatures={currentFeatures}
          initialScores={scores}
          onClose={handleCloseAlert}
        />
      )}

      {showBaseline && (
          <BaselineModal userProfile={userProfile} onClose={() => setShowBaseline(false)} />
      )}
    </div>
  );
};

export default Dashboard;