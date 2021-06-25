/**
 * @fileOverview  Defining the main namespace ("public library") and its MVC subnamespaces
 * @authors Gerd Wagner & Juan-Francisco Reyes
 */
'use strict';
// main namespace pl = "public library"
const pl = {m:{}, v:{}, c:{}};
// initialize Cloud Firestore through Firebase
// TODO: Replace the following with your app's Firebase project configuration
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AAAAA_Xzios:APA91bHiABRiWaIpS6MWKn2giXbefK_444eJqWcHjteR5Xv9IqN6eYV-gkBo5845s8WGOCA_D88uC_jgPeEIssmX7ys5Gvsmyhn3Mi4Sbn_DcKdoCWpdm6U7CA6sJDhFs3Uw_tS4KR2q",
    authDomain: "",
    projectId: ""
  });
} else { // if already initialized
  firebase.app();
}
// initialize Firestore database interface
const db = firebase.firestore();
