// @flow
import ServiceWorkerHandler from './ServiceWorkerHandler';
import type { PushSubscription } from './PushSubscription';
import type { StoreAdapter } from './RestApiAdapter';

/**
 * This Class handle subscribing, unsubscribing to notifications and store this informations to database.
 */

export default class SubscribeManager {
    publicKey: string;
    storeAdapter: StoreAdapter;
    namespace: string;

    /**
     * Constructor.
     *
     * @param {string} publicKey - public key of push notifications
     * @param {StoreAdapter} storeAdapter - adapter to store information about subscription
     */
    constructor(publicKey: string, storeAdapter: StoreAdapter, namespace: string) {
        this.publicKey = publicKey;
        this.storeAdapter = storeAdapter;
        this.namespace = namespace;
    }

    /**
     * Convert urlBase64ToUint8Array.
     *
     * @param {string} base64String - input
     * @returns {Uint8Array} - encoded string
     */
    static urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = atob(base64);
        return Uint8Array.from([...rawData].map((char) => {
            return char.charCodeAt(0);
        }));
    }

    /**
     * Get current browser subscription.
     *
     * @returns {Promise<?PushSubscription>} PushSubscription or null
     */
    static getSubscription(): Promise<PushSubscription> {
        return SubscribeManager.getRegistration().then((registration) => {
            // $FlowFixMe
            return registration.pushManager.getSubscription();
        });
    }

    static getRegistration(): Promise<*> {
        if (self && self.registration) {
            return new Promise(resolve => resolve(self.registration));
        }

        return ServiceWorkerHandler.getRegistration();
    }

    /**
     * Get encoded public key.
     *
     * @returns {string} encoded public key
     */
    getEncodedPublicKey(): Uint8Array {
        return SubscribeManager.urlBase64ToUint8Array(this.publicKey);
    }

    /**
     * Subscribe user to notifications.
     *
     * @returns {Promise<Object>} new status
     */
    subscribe(): Promise<Object> {
        return ServiceWorkerHandler.getRegistration().then((registration) => {
            // $FlowFixMe
            return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.getEncodedPublicKey(),
            });
        }).then((subscription) => {
            return this.persistSubscription(subscription)
                .catch((exception) => {
                    // if persist of subscription failed, unsubscribe user
                    subscription.unsubscribe();
                    throw exception;
                });
        }).then((response) => {
            return response.data;
        });
    }

    /**
     * Unsubscribe user to notifications.
     *
     * @returns {Promise<any>} response from store adapter or string already
     */
    unsubscribe(): Promise<Object> {
        return SubscribeManager.getSubscription().then((subscription) => {
            if (!subscription) {
                return {
                    status: 'already',
                    response: null,
                };
            }

            return subscription.unsubscribe().then(() => {
                return this.storeAdapter.remove(subscription, this.namespace);
            });
        }).then((response) => {
            return {
                status: 'unsubscribed',
                response,
            };
        });
    }

    /**
     * Is current browser subscription persisted.
     *
     * @returns {Promise<boolean | null>} is persisted
     */
    isSubscriptionPersisted(): Promise<boolean | null> {
        return SubscribeManager.getSubscription().then((subscription: PushSubscription) => {
            if (!subscription) {
                return null;
            }

            return this.storeAdapter.isAdded(subscription, this.namespace);
        });
    }

    /**
     * Persist subscription to API.
     *
     * @param {PushSubscription} subscription - PushSubscription
     * @returns {Promise<Object>} response from adapter
     */
    persistSubscription(subscription: PushSubscription): Promise<Object> {
        return this.storeAdapter.add(subscription, this.namespace);
    }
}
