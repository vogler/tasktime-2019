import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyBdTOOf6iSJJPaqEzE6I_10K61q_gSyqPE",
  authDomain: "fire-abc6b.firebaseapp.com",
  databaseURL: "https://fire-abc6b.firebaseio.com",
  projectId: "fire-abc6b",
  storageBucket: "fire-abc6b.appspot.com",
  messagingSenderId: "501935911539",
  appId: "1:501935911539:web:0d24755b3c4bba9c97b006",
  measurementId: "G-SK9XPGTLY9"
};

firebase.initializeApp(config);

// config can be loaded from https://firebase.google.com/docs/hosting/reserved-urls
// works for `firebase deploy` and `firebase serve`
// does not work though because there is no top-level await yet: https://github.com/tc39/proposal-top-level-await, https://v8.dev/features/top-level-await
// (async() => {
//   const config = await (await fetch('/__/firebase/init.json')).json();
//   console.log(config);
//   // firebase is accessed in App.svelte before the above promise resolves and fails with "No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp()""
//   firebase.initializeApp(config);
// })();

export const Auth = firebase.auth();
export const Firestore = firebase.firestore();
// need both auth() and auth exported: firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
// how to re-export firebase such that `import { firebase, Auth, Firestore }` works?
// export firebase; // no
// export const firebase = firebase; // Identifier 'firebase' has already been declared
// export default firebase; // no
// export * from firebase; // no
// export {default as firebase} from 'firebase/app'; // no
// ok, give in and export/import it with a different name:
// export const fb = firebase;
// good explanation: https://javascript.info/import-export
export { firebase }
