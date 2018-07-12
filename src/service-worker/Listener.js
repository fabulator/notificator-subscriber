// @flow
import PushEvent from './PushEvent';
import api from './../api/api';

export default class Listener {
    self: *;

    constructor(self: *) {
        this.self = self;
    }

    onPush(event: *) {
        const pushEvent = new PushEvent(event);

        event.waitUntil(pushEvent.getNotification().then((notifications) => {
            return Promise.all(notifications.map((notification) => {
                return this.self.registration.showNotification(notification.title, notification);
            }));
        }));
    }

    onNotificationClick(event: *) {
        event.notification.close();

        const { notification, action } = event;

        if (action) {
            event.waitUntil(api.get(action));
            return;
        }

        if (!notification) {
            return;
        }

        // log impressions

        const { data } = notification;

        if (!data) {
            return;
        }

        const { url } = data;

        if (url) {
            event.waitUntil(clients.openWindow(url));
        }
    }
}
