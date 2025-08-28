
export const SIMULATION_INTERVAL_MS = 1500;
export const ANOMALY_THRESHOLD = 0.70; // Lowered slightly to make demos more frequent
export const MAX_EVENTS_IN_STREAM = 15;
export const MAX_HISTORY_LENGTH = 30; // For charts

// Defines the "normal" operating ranges for different user profiles.
export interface NormalRanges {
  typingSpeed: { min: number; max: number };
  errorRate: { min: number; max: number };
  swipeIntensity: { min: number; max: number };
  mouseSpeed: { min: number; max: number }; // pixels/sec
  mouseHesitation: { min: number; max: number }; // stops/event
}

export interface UserProfile {
  name: string;
  description: string;
  normalRanges: NormalRanges;
}

export type UserProfileKey = 'userA' | 'userB';

export const USER_PROFILES: Record<UserProfileKey, UserProfile> = {
  userA: {
    name: "User A - Power User",
    description: "A fast and proficient user.",
    normalRanges: {
      typingSpeed: { min: 8, max: 16 },
      errorRate: { min: 0, max: 0.5 },
      swipeIntensity: { min: 0.5, max: 1.8 },
      mouseSpeed: { min: 300, max: 900 },
      mouseHesitation: { min: 0, max: 2 },
    },
  },
  userB: {
    name: "User B - Cautious User",
    description: "A more deliberate and careful user.",
    normalRanges: {
      typingSpeed: { min: 4, max: 9 },
      errorRate: { min: 0, max: 1.0 },
      swipeIntensity: { min: 0.2, max: 1.0 },
      mouseSpeed: { min: 150, max: 500 },
      mouseHesitation: { min: 1, max: 4 },
    },
  },
};
