import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfX8dq_z6kye9JcJ1IxiQTVpJmUir4c_0",
  authDomain: "ap-p1-43e18.firebaseapp.com",
  projectId: "ap-p1-43e18",
  storageBucket: "ap-p1-43e18.appspot.com",
  messagingSenderId: "9281620748",
  appId: "1:9281620748:web:7a4255a9299b10a90e1729"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;


