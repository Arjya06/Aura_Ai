
export enum EventType {
  TYPING = 'TYPING',
  SWIPE = 'SWIPE',
  MOUSE_MOVE = 'MOUSE_MOVE',
  CONTEXT_CHANGE = 'CONTEXT_CHANGE',
}

export interface BehavioralData {
  // Typing
  keyPressInterval?: number; // ms
  backspaceCount?: number;
  // Swipe
  swipeVelocity?: number; // pixels/ms
  swipePressure?: number; // 0-1
  // Mouse
  mousePath?: { x: number, y: number, t: number }[];
  mouseSpeed?: number; // pixels/sec
  mouseHesitation?: number; // count of stops
}

export interface ContextualData {
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  location?: 'home' | 'work' | 'unfamiliar';
  networkType?: 'wifi' | 'cellular';
}

export interface RawEvent {
  id: string;
  timestamp: number;
  type: EventType;
  behavioral: BehavioralData;
  contextual: ContextualData;
  isAnomalous: boolean;
}

export interface Features {
  typingSpeed: number; // chars per second
  errorRate: number; // backspaces per event
  swipeIntensity: number; // velocity * pressure
  mouseSpeed: number; // pixels / second
  mouseHesitation: number; // stops per event
  sessionTime: 'typical' | 'unusual';
  locationRisk: 'low' | 'medium' | 'high';
}

export interface Scores {
  behavior: number; // 0-1
  context: number; // 0-1
  fused: number; // 0-1
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
