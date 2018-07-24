// @flow
export default class ServiceWorkerHandler {
    static isSupported: boolean = !(typeof navigator.serviceWorker === 'undefined');

    /**
     * Get worker registration.
     *
     * @returns {Promise<ServiceWorkerRegistration>} worker registration
     */
    static getRegistration(): Promise<ServiceWorkerRegistration> {
        const { serviceWorker } = navigator;

        // check if web worker is supported
        if (!serviceWorker) {
            // if not, just load app in regular way
            return Promise.reject(new Error('not-supported'));
        }

        // check if web worker was already installed
        if (!serviceWorker.controller) {
            // if not, register web worker
            return serviceWorker.register('sw.js', {
                scope: './',
            }).then(() => {
                return serviceWorker.ready;
            });
        }

        return serviceWorker.getRegistration('./');
    }
}
