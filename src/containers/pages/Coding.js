import React from "react";
import CodeMirror from "react-codemirror";
import Header from "../../components/Header/Header";
import SideDrawer from '../../components/SideDrawer/SideDrawer';
import Backdrop from '../../components/Backdrop/Backdrop';
import { database } from "firebase/app";
import { firebaseAuth } from "../../config/firebase-config";
import { logout } from "../../helpers/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import "codemirror/lib/codemirror";
import "codemirror/lib/codemirror.css";
import 'codemirror/mode/xml/xml';
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/trailingspace';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/comment/comment';

const appTokenKey = "appToken";
const sessionID = "sessionID";
const usersList = [];

export default class CodingPage extends React.Component {

  constructor(props) {
    super(props);

    const session_id = this.props.match.params.sessionid;
    // console.log(session_id);

    // if appTokenKey is not found in localStorage,
    // then redirect to login page
    if (!localStorage.getItem(appTokenKey)) {
      localStorage.setItem("sessionID", session_id);
      this.props.history.push(`/login`);
      return;
    }

    // setting initial state
    this.state = {
        sideDrawerOpen: false,
        code: "Loading...",
        cursorPosition: {
          line: 0,
          ch: 0
        },
    };

    this.handleLogout = this.handleLogout.bind(this);

    // to fetch currently signed-in user
    firebaseAuth().onAuthStateChanged((user) => {
      try {
        if (user) {
          
          // displaying users-connected from database
          database()
          .ref(`code-sessions/${session_id}/users-connected`)
          .on("value", function(snapshot){
              // console.log("\nConnected users: ");
              var i = 0;
              snapshot.forEach(function(childSnapshot){
                  var userData = childSnapshot.val();
                  // console.log(userData.user_name + " - " + userData.user_email);
                  usersList.push(
                      <li key={i}>
                          <img src={userData.user_photo} alt="Avatar" />
                          <span>{userData.user_name}</span>
                      </li>
                  );
                  i++;
              });
              // console.log("\n");
          });

        } else {
          console.log("Cannot fetch currently signed-in user.");
        }
      } catch(error) {
        console.log("Error in authentication.");
      }
    });
  }
    
  // setting initial state
  state = {
    sideDrawerOpen: false,
    code: "Loading...",
    cursorPosition: {
      line: 0,
      ch: 0
    }
  };

  componentDidMount = () => {
    const { params } = this.props.match;
    let self = this;
    database()
      .ref("/code-sessions/" + params.sessionid)
      .once("value")
      .then(snapshot => {
        // trimmimg the Date() to remove unnecessary add-ons
        var createdOn = snapshot.val().createdon;
        var createdOnCompressed = createdOn.substring(0, 25);
        self.setState({ code: snapshot.val().content + "", createdon: createdOnCompressed }, () => {
          // fetching content from db and setting on the editor
          let content = snapshot.val().content;
          self.codemirror.getCodeMirror().setValue(content);
          // console.log(this.codemirror.getCodeMirror());
        });
        
        this.codeRef = database().ref("code-sessions/" + params.sessionid);
        // whenever changes are made:
        // "code" is updated from the db
        // cursor position is updated (changeCursorPos() is called)
        // code on the editor screen is updated from the db
        this.codeRef.on("value", function(snapshot) {
          self.setState({
            code: snapshot.val().content
          });
          var currentCursorPos = self.state.cursorPosition;
          self.codemirror.getCodeMirror().setValue(snapshot.val().content);
          self.setState({ cursorPosition: currentCursorPos });
          self.changeCursorPos();
        });
      })
      .catch(e => {
        // no session found corresponding to "sessionid" passed in the params
        self.codemirror.getCodeMirror().setValue("No Sessions Found!");
      });
  };

  // updating cursor position
  changeCursorPos = () => {
    const { line, ch } = this.state.cursorPosition;
    this.codemirror.getCodeMirror().doc.setCursor(line, ch);
  };

  // called whenever code is changed
  onChange = (newVal, change) => {
    // console.log(newVal, change);
    this.setState({
        cursorPosition: {
          line: this.codemirror.getCodeMirror().doc.getCursor().line,
          ch: this.codemirror.getCodeMirror().doc.getCursor().ch
        }
      },
      () => {}
    );
    // updating data
    this.codeRef.child("content").set(newVal);
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

  // sidebar toggle handler
  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };

  // backdrop (dull background) handler
  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };

  render() {

    let backdrop;
    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />
    }

    return (
      <React.Fragment>

        <Header
          style={{ background: "#1d1f27" }}
          extras={
            <div>
              {this.state.createdon
                ? `Created On: ${this.state.createdon}`
                : ""}
              <button className="btn-coding margin-l-10" onClick={this.handleLogout}>
                Sign Out
              </button>
              <button className="btn-coding margin-l-10" onClick={this.drawerToggleClickHandler}>
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
          }
        />

        <SideDrawer show={this.state.sideDrawerOpen} />
        { backdrop }
        
        <div className="coding-page">
          <CodeMirror
            ref={r => (this.codemirror = r)}
            className="code-mirror-container"
            value={this.state.code}
            onChange={this.onChange}
            options={{
              mode: "xml",
              theme: "dracula",
              lineNumbers: true,
              readOnly: false,
              autoCloseTags: true,
              matchBrackets: true,
              autoCloseBrackets: true,
              matchTags: true,
              showTrailingSpace: true,
              extraKeys: {
                  'Ctrl-Space' : 'autocomplete',
                  'Cmd-/' : 'toggleComment',
                  'Ctrl-/' : 'toggleComment'
              }
            }}
          />
        </div>
      </React.Fragment>
    );
  }

}

// exporting connected-users list
export {usersList};