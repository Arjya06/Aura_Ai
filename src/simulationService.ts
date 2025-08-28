
import { RawEvent, EventType, BehavioralData, ContextualData } from '../types';
import { UserProfile } from '../constants';

let isUserStressed = false;
let eventCounter = 0;

const getRandom = (min: number, max: number): number => Math.random() * (max - min) + min;

const generateNormalBehavior = (ranges: UserProfile['normalRanges']): BehavioralData => ({
  keyPressInterval: 1000 / getRandom(ranges.typingSpeed.min, ranges.typingSpeed.max),
  backspaceCount: Math.random() < 0.1 ? 1 : 0,
  swipeVelocity: getRandom(0.8, 1.2),
  swipePressure: getRandom(0.3, 0.6),
  mouseSpeed: getRandom(ranges.mouseSpeed.min, ranges.mouseSpeed.max),
  mouseHesitation: Math.floor(getRandom(ranges.mouseHesitation.min, ranges.mouseHesitation.max)),
});

const generateAnomalousBehavior = (ranges: UserProfile['normalRanges']): BehavioralData => {
    const isFrantic = Math.random() > 0.5;
    if (isFrantic) {
      // Frantic/Stressed: very fast typing, high pressure, erratic mouse
      return {
        keyPressInterval: 1000 / getRandom(ranges.typingSpeed.max + 2, ranges.typingSpeed.max + 8),
        backspaceCount: Math.random() < 0.4 ? 2 : 1,
        swipeVelocity: getRandom(2.0, 3.5),
        swipePressure: getRandom(0.7, 1.0),
        mouseSpeed: getRandom(ranges.mouseSpeed.max * 1.5, ranges.mouseSpeed.max * 2.5),
        mouseHesitation: Math.floor(getRandom(0, ranges.mouseHesitation.min + 1)), // Less hesitation, just fast
      };
    } else {
      // Hesitant/Unsure: very slow, high errors, jerky mouse
       return {
        keyPressInterval: 1000 / getRandom(ranges.typingSpeed.min / 2, ranges.typingSpeed.min - 1),
        backspaceCount: Math.random() < 0.6 ? 3 : 2,
        swipeVelocity: getRandom(0.3, 0.7),
        swipePressure: getRandom(0.2, 0.5),
        mouseSpeed: getRandom(ranges.mouseSpeed.min * 0.5, ranges.mouseSpeed.min * 0.8),
        mouseHesitation: Math.floor(getRandom(ranges.mouseHesitation.max + 2, ranges.mouseHesitation.max + 5)),
      };
    }
  };

const generateContext = (isAnomalous: boolean): ContextualData => {
    const hour = new Date().getHours();
    let timeOfDay: ContextualData['timeOfDay'] = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else if (hour >= 21 || hour < 6) timeOfDay = 'night';

    if (isAnomalous) {
        return {
            timeOfDay: 'night',
            location: 'unfamiliar',
            networkType: 'cellular',
        };
    }

    return {
        timeOfDay,
        location: Math.random() < 0.7 ? 'home' : 'work',
        networkType: 'wifi',
    };
};

export const generateEvent = (userProfile: UserProfile): RawEvent => {
  eventCounter++;
  // Every 10-20 events, toggle the user's stress state
  if (eventCounter % Math.floor(getRandom(10, 20)) === 0) {
    isUserStressed = !isUserStressed;
  }

  const isAnomalous = isUserStressed && Math.random() > 0.3; // 70% chance of anomaly if stressed
  const eventTypes = [EventType.TYPING, EventType.SWIPE, EventType.MOUSE_MOVE];
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

  const behavioralData = isAnomalous 
    ? generateAnomalousBehavior(userProfile.normalRanges) 
    : generateNormalBehavior(userProfile.normalRanges);
  const contextualData = generateContext(isAnomalous);
  
  return {
    id: `evt_${Date.now()}_${Math.random()}`,
    timestamp: Date.now(),
    type: eventType,
    behavioral: behavioralData,
    contextual: contextualData,
    isAnomalous,
  };
};
