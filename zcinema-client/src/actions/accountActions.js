import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS } from "./types";

import { setCurrentUser, logoutUser } from "./authActions";

export const updateProfile = name => dispatch => {
  return axios
    .put("/api/account/update", name)
    .then(res => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));

      return true;
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const changePassword = passwords => dispatch => {
  axios
    .put("/api/account/changepassword", passwords)
    .then(res => {
      if (res.data.success) {
        dispatch(logoutUser());
      }
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
