import { SubscribeManager } from './../../src';
import api from './../api/api';

export default class PushEvent {
    constructor(event) {
        this.event = event;
    }

    getNotification() {
        if (this.event.data) {
            const data = this.getNotificationFromEvent();
            if (data) {
                return new Promise(resolve => [resolve(data)]);
            }
        }

        return this.getNotificationFromApi();
    }

    getNotificationFromApi() {
        return SubscribeManager.getSubscription()
            .then((subscription) => {
                return api.get('notifications', { endpoint: subscription.endpoint });
            })
            .then((response) => {
                return response.data;
            });
    }

    getNotificationFromEvent() {
        try {
            return this.event.data.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}
