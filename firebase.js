// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDxwY4XLnqJ-LH1MyUifHHm7wuoUqpd35g",
  authDomain: "shop-genesis-bd.firebaseapp.com",
  projectId: "shop-genesis-bd",
  storageBucket: "shop-genesis-bd.firebasestorage.app",
  messagingSenderId: "55271122517",
  appId: "1:55271122517:web:6e4bf76558f6dbfd2996dc",
  measurementId: "G-G6T3F6JG1R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
