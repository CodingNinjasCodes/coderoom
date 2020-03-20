import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { createBrowserHistory } from "history";
import Login from "./pages/Login";
import Coding from "./pages/Coding";
import Home from './pages/Home';

const muiTheme = getMuiTheme({
  appBar: {
      color: "#37517E",
      height: 50
  },
});

const customHistory = createBrowserHistory();

class App extends Component {
  
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={customHistory}>
        <div className="App">
          <Route path="/login" component={Login}/>
          <Route exact path="/" component={Home}/>
          <Route exact path="/home" component={Home}/>
          <Route exact path="/home/:sessionid" component={Coding}/>
        </div>
      </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;