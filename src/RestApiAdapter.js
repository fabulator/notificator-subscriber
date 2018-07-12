// @flow
import type { PushSubscription } from './PushSubscription';

type Api = {
    get: (namespace: string, Object) => Promise<Object>,
    post: (namespace: string, Object) => Promise<Object>,
    put: (namespace: string, Object) => Promise<Object>,
    requestWithBody: (namespace: string, method: string, data: Object) => Promise<Object>,
}

export type StoreAdapter = {
    add: (subscription: PushSubscription, namespace: string) => Promise<any>,
    remove: (subscription: PushSubscription, namespace: string) => Promise<any>,
    isAdded: (subscription: PushSubscription, namespace: string) => Promise<boolean>,
}

export default class RestApiAdapter {
    api: Api;

    /**
     * Constructor where api is inserted.
     *
     * @param {Api} api - object from rest-api-handler library
     */
    constructor(api: Api) {
        this.api = api;
    }

    /**
     * Request to add subscription.
     *
     * @param {PushSubscription} subscription - PushSubscription
     * @param {string} namespace - App namespace
     * @returns {Promise<any>} response from api
     */
    add(subscription: PushSubscription, namespace: string): Promise<any> {
        return this.api.put('subscription', { subscription, namespace });
    }

    /**
     * Request to remove subscription.
     *
     * @param {PushSubscription} subscription - PushSubscription
     * @param {string} namespace - App namespace
     * @returns {Promise<any>} response from api
     */
    remove(subscription: PushSubscription, namespace: string): Promise<any> {
        return this.api.requestWithBody('subscription', 'DELETE', { subscription, namespace });
    }

    /**
     * Is subscription persisted?
     *
     * @param {PushSubscription} subscription - PushSubscription
     * @param {string} namespace - App namespace
     * @returns {Promise<boolean>} was added?
     */
    isAdded(subscription: PushSubscription, namespace: string): Promise<boolean> {
        return this.api.get('subscription', {
            subscription: JSON.stringify(subscription),
            namespace,
        }).then(() => {
            return true;
        }).catch(() => {
            // Need to be refactored. It should catch only when api respond not found.
            return false;
        });
    }
}
