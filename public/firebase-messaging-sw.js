importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDIKeZJez9AVZs_hIXMH_BcyBGGv8YeQGg",
    authDomain: "quotidie-282b4.firebaseapp.com",
    projectId: "quotidie-282b4",
    storageBucket: "quotidie-282b4.appspot.com",
    messagingSenderId: "885662934483",
    appId: "1:885662934483:web:138cb04c10cde188c13b26",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging(firebaseApp);

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    // const notificationTitle = 'Background Message Title';
    // const notificationOptions = {
    //     body: 'Background Message body.',
    //     icon: './quotidieIcon.png'
    // };

    // self.registration.showNotification(notificationTitle,
    //     notificationOptions);
});
