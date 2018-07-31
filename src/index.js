'use strict';

const vapidHelper = require('./vapid-helper.js');
const encryptionHelper = require('./encryption-helper.js');
const WebPushLib = require('./web-push-lib.js');
const WebPushError = require('./web-push-error.js');

const webPush = new WebPushLib();

module.exports = {
  WebPushError: WebPushError,
  encrypt: encryptionHelper.encrypt,
  getVapidHeaders: vapidHelper.getVapidHeaders,
  generateVAPIDKeys: vapidHelper.generateVAPIDKeys,
  setGCMAPIKey: webPush.setGCMAPIKey,
  setVapidDetails: webPush.setVapidDetails,
  generateRequestDetails: webPush.generateRequestDetails,
  sendNotification: webPush.sendNotification
};
