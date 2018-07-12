// @flow
import Listener from './Listener';

const listener = new Listener(self);

self.addEventListener('push', listener.onPush.bind(listener));

self.addEventListener('notificationclick', listener.onNotificationClick.bind(listener));
