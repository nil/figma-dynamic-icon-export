const defaultSettings = {
  start: '$',
  end: ' ',
  size: ','
};

/**
 * Send a message to the UI
 */
export const postMessage = (key: string, value?: unknown): void => {
  figma.ui.postMessage({ [key]: value || true });
};


/**
 * Get user settings
 */
export const getUserSettings = (callback): void => {
  figma.clientStorage.getAsync('userSettings').then(callback);
};


/**
 * Send user settings to the UI
 */
export const sendUserSettings = (): void => {
  getUserSettings((value) => postMessage('userSettings', value || defaultSettings));
};
