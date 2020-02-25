import React, { Component } from "react";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

class HomeAuth extends Component {
  state = { isSignedIn: false }
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user });
      console.log("user", user);
    })
  }

  render() {
    return (
      <div style={{textAlign: "center", marginTop: "20%"}}>
        {this.state.isSignedIn ? (
          <span>
            <div>Signed In!</div>
            <br/>
            <button onClick={() => firebase.auth().signOut()}>Sign out!</button>
            <h3>Welcome {firebase.auth().currentUser.displayName}</h3>
            {/* <img
              alt="profile picture"
              src={firebase.auth().currentUser.photoURL}
            /> */}
          </span>
        ) : (
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        )}
      </div>
    )
  }
}

export default HomeAuth;