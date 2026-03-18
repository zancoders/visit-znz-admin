/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

async function loadFirebaseConfig() {
  try {
    const response = await fetch('/firebase-config.json', { cache: 'no-store' });
    if (!response.ok) return null;
    const cfg = await response.json();
    if (!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId || !cfg.messagingSenderId) {
      return null;
    }
    return cfg;
  } catch (_) {
    return null;
  }
}

loadFirebaseConfig().then((config) => {
  if (!config) return;

  firebase.initializeApp(config);

  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const notification = payload.notification || {};
    const title = notification.title || 'Visit Zanzibar';
    const options = {
      body: notification.body || '',
      icon: '/icons/Icon-192.png',
      data: payload.data || {},
    };
    self.registration.showNotification(title, options);
  });
});
