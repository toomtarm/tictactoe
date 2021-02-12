var firebaseConfig = {
  apiKey: "AIzaSyA5HGP7RYCzBCJicxyTfb7wucN2iBzhSGA",
  authDomain: "tictactoe-48d92.firebaseapp.com",
  projectId: "tictactoe-48d92",
  storageBucket: "tictactoe-48d92.appspot.com",
  messagingSenderId: "435223586633",
  appId: "1:435223586633:web:e79c7fed80e524dc205c98",
  measurementId: "G-09Q92N4WEW",
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const auth = firebase.auth()
