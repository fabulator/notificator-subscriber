import React from 'react';
import { NotificationHandler, SubscribeManager } from './..';
import subscribeManager from './../api/subscribe-manager';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.subscribe = this.subscribe.bind(this);
        this.state = {
            permission: Notification.permission,
            fetching: Notification.permission === NotificationHandler.PERMISSION_GRANTED,
            subscription: null,
            exception: null,
        };
    }

    componentDidMount() {
        if (this.state.permission !== NotificationHandler.PERMISSION_GRANTED) {
            return;
        }

        subscribeManager.isSubscriptionPersisted().then((persisted) => {
            if (persisted === false) {
                return this.subscribe();
            }

            if (persisted === true) {
                return SubscribeManager.getSubscription().then((subscription) => {
                    this.setState({
                        fetching: false,
                        subscription,
                    });
                    return subscription;
                });
            }

            this.setState({
                fetching: false,
            });
            return persisted;
        }).catch((error) => {
            this.setState({
                fetching: false,
                exception: error,
            });
        });
    }

    subscribe() {
        this.setState({
            fetching: true,
        });

        return this.requestPermissions().then(() => {
            return subscribeManager.subscribe().then((subscription) => {
                this.setState({
                    fetching: false,
                    subscription,
                });
                return subscription;
            });
        }).catch((error) => {
            this.setState({
                fetching: false,
                exception: error,
            });
        });
    }

    unsubscribe() {
        this.setState({
            fetching: true,
        });

        return subscribeManager.unsubscribe().then((response) => {
            this.setState({
                fetching: false,
                subscription: null,
            });
            return response;
        }).catch((error) => {
            this.setState({
                fetching: false,
                exception: error,
            });
        });
    }

    requestPermissions() {
        return NotificationHandler.requestNotificationPermission()
            .then((permission) => {
                this.setState({
                    permission,
                });
                return permission;
            }).catch((permission) => {
                this.setState({
                    permission,
                });
                throw permission;
            });
    }

    render() {
        if (this.state.fetching) {
            return ('Fetching...');
        }

        if (this.state.exception) {
            return (this.state.exception);
        }

        if (!NotificationHandler.isNotificationSupported) {
            return (<div>Notifications are not supported in this browser.</div>);
        }

        if (this.state.permission === NotificationHandler.PERMISSION_DENIED) {
            return (<div>Notifications was disabled.</div>);
        }

        if (this.state.permission === NotificationHandler.PERMISSION_DEFAULT) {
            return (<div>
                App does not have permissions to send notifications. <br />
                <button onClick={this.subscribe.bind(this)}>Subsribe to Notifications</button>
            </div>);
        }

        if (!this.state.subscription) {
            return (<div>
                App is not subcsribed to notifications. <br />
                <button onClick={this.subscribe.bind(this)}>Subsribe to Notifications</button>
            </div>);
        }

        return (<div>User to subscribed to notifications <br />
            <button onClick={this.unsubscribe.bind(this)}>Unsubsribe to Notifications</button></div>);
    }
}

export default App;
