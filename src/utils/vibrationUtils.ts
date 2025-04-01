
/**
 * Simple vibration with default 50ms duration
 * @param duration - Vibration duration in ms
 */
export const simpleVibration = (duration: number = 50): void => {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
};

/**
 * Success pattern vibration
 */
export const successVibration = (): void => {
  if (navigator.vibrate) {
    navigator.vibrate([50, 50, 100]);
  }
};

/**
 * Error pattern vibration
 */
export const errorVibration = (): void => {
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
};

/**
 * Notification pattern vibration
 */
export const notificationVibration = (): void => {
  if (navigator.vibrate) {
    navigator.vibrate([50, 100, 50]);
  }
};

/**
 * Vibrate only if the feature is supported
 * @param pattern - Vibration pattern
 * @returns True if vibration was triggered, false otherwise
 */
export const vibrateIfSupported = (pattern: number | number[]): boolean => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
    return true;
  }
  return false;
};
