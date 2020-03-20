import React from "react";
import random from "random-key";
import logo from '../../images/CNLOGO.svg';
import { Helmet } from 'react-helmet';
import { FontIcon, RaisedButton } from "material-ui";
import { loginWithGoogle } from "../../helpers/auth";
import { firebaseAuth } from "../../config/firebase-config";
import { database } from "firebase/app";

const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";
const sessionID = "sessionID";
const usersList = [];

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        // console.log(this.props.match.params);

        this.state = {
            splashScreen: false,
            key: random.generate(3), // for storing connected-users
        };

        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    }

    // handling the google login
    handleGoogleLogin() {
        loginWithGoogle()
            .catch(function (error) {
                alert(error);
                localStorage.removeItem(firebaseAuthKey);
            });
        // if got sucess store a AuthKey in the localStorage
        localStorage.setItem(firebaseAuthKey, "1");
    }

    componentWillMount() {

        // checking for appTokenKey in localStorage if it exists
        if (localStorage.getItem(appTokenKey)) {

            if (localStorage.getItem(sessionID)) {
                // console.log("** sessionID present **");
                const session_id = localStorage.getItem(sessionID);
                // redirect to /home/:session_id
                this.props.history.push(`/home/${session_id}`);
                // localStorage.removeItem(sessionID);

            } else {
                // console.log("** sessionID absent **");
                // redirect to /home
                this.props.history.push(`/home`);
            }

            return;
        }

        // called whenever user sign-in/sign-out or token expires
        firebaseAuth().onAuthStateChanged(user => {
            try {
                if (user) {

                    if (localStorage.getItem(sessionID)) {
                        const session_id = localStorage.getItem(sessionID);

                        var newUser;

                        // checking if user already present in database
                        database()
                        .ref(`code-sessions/${session_id}/users-connected`)
                        .on("value", function(snapshot){
                            snapshot.forEach(function(childSnapshot){
                                var userData = childSnapshot.val();
                                if(userData.user_id === user.uid){
                                    newUser = false;
                                    // console.log("User already connected previously.");
                                }
                            });
                            if(newUser !== false){
                                newUser = true;
                            }
                        })

                        function firebaseDelay(key) {

                            // adding new user details in database
                            if(newUser === true){
                                // console.log("User connected to the session.");
                                database()
                                .ref(`code-sessions/${session_id}/users-connected/user-` + key)
                                .set({
                                    user_id: user.uid,
                                    user_name: user.displayName,
                                    user_email: user.email,
                                    user_photo: user.photoURL
                                });
                            }

                            // displaying users-connected from database
                            database()
                            .ref(`code-sessions/${session_id}/users-connected`)
                            .on("value", function(snapshot){
                                console.log("\nConnected users: ");
                                snapshot.forEach(function(childSnapshot){
                                    var userData = childSnapshot.val();
                                    console.log(userData.user_name + " - " + userData.user_email);
                                    // pushing user details to the 'usersList' array
                                    usersList.push(
                                        <li>
                                            <img src={userData.user_photo} alt="Avatar" />
                                            <span>{userData.user_name}</span>
                                        </li>
                                    );
                                });
                                console.log("\n");
                            });

                        }

                        // wait 4 seconds to complete fetching and storing data in database
                        setTimeout(firebaseDelay, 4000, this.state.key);

                    }
                    
                    // console.log("User signed in: ", JSON.stringify(user));
                    console.log("\n User signed in:", user);

                    localStorage.removeItem(firebaseAuthKey);

                    // setting appTokenKey as "uid" of signed-in user
                    localStorage.setItem(appTokenKey, user.uid);

                    if (localStorage.getItem(sessionID)) {
                        const session_id = localStorage.getItem(sessionID);
                        // console.log("** sessionID present **");
                        // redirect to /home/:session_id
                        this.props.history.push(`/home/${session_id}`);
                        localStorage.removeItem(sessionID);
                    } else {
                        // console.log("** sessionID absent **");
                        // redirect to /home
                        this.props.history.push(`/home`);
                    }

                }
            } catch(error) {
                console.log("Error in authentication.");
            }
        });
    }

    render() {
        // console.log(firebaseAuthKey + "=" + localStorage.getItem(firebaseAuthKey));

        // if AuthKey is present in localStorage, 
        // then splashScreen (spinning loading icon) is displayed
        if (localStorage.getItem(firebaseAuthKey) === "1")
            return (
                <div className="header-comp">
                    <SplashScreen />
                </div>
            );

        // else, Login page (sign-in page) is called
        return <LoginPage handleGoogleLogin={this.handleGoogleLogin} />;
    }
}

const iconStyles = {
    color: "#ffffff"
};

// Sign-in with Google button and handling login after clicking
const LoginPage = ({ handleGoogleLogin }) => (
    <div className="header-loginPage">
        <Helmet>
            <style>{'body { background-color: #ffffff; }'}</style>
        </Helmet>
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="heading-login">Login</h1>
        <div>
            <RaisedButton
                label="Sign in with Google"
                labelColor={"#ffffff"}
                backgroundColor="#dd4b39"
                icon={<FontIcon className="fa fa-google-plus" style={iconStyles} />}
                onClick={handleGoogleLogin}
            />
        </div>
    </div>
);

const SplashScreen = () => (
    <div className="text-center">
        <Helmet>
            <style>{'body { background-color: #000000; }'}</style>
        </Helmet>
        {/* Spinning Logo: */}
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
);

// exporting connected-users list
export {usersList};