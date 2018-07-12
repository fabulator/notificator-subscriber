// @flow
export const PERMISSION_DEFAULT: 'default' = 'default';
export const PERMISSION_GRANTED: 'granted' = 'granted';
export const PERMISSION_DENIED: 'denied' = 'denied';

export type NotificationPermission = typeof PERMISSION_DEFAULT | typeof PERMISSION_GRANTED | typeof PERMISSION_DENIED;

export type NotificationType = {
    permission: NotificationPermission,
    requestPermission: () => Promise<NotificationPermission>,
}
