import { RawEvent, EventType, BehavioralData, ContextualData } from '../types';
import { SIMULATION_INTERVAL_MS } from '../constants';

// --- State for capturing events ---
let keyPressTimestamps: number[] = [];
let backspaceCount = 0;
let mousePath: { x: number; y: number; t: number }[] = [];
let eventProcessor: ((event: RawEvent) => void) | null = null;
let captureInterval: number | null = null;
let lastActivityTimestamp = Date.now();

const handleKeyDown = (e: KeyboardEvent) => {
    lastActivityTimestamp = Date.now();
    if (e.key === 'Backspace') {
        backspaceCount++;
    }
    if (e.key.length === 1) {
        keyPressTimestamps.push(Date.now());
    }
};

const handleMouseMove = (e: MouseEvent) => {
    lastActivityTimestamp = Date.now();
    mousePath.push({ x: e.clientX, y: e.clientY, t: Date.now() });
};

const processBufferedEvents = () => {
    if (Date.now() - lastActivityTimestamp > SIMULATION_INTERVAL_MS || !eventProcessor) {
        // Reset buffers if user is idle
        keyPressTimestamps = [];
        backspaceCount = 0;
        mousePath = [];
        return;
    }

    const hasTypingActivity = keyPressTimestamps.length > 0 || backspaceCount > 0;
    const hasMouseActivity = mousePath.length > 2;

    if (!hasTypingActivity && !hasMouseActivity) return;

    let eventType: EventType;
    const behavioral: BehavioralData = {};
    const contextual: ContextualData = {
        timeOfDay: 'afternoon',
        location: 'home',
        networkType: 'wifi',
    };

    if (hasMouseActivity) {
        eventType = EventType.MOUSE_MOVE;
        let distance = 0;
        let hesitationCount = 0;
        for (let i = 1; i < mousePath.length; i++) {
            const dx = mousePath[i].x - mousePath[i-1].x;
            const dy = mousePath[i].y - mousePath[i-1].y;
            const d = Math.sqrt(dx*dx + dy*dy);
            distance += d;
            const dt = (mousePath[i].t - mousePath[i-1].t) / 1000;
            if (dt > 0 && (d/dt) < 50) { // Speed less than 50px/s is a hesitation
                hesitationCount++;
            }
        }
        const duration = (mousePath[mousePath.length - 1].t - mousePath[0].t) / 1000;
        behavioral.mouseSpeed = duration > 0 ? distance / duration : 0;
        behavioral.mouseHesitation = hesitationCount;
        behavioral.mousePath = mousePath;
    } else {
        eventType = EventType.TYPING;
        let avgInterval = 100;
        if (keyPressTimestamps.length > 1) {
            const intervals = [];
            for (let i = 1; i < keyPressTimestamps.length; i++) {
                intervals.push(keyPressTimestamps[i] - keyPressTimestamps[i - 1]);
            }
            avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        }
        behavioral.keyPressInterval = avgInterval;
        behavioral.backspaceCount = backspaceCount;
    }

    const newEvent: RawEvent = {
        id: `evt_realtime_${Date.now()}`,
        timestamp: Date.now(),
        type: eventType,
        behavioral,
        contextual,
        isAnomalous: false,
    };

    eventProcessor(newEvent);

    // Reset for the next interval
    keyPressTimestamps = [];
    backspaceCount = 0;
    mousePath = [];
};

export const startRealtimeCapture = (processor: (event: RawEvent) => void) => {
    if (captureInterval) return;
    
    try {
        eventProcessor = processor;
        console.log('Starting real-time capture...');
        
        // Use body for mouse move and document for keydown
        document.body.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyDown);

        // Create a hidden input to ensure keyboard events are captured globally
        const input = document.createElement('input');
        input.id = 'sentinel-capture-input';
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.focus();
        input.addEventListener('blur', () => input.focus());

        captureInterval = window.setInterval(processBufferedEvents, SIMULATION_INTERVAL_MS);
    } catch (error) {
        console.error("Failed to start real-time capture:", error);
        stopRealtimeCapture();
        throw new Error("Could not initialize event listeners. Live Capture may not be supported on this device.");
    }
};

export const stopRealtimeCapture = () => {
    if (!captureInterval && !eventProcessor) return;
    
    console.log('Stopping real-time capture...');
    document.body.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('keydown', handleKeyDown);

    const input = document.getElementById('sentinel-capture-input');
    if (input) {
        document.body.removeChild(input);
    }
    
    if(captureInterval) clearInterval(captureInterval);
    captureInterval = null;
    eventProcessor = null;
    keyPressTimestamps = [];
    backspaceCount = 0;
    mousePath = [];
};