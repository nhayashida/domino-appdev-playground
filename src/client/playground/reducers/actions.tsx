import { ActionType, Notification } from './types';

export const setDominoResponse = (dominoResponse: DominoResponse) => ({
  dominoResponse,
  type: ActionType.SET_DOMINO_RESPONSE,
});

export const showNotification = (notification: Notification) => ({
  notification,
  type: ActionType.SHOW_NOTIFICATION,
});

export const hideNotification = () => ({
  type: ActionType.HIDE_NOTIFICATION,
});
