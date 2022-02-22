import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/PrivateRoute";

import "./assets/css/bootstrap.min.css";
import "./assets/scss/now-ui-kit.scss";
import "./assets/demo/demo.css";
import "./custom.css";

import Home from "./screens/Home";
import About from "./screens/About";
import Signin from "./screens/Signin";
import Register from "./screens/Register";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import Account from "./screens/Account";
import AdminMovies from "./screens/AdminMovies";
import Movies from "./screens/Movies";
import SeatPreview from "./screens/SeatPreview";
import Completed from "./screens/Completed";
import AdminTransactions from "./screens/AdminTransactions";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./signin";
  }
}

const App = () => {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" exact component={About} />
            <Route path="/signin" exact component={Signin} />
            <Route path="/register" exact component={Register} />
            <Route path="/confirm/:token" exact component={Signin} />
            <Route path="/forgot-password" exact component={ForgotPassword} />
            <Route
              path="/reset-password/:token"
              exact
              component={ResetPassword}
            />
            <Route path="/movies" exact component={Movies} />
            <PrivateRoute path="/seatpreview" exact component={SeatPreview} />
            <PrivateRoute path="/account" exact component={Account} />
            <PrivateRoute path="/admin/movies" exact component={AdminMovies} />
            <PrivateRoute path="/completed" exact component={Completed} />
            <PrivateRoute
              path="/admin/transactions"
              exact
              component={AdminTransactions}
            />
          </Switch>
        </Router>
      </Provider>
    </>
  );
};

export default App;
