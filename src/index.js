import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCyg3-TiRdd_8qP1q3TwY7EA_9iPOPpbE4",
    authDomain: "coderoom-dev.firebaseapp.com",
    databaseURL: "https://coderoom-dev.firebaseio.com",
    projectId: "coderoom-dev",
    storageBucket: "coderoom-dev.appspot.com",
    messagingSenderId: "694801682636",
    appId: "1:694801682636:web:1f0b9ed0900cdd15a8f269",
    measurementId: "G-2S2MQSLD75"
  };

firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
