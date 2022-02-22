import {
  GET_MOVIES,
  ADD_MOVIE,
  DELETE_MOVIE,
  SET_CURRENT_MOVIE,
  CLEAR_CURRENT_MOVIE,
  UPDATE_MOVIE,
  CLEAR_MOVIES
} from "../actions/types";

const initialState = {
  movies: null,
  current: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MOVIES:
      return {
        ...state,
        movies: action.payload,
        loading: false
      };
    case ADD_MOVIE:
      return {
        ...state,
        movies: [action.payload, ...state.movies],
        loading: false
      };
    case UPDATE_MOVIE:
      return {
        ...state,
        movies: state.movies.map(movie =>
          movie._id === action.payload._id ? action.payload : movie
        ),
        loading: false
      };
    case DELETE_MOVIE:
      return {
        ...state,
        movies: state.movies.filter(movie => movie._id !== action.payload),
        loading: false
      };
    case CLEAR_MOVIES:
      return {
        ...state,
        movies: null,
        current: null
      };
    case SET_CURRENT_MOVIE:
      return {
        ...state,
        current: action.payload
      };
    case CLEAR_CURRENT_MOVIE:
      return {
        ...state,
        current: null
      };
    default:
      return state;
  }
}
