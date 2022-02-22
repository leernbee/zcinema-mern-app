import axios from "axios";

import {
  GET_MOVIES,
  ADD_MOVIE,
  DELETE_MOVIE,
  SET_CURRENT_MOVIE,
  CLEAR_CURRENT_MOVIE,
  UPDATE_MOVIE,
  CLEAR_MOVIES,
  GET_ERRORS
} from "./types";

export const getMovies = () => dispatch => {
  return axios
    .get("/api/movies")
    .then(res => {
      dispatch({
        type: GET_MOVIES,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const addMovie = (movieState, file) => dispatch => {
  let formData = new FormData();

  formData.append("file", file[0].file);
  formData.append("title", movieState.title);
  formData.append("screen", movieState.screen);
  formData.append("trailer", movieState.trailer);

  return axios({
    method: "post",
    url: "/api/movies",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(res => {
      dispatch({
        type: ADD_MOVIE,
        payload: res.data
      });

      return true;
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const deleteMovie = id => dispatch => {
  return axios
    .delete(`/api/movies/${id}`)
    .then(res => {
      dispatch({
        type: DELETE_MOVIE,
        payload: id
      });

      return true;
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const updateMovie = (movieState, file) => dispatch => {
  let formData = new FormData();

  if (file.length) {
    formData.append("file", file[0].file);
  }

  formData.append("title", movieState.title);
  formData.append("screen", movieState.screen);
  formData.append("trailer", movieState.trailer);

  return axios({
    method: "put",
    url: `/api/movies/${movieState._id}`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" }
  })
    .then(res => {
      dispatch({
        type: UPDATE_MOVIE,
        payload: res.data
      });

      return true;
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const clearMovies = () => dispatch => {
  dispatch({ type: CLEAR_MOVIES });
};

export const setCurrent = movie => dispatch => {
  dispatch({ type: SET_CURRENT_MOVIE, payload: movie });
};

export const clearCurrent = () => dispatch => {
  dispatch({ type: CLEAR_CURRENT_MOVIE });
};
