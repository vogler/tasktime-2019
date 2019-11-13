import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyCNGXNpOeRLQcJnuSgUXLv8sWcPhvJfyVA",
    authDomain: "fireship-lessons.firebaseapp.com",
    databaseURL: "https://fireship-lessons.firebaseio.com",
    projectId: "fireship-lessons",
    storageBucket: "fireship-lessons.appspot.com",
    messagingSenderId: "758773997881",
    appId: "1:758773997881:web:8991643725992873"
};

firebase.initializeApp(config);

// config can be loaded from https://firebase.google.com/docs/hosting/reserved-urls
// works for `firebase deploy` and `firebase serve`
fetch('/__/firebase/init.json').then(async response => {
  const config = await response.json();
  console.log(config);
  // firebase is accessed in App.svelte before the above promise resolves and fails with "No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp()""
  // firebase.initializeApp(config);
});

export const Auth = firebase.auth();
export const Firestore = firebase.firestore();
