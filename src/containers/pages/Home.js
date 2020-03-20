import React from "react";
import random from "random-key";
import Header from "../../components/Header/Header";
import { database } from "firebase/app";
import { firebaseAuth } from "../../config/firebase-config";
import { logout } from "../../helpers/auth";

const appTokenKey = "appToken";
const sessionID = "sessionID";

export default class HomePage extends React.Component {

  constructor(props) {
    super(props);

    // this.state = {
    //     // firebaseUser: JSON.parse(localStorage.getItem("firebaseUser"))
    // };

    // console.log("User:", this.state.firebaseUser);
    this.handleLogout = this.handleLogout.bind(this);

    if(localStorage.getItem(sessionID)){
        localStorage.removeItem(sessionID);
    }

    if (!localStorage.getItem(appTokenKey)) {
        this.props.history.push(`/login`);
        return;
    }
  }

  // generating random session id
  state = {
    key: random.generate(5),
    num: null
  };

  // updating the total number of shares
  componentDidMount = () => {
    database()
      .ref("code-sessions")
      .on("value", s => {
        this.setState({ num: s.numChildren() });
      });
  };

  // when new session is created ('Share Code' button is clicked)
  onNewGround = () => {
    var user = firebaseAuth().currentUser;
    database()
    .ref("code-sessions/" + this.state.key)
    .set({
      content: "<h1> I ♥ Coding! </h1>",
      createdon: Date()
    });
    // adding details of the user to the database
    database()
    .ref("code-sessions/" + this.state.key + "/creator")
    .set({
        user_id: user.uid,
        user_name: user.displayName,
        user_email: user.email,
        user_photo: user.photoURL
    });
    this.props.history.push("/home/" + this.state.key);
  };

  // sign-out functionality
  handleLogout() {
    logout().then(function () {
        localStorage.removeItem(appTokenKey);
        localStorage.removeItem(sessionID);
        this.props.history.push("/login");
        console.log("User signed-out from firebase.");
    }.bind(this));
  }

  render() {
    return (
      <React.Fragment>
        <Header
          extras={this.state.num ? `Total ${this.state.num}+ Shares` : null}
        />
        <div className="homepage">
          <p className="title">
            {/* <span className="highlight">Coderoom</span> | <span className="highlight">Coding Ninjas</span> */}
            {/* <br /> */}
            {/* <br /> */}
            <br />
            Share Code within <span className="highlight">Realtime</span>.
            <br />
            Anywhere, Anytime and with <span className="highlight">Anyone</span>
            .
          </p>
          <p className="sub-title">
            Simple Realtime Code Sharing Editor App.
          </p>
          <div>
            <button className="btn" onClick={this.onNewGround}>
              Share Code
            </button>
            <button className="btn margin-l-15" onClick={this.handleLogout}>
              &nbsp;&nbsp;Sign Out&nbsp;&nbsp;
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
  
}