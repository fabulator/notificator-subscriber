// @flow
import { PERMISSION_DEFAULT, PERMISSION_GRANTED, PERMISSION_DENIED } from './Notification';
import type { NotificationType } from './Notification';

// reasign original Notification beacause Flow have problem with type checking
// $FlowFixMe
const NotificationHelper: NotificationType = Notification;

export default class NotificationHandler {
    // add Notification states
    static PERMISSION_DEFAULT: typeof PERMISSION_DEFAULT = PERMISSION_DEFAULT;
    static PERMISSION_GRANTED: typeof PERMISSION_GRANTED = PERMISSION_GRANTED;
    static PERMISSION_DENIED: typeof PERMISSION_DENIED = PERMISSION_DENIED;

    // check if Push Notifications are supported in current browser
    // $FlowFixMe
    static isNotificationSupported: boolean = !(typeof NotificationHelper === 'undefined') && !(typeof PushManager === 'undefined');

    /**
     * Request permissions to send notifications. If user did not grant permission, promise will be rejected.
     *
     * @returns {Promise<PERMISSION_GRANTED>} granted
     */
    static requestNotificationPermission(): Promise<typeof PERMISSION_GRANTED> {
        return NotificationHelper.requestPermission()
            .then((response) => {
                // when permission was granted, resolve promise
                if (response === NotificationHandler.PERMISSION_GRANTED) {
                    // $FlowFixMe
                    return response;
                }

                // if not, reject it
                throw response;
            });
    }
}
