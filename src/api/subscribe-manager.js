import { SubscribeManager } from './..';
import restApiAdapter from './rest-api-adapter';
import { appName, publicKey } from './../config';

export default new SubscribeManager(publicKey, restApiAdapter, appName);
