
const firebaseConfig = {
apiKey: "AIzaSyCDA19cy4C5_5BQ8kwMBEoKLtvk1W1qWL8",
authDomain: "uvdc-voting-system.firebaseapp.com",
databaseURL: "https://uvdc-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId: "uvdc-voting-system",
storageBucket: "uvdc-voting-system.firebasestorage.app",
messagingSenderId: "667531588974",
appId: "1:667531588974:web:159d3430db43cdab923d7f",
measurementId: "G-TXQ6XDFJM0"
};


// Use compat version (global `firebase`)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();