import React, { useEffect, useState, Fragment } from "react";
import moment from "moment";
// core components
import IndexNavbar from "../components/Navbars/IndexNavbar";
import PageHeader from "../components/Headers/PageHeader";
import DarkFooter from "../components/Footers/DarkFooter";

import { Container, Button, Modal, ModalBody } from "reactstrap";

import setAuthToken from "../utils/setAuthToken";
import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";

import { useDispatch, useSelector } from "react-redux";
import { getMovies } from "../actions/movieActions";

const Movies = props => {
  const auth = useSelector(state => state.auth);
  const { movies } = useSelector(state => state.movies);
  // const errors = useSelector(state => state.errors);
  const dispatch = useDispatch();

  React.useEffect(() => {
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");

    timeMovie();

    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });

  useEffect(() => {
    if (localStorage.jwtToken) {
      // Set auth token header auth
      const token = localStorage.jwtToken;
      setAuthToken(token);
    }

    dispatch(getMovies());
    // eslint-disable-next-line
  }, []);

  // const [screen, setScreen] = useState(0);
  // const [title, setTitle] = useState("");

  const [selectedMovie, setSelectedMovie] = useState({
    movie: {}
  });

  const onBuyTicket = id => {
    if (!auth.isAuthenticated) props.history.push("/signin");

    setSelectedMovie({
      ...selectedMovie,
      movie: movies.filter(movie => {
        return movie._id === id;
      })[0]
    });

    // setTitle(selectedMovie[0].title);
    // setScreen(screen);
    // setTrailer(trailer);
    setModal2(true);
  };

  const [showing, setShowing] = useState("");

  const [showingDate, setShowingDate] = useState("");

  const timeMovie = () => {
    let dateToday = moment().format("ddd D MMM");
    let dateTomorrow = moment()
      .add(1, "day")
      .format("ddd D MMM");

    let timeNow = moment().add(1, "hours");

    let time1st = moment("12:00pm", "h:mma");
    let time2nd = moment("3:00pm", "h:mma");
    let time3nd = moment("6:00pm", "h:mma");
    let time4th = moment("9:00pm", "h:mma");

    if (timeNow.isBefore(time1st)) {
      setShowing(dateToday + " - " + time1st.format("h:mma"));
      setShowingDate(dateToday);
    } else if (timeNow.isBefore(time2nd)) {
      setShowing(dateToday + " - " + time2nd.format("h:mma"));
      setShowingDate(dateToday);
    } else if (timeNow.isBefore(time3nd)) {
      setShowing(dateToday + " - " + time3nd.format("h:mma"));
      setShowingDate(dateToday);
    } else if (timeNow.isBefore(time4th)) {
      setShowing(dateToday + " - " + time4th.format("h:mma"));
      setShowingDate(dateToday);
    } else {
      setShowing(dateTomorrow + " - " + time1st.format("h:mma"));
      setShowingDate(dateTomorrow);
    }
  };

  const [modal2, setModal2] = useState(false);
  // const [trailer, setTrailer] = useState("");

  const timeSelect = time => {
    // props.history.push(
    //   `/seatpreview?title=${title}&screen=${screen}&date=${showingDate}&time=${time}&trailer=${trailer}`
    // );
    const movie = selectedMovie.movie;
    props.history.push({
      pathname: "/seatpreview",
      state: { movie, time, date: showingDate }
    });
  };

  const [isOpen, setIsOpen] = useState(false);

  const openModal = screen => {
    setIsOpen({ [screen]: true });
  };

  const timeSelection = () => {
    let timeNow = moment().add(1, "hours");

    let time1st = moment("12:00pm", "h:mma");
    let time2nd = moment("3:00pm", "h:mma");
    let time3nd = moment("6:00pm", "h:mma");
    let time4th = moment("9:00pm", "h:mma");

    let time1disabled = false;
    let time2disabled = false;
    let time3disabled = false;
    let time4disabled = false;

    if (timeNow.isBefore(time1st)) {
      time1disabled = false;
      time2disabled = false;
      time3disabled = false;
      time4disabled = false;
    } else if (timeNow.isBefore(time2nd)) {
      time1disabled = true;
      time2disabled = false;
      time3disabled = false;
      time4disabled = false;
    } else if (timeNow.isBefore(time3nd)) {
      time1disabled = true;
      time2disabled = true;
      time3disabled = false;
      time4disabled = false;
    } else if (timeNow.isBefore(time4th)) {
      time1disabled = true;
      time2disabled = true;
      time3disabled = true;
      time4disabled = false;
    } else {
      time1disabled = false;
      time2disabled = false;
      time3disabled = false;
      time4disabled = false;
    }

    return (
      <>
        <div className="mx-auto text-center">
          <Button
            className="btn-neutral"
            color="info"
            type="button"
            onClick={() => timeSelect("12:00pm")}
            disabled={time1disabled}
          >
            12:00pm
          </Button>
        </div>
        <div className="mx-auto text-center">
          <Button
            className="btn-neutral"
            color="info"
            type="button"
            onClick={() => timeSelect("3:00pm")}
            disabled={time2disabled}
          >
            3:00pm
          </Button>
        </div>
        <div className="mx-auto text-center">
          <Button
            className="btn-neutral"
            color="info"
            type="button"
            onClick={() => timeSelect("6:00pm")}
            disabled={time3disabled}
          >
            6:00pm
          </Button>
        </div>
        <div className="mx-auto text-center">
          <Button
            className="btn-neutral"
            color="info"
            type="button"
            onClick={() => timeSelect("9:00pm")}
            disabled={time4disabled}
          >
            9:00pm
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Modal */}
      <Modal
        modalClassName="modal-mini modal-info"
        toggle={() => setModal2(false)}
        isOpen={modal2}
      >
        <div className="modal-header justify-content-center">
          Screen {selectedMovie.movie.screen}
        </div>
        <ModalBody>
          <p>Date: {showingDate}</p>
          {timeSelection()}
        </ModalBody>
        <div className="modal-footer">
          <div className="mx-auto text-center">
            <Button
              className="btn-neutral"
              color="link"
              type="button"
              onClick={() => setModal2(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <IndexNavbar />
      <div className="wrapper">
        <PageHeader title="Now Showing" />
        <div className="section">
          <Container className="movie-container">
            {movies == null || movies.length === 0 ? (
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              movies.map((movie, index) => (
                <Fragment key={index}>
                  <ModalVideo
                    channel="youtube"
                    isOpen={isOpen[movie.screen]}
                    videoId={movie.trailer}
                    onClose={() => setIsOpen({ [movie.screen]: false })}
                  />
                  <div className="movie-card">
                    <div
                      className="movie-header poster"
                      style={{
                        background: `url(${movie.poster})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    >
                      <div className="header-icon-container">
                        <a href="#play" onClick={() => openModal(movie.screen)}>
                          <i className="header-icon fas fa-play"></i>
                        </a>
                      </div>
                    </div>
                    <div className="movie-content">
                      <div className="movie-content-header">
                        <a href="#play">
                          <h3 className="movie-title">{movie.title}</h3>
                        </a>
                        <div className="imax-logo"></div>
                      </div>
                      <div className="movie-info">
                        <div className="info-section">
                          <label>Date & Time</label>
                          <span>{showing}</span>
                        </div>
                        <div className="info-section">
                          <label>Screen</label>
                          <span>{movie.screen}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button
                        color="info"
                        onClick={() => onBuyTicket(movie._id)}
                      >
                        Buy Ticket
                      </Button>
                    </div>
                  </div>
                </Fragment>
              ))
            )}
          </Container>
        </div>
        <DarkFooter />
      </div>
    </>
  );
};

export default Movies;
