importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

// ✅ Your Firebase config
firebase.initializeApp({
  apiKey: "AIzaSyDihDp65AxWLQyrQdj6TmyihVzUr-Ep5eQ",
  authDomain: "lmpio-509d1.firebaseapp.com",
  projectId: "lmpio-509d1",
  messagingSenderId: "598769578855",
  appId: "1:598769578855:web:6b960cccd1c68436c875c2",
});

const messaging = firebase.messaging();

// Background notifications
messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});
