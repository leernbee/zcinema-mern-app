import React, { useState, useEffect } from "react";

import classnames from "classnames";
import { Form, FormGroup, Input, Label } from "reactstrap";

import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

import { useDispatch, useSelector } from "react-redux";
import {
  addMovie,
  updateMovie,
  clearCurrent
} from "../../actions/movieActions";

const MovieForm = () => {
  const movies = useSelector(state => state.movies);
  const errors = useSelector(state => state.errors);
  const dispatch = useDispatch();

  useEffect(() => {
    if (movies.current !== null) {
      setMovieState(movies.current);
    } else {
      setMovieState({
        title: "",
        screen: "",
        trailer: ""
      });
    }
  }, [movies]);

  const [state, setState] = useState({
    errors: {}
  });

  useEffect(() => {
    if (errors) {
      setState({ ...state, errors: errors });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  const [movieState, setMovieState] = useState({
    title: "",
    screen: "",
    trailer: ""
  });

  const { title, screen, trailer } = movieState;

  const onChange = e =>
    setMovieState({ ...movieState, [e.target.name]: e.target.value });

  const clearAll = () => {
    dispatch(clearCurrent());
    setState({ ...state, errors: {} });
    setSubmit(true);
  };
  const [files, setFiles] = useState([]);
  const onSubmit = async e => {
    e.preventDefault();
    setSubmit(true);
    let success = false;

    if (movies.current === null) {
      success = await dispatch(addMovie(movieState, files));

      if (success === true) {
        setState({ ...state, errors: {} });
        setFiles([]);
      } else {
        setSubmit(false);
      }
    } else {
      success = await dispatch(updateMovie(movieState, files));

      if (success === true) {
        setState({ ...state, errors: {} });
        setFiles([]);
      } else {
        setSubmit(false);
      }
    }

    if (success === true) {
      setSubmit(false);
      clearAll();
    }
  };

  const [submit, setSubmit] = useState(true);

  useEffect(() => {
    setSubmit(true);
    if (files.length !== 0) {
      setSubmit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    if (movies.current) {
      setSubmit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies.current]);

  return (
    <Form onSubmit={onSubmit}>
      <h3>{movies.current ? "Edit Movie" : "Add Movie"}</h3>

      <FormGroup>
        <Label>Screen</Label>
        <Input
          onChange={onChange}
          value={screen}
          type="text"
          name="screen"
          id="screen"
          placeholder="Screen"
        />
      </FormGroup>
      <div
        className={classnames("text-danger", {
          "mb-2": state.errors.screen
        })}
      >
        {state.errors.screen}
      </div>
      <FormGroup>
        <Label>Title</Label>
        <Input
          onChange={onChange}
          value={title}
          type="text"
          name="title"
          id="title"
          placeholder="Title"
        />
      </FormGroup>
      <div
        className={classnames("text-danger", {
          "mb-2": state.errors.title
        })}
      >
        {state.errors.title}
      </div>
      <FormGroup>
        <Label>Poster</Label>
      </FormGroup>
      <FilePond
        files={files}
        allowMultiple={false}
        onupdatefiles={setFiles}
        labelIdle='Drag & Drop the image or <span class="filepond--label-action">Browse</span>'
        onremovefile={file => {
          setFiles([]);
        }}
      />
      <FormGroup>
        <Label>Trailer</Label>
        <Input
          onChange={onChange}
          value={trailer}
          type="text"
          name="trailer"
          id="trailer"
          placeholder="Youtube ID"
        />
      </FormGroup>
      <div
        className={classnames("text-danger", {
          "mb-2": state.errors.trailer
        })}
      >
        {state.errors.trailer}
      </div>
      <div>
        <input
          disabled={submit}
          type="submit"
          value={movies.current ? "Update Movie" : "Add Movie"}
          className="btn btn-primary btn-block"
        />
      </div>
      {movies.current && (
        <div>
          <button className="btn btn-light btn-block" onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </Form>
  );
};

export default MovieForm;
