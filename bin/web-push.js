#! /usr/bin/env node
const fs = require('fs');
const webPush = require('../src/index.js');

const printUsageDetails = () => {
  const spc = '  ';

  const actions = [
    {
      name: 'send-notification',
      options: [
        '--endpoint=<url>',
        '[--key=<browser key>]',
        '[--auth=<auth secret>]',
        '[--payload=<message>]',
        '[--ttl=<seconds>]',
        '[--vapid-subject]',
        '[--vapid-pubkey]',
        '[--vapid-pvtkey]'
      ]
    }, {
      name: 'generate-vapid-keys',
      options: [
        '[--json]'
      ]
    }
  ];

  let usage = '\nUsage: \n\n';
  actions.forEach(action => {
    usage += '  web-push ' + action.name;
    usage += ' ' + action.options.join(' ');
    usage += '\n\n';
  });

  console.log(usage);
  process.exit(1);
};

const generateVapidKeys = returnJson => {
  const vapidKeys = webPush.generateVAPIDKeys();

  let outputText;
  if (returnJson) {
    outputText = JSON.stringify(vapidKeys);
  } else {
    const outputLine = '\n=======================================\n'
    outputText = outputLine + '\n' +
      'Public Key:\n' + vapidKeys.publicKey + '\n\n' +
      'Private Key:\n' + vapidKeys.privateKey + '\n' +
      outputLine;
  }

  console.log(outputText);
  process.exit(0);
};

const sendNotification = args => {
  webPush.setGCMAPIKey(process.env.GCM_API_KEY);

  const subscription = {
    endpoint: argv.endpoint,
    keys: {
      p256dh: argv.key || null,
      auth: argv.auth || null
    }
  };

  const payload = argv.payload || null;

  const options = {
    TTL: argv.ttl || 0,
    vapid: {
      subject: argv['vapid-subject'] || null,
      publicKey: argv['vapid-pubkey'] || null,
      privateKey: argv['vapid-pvtkey'] || null
    }
  };

  webPush.sendNotification(subscription, payload, options)
  .then(() => {
    console.log('Push message sent.');
  }, err => {
    console.log('Error sending push message: ');
    console.log(err);
  })
  .then(() => {
    process.exit(0);
  });
};

const action = process.argv[2];
const argv = require('minimist')(process.argv.slice(3));
switch (action) {
  case 'send-notification':
    if (!argv.endpoint || !argv.key) {
      return printUsageDetails();
    }

    sendNotification(argv);
    break;
  case 'generate-vapid-keys':
    generateVapidKeys(argv.json || false);
    break;
  default:
    printUsageDetails();
    break;
}
