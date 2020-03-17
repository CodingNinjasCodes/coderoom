import React from "react";
import { Helmet } from 'react-helmet';
import { FontIcon, RaisedButton } from "material-ui";
import { loginWithGoogle } from "../../helpers/auth";
import { firebaseAuth } from "../../config/firebase-config";
import logo from '../../images/CNLOGO.svg';

const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";
const sessionID = "sessionID";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        // console.log(this.props.match.params);

        this.state = {
            splashScreen: false
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
                localStorage.removeItem(sessionID);

            } else {
                // console.log("** sessionID absent **");
                // redirect to /home
                this.props.history.push(`/home`);
            }

            return;
        }

        // called whenever user sign-in/sign-out or token expires
        firebaseAuth().onAuthStateChanged(user => {
            if (user) {
                console.log("User signed in: ", user);

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