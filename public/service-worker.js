self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'New Announcement';
  const options = {
    body: data.body || 'You have a new announcement',
    icon: data.icon || '/img/logo.webp',
    badge: '/img/favicon.webp',
    data: data.url || '/',
    vibrate: [200, 100, 200],
    tag: data.tag || 'announcement',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed', event.notification.tag);
});

