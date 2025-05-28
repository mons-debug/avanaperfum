import webpush from 'web-push';

// Configure web-push with VAPID keys
const vapidKeys = {
  publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLb8P5QFebdUFBrDNBEN_MuBpSUgVLb1VJKHSBhf6_7JnZ0Z6lNW_dM',
  privateKey: 'aUiz-xQC6VRyOWNufsm3zwBh6Ysx6sWAkKTOKFXVqWo'
};

webpush.setVapidDetails(
  'mailto:admin@avanaparfum.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

declare global {
  // eslint-disable-next-line no-var
  var pushSubscriptions: PushSubscription[] | undefined;
}

// Function to send push to all subscriptions
export async function sendPushToAll(payload: any) {
  if (!global.pushSubscriptions || global.pushSubscriptions.length === 0) {
    console.log('📱 No push subscriptions available');
    return;
  }

  console.log(`📱 Sending push to ${global.pushSubscriptions.length} subscriptions`);
  
  const promises = global.pushSubscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(subscription as any, JSON.stringify(payload));
      console.log('✅ Push sent successfully');
    } catch (error) {
      console.error('❌ Push failed:', error);
      // Remove invalid subscriptions
      global.pushSubscriptions = global.pushSubscriptions?.filter(sub => sub !== subscription);
    }
  });

  await Promise.all(promises);
}

export { vapidKeys }; 