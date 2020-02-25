import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';

function HomeAuthScreen() {

    const [name, setName] = useState("");

    const responseGoogle = response => {
        console.log(response);
        setName(response.profileObj.name);
    };

    const responseGoogleFailure = response => {
        console.log("FAIL!");
        console.log(response);
    };

    return (
      <div>
        <h1>Login with Google</h1>
        <h3>Welcome: {name}</h3>
        <GoogleLogin
            clientId="569774987683-76cl113cql6gj77dl5f52mq7ma3ao9jd.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogleFailure}
            cookiePolicy={'single_host_origin'}
        />
      </div>
    );
  }

export default HomeAuthScreen;