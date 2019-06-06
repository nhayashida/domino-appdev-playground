export enum NotificationType {
  Info = 'info',
  Error = 'error',
}

export type Notification = {
  type: NotificationType;
  title: string;
  message: string;
};

export enum ActionType {
  SET_DOMINO_RESPONSE = 'SET_DOMINO_RESPONSE',
  SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
  HIDE_NOTIFICATION = 'HIDE_NOTIFICATION',
}

export type AppState = {
  dominoResponse: DominoResponse;
  notification: Notification;
};

type SetDominoResponseAction = {
  type: typeof ActionType.SET_DOMINO_RESPONSE;
  dominoResponse: DominoResponse;
};

type ShowNotificationAction = {
  type: typeof ActionType.SHOW_NOTIFICATION;
  notification: Notification;
};

type HideNotificationAction = {
  type: typeof ActionType.HIDE_NOTIFICATION;
};

export type AppActionTypes = SetDominoResponseAction &
  ShowNotificationAction &
  HideNotificationAction;
