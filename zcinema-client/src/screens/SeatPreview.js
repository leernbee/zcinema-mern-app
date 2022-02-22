import React, { useState, useEffect } from "react";
import useScript from "../utils/useScript";
import useStyle from "../utils/useStyle";

import classnames from "classnames";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";

import { Redirect, withRouter } from "react-router-dom";

import { useSelector } from "react-redux";

const publishableKey = "pk_test_96ppenuZv8WTb0GbYV9lKSZg00brCr9M4y";

const SeatPreview = props => {
  const { user } = useSelector(state => state.auth);

  useStyle("css/normalize.css");
  useStyle("css/demo.css");
  useStyle("css/component.css");
  useStyle("css/override.css");

  useScript("js/modernizr-custom.js");
  useScript("js/classie.js");
  useScript("js/main.js");

  const overlay = {
    position: "fixed",
    width: "100%",
    height: "100%",
    background: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "99999999999999"
  };

  const [loading, setLoading] = useState(true);

  const [seat, setSeat] = useState({});
  const [seatSelect, setSeatSelect] = useState({});
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);

  const [screen, setScreen] = useState(0);

  const onSeatSelect = e => {
    const seatno = e.target.dataset.tooltip;

    if (!seat[seatno]) {
      if (seatSelect[seatno] === undefined) {
        setSeatSelect({ ...seatSelect, [seatno]: false });
      }

      if (!seatSelect[seatno]) {
        setSeatSelect({ ...seatSelect, [seatno]: true });

        let ss = selected;
        ss.push(seatno);
        setSelected(ss.sort());

        setTotal(total + 345);
      } else {
        setSeatSelect({ ...seatSelect, [seatno]: false });

        let ss = selected;

        ss = ss.filter(sss => {
          return sss !== seatno;
        });
        setSelected(ss.sort());

        setTotal(total - 345);
      }
    }
  };

  const [movieDate, setMovieDate] = useState("");
  const [movieTime, setMovieTime] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [movieTrailer, setMovieTrailer] = useState("");

  useEffect(() => {
    const title = props.location.state.movie.title;
    const screen = props.location.state.movie.screen;
    const date = props.location.state.date;
    const time = props.location.state.time;
    const trailer = props.location.state.movie.trailer;

    setMovieDate(date);
    setMovieTime(time);
    setMovieTitle(title);
    setMovieTrailer(trailer);
    setScreen(parseInt(screen));

    let config = {
      params: {
        screen: screen,
        date: date,
        time: time
      }
    };

    axios
      .get("/api/seats/plan", config)
      .then(res => {
        loadSeats(res.data[0]);
      })
      .catch(err => {
        console.log(err.message);
      });

    setTimeout(() => {
      setLoading(false);
    }, 3000);
    // eslint-disable-next-line
  }, []);

  const loadSeats = data => {
    let seatsArr = {};
    for (var i = 0; i < data.seats.length; i++) {
      seatsArr[data.seats[i].no] = data.seats[i].reserved;
    }

    setSeat(seatsArr);
  };

  const [completed, setCompleted] = useState("");

  const onToken = token => {
    const body = {
      screen: screen,
      title: movieTitle,
      date: movieDate,
      time: movieTime,
      seats: selected,
      amount: total,
      token: token.id,
      user: user.id
    };

    axios
      .post("/api/transactions/complete", body)
      .then(res => {
        if (res.data) {
          setTimeout(() => {
            setCompleted(res.data);
          }, 1000);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    <>
      {completed && (
        <Redirect
          to={{
            pathname: "/completed",
            state: completed
          }}
        />
      )}

      {loading && (
        <>
          <div style={overlay}>
            <div className="spinner-border text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </>
      )}

      <header className="header">
        <h1 className="header__title">ZCinema Seat Selection</h1>
        <p className="note note--screen">Please view on a larger screen</p>
        <p className="note note--support">
          Sorry, but your browser doesn't support preserve-3d!
        </p>
      </header>

      <div className="container">
        <div className="cube">
          <div className="cube__side cube__side--front"></div>
          <div className="cube__side cube__side--back">
            <div className="screen">
              <div className="video">
                {movieTrailer !== "" && (
                  <embed
                    src={`https://www.youtube.com/embed/${movieTrailer}`}
                    allowFullScreen={false}
                    width="100%"
                    height="100%"
                  ></embed>
                )}
                <video
                  className="video-player d-none"
                  src=""
                  preload="auto"
                  poster=""
                >
                  <source src="" type='video/ogg; codecs="theora, vorbis"' />
                  <source
                    src=""
                    type='video/mp4; codecs="avc1.4D401E, mp4a.40.2"'
                  />
                  <p>
                    Sorry, but your browser does not support this video format.
                  </p>
                </video>
                <button
                  className="action action--play action--shown d-none"
                  aria-label="Play Video"
                ></button>
              </div>
              <div className="intro intro--shown">
                <div className="intro__side">
                  <h3 className="intro__title">
                    <span className="intro__up">
                      ZCinema <em>presents</em>
                    </span>
                    <span className="intro__down">{movieTitle}</span>
                  </h3>
                </div>
                <div className="intro__side">
                  <button className="action action--seats">
                    Select your seats
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="cube__side cube__side--left"></div>
          <div className="cube__side cube__side--right"></div>
          <div className="cube__side cube__side--top"></div>
          <div className="rows rows--large">
            <div className="row">
              <div data-seat="A1" className="row__seat"></div>
              <div data-seat="A2" className="row__seat"></div>
              <div data-seat="A3" className="row__seat"></div>
              <div data-seat="A4" className="row__seat"></div>
              <div data-seat="A5" className="row__seat"></div>
              <div data-seat="A6" className="row__seat"></div>
              <div data-seat="A7" className="row__seat"></div>
              <div data-seat="A8" className="row__seat"></div>
              <div data-seat="A9" className="row__seat"></div>
              <div data-seat="A10" className="row__seat"></div>
              <div data-seat="A11" className="row__seat"></div>
              <div data-seat="A12" className="row__seat"></div>
              <div data-seat="A13" className="row__seat"></div>
              <div data-seat="A14" className="row__seat"></div>
              <div data-seat="A15" className="row__seat"></div>
              <div data-seat="A16" className="row__seat"></div>
              <div data-seat="A17" className="row__seat"></div>
              <div data-seat="A18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="B1" className="row__seat"></div>
              <div data-seat="B2" className="row__seat"></div>
              <div data-seat="B3" className="row__seat"></div>
              <div data-seat="B4" className="row__seat"></div>
              <div data-seat="B5" className="row__seat"></div>
              <div data-seat="B6" className="row__seat"></div>
              <div data-seat="B7" className="row__seat"></div>
              <div data-seat="B8" className="row__seat"></div>
              <div data-seat="B9" className="row__seat"></div>
              <div data-seat="B10" className="row__seat"></div>
              <div data-seat="B11" className="row__seat"></div>
              <div data-seat="B12" className="row__seat"></div>
              <div data-seat="B13" className="row__seat"></div>
              <div data-seat="B14" className="row__seat"></div>
              <div data-seat="B15" className="row__seat"></div>
              <div data-seat="B16" className="row__seat"></div>
              <div data-seat="B17" className="row__seat"></div>
              <div data-seat="B18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="C1" className="row__seat"></div>
              <div data-seat="C2" className="row__seat"></div>
              <div data-seat="C3" className="row__seat"></div>
              <div data-seat="C4" className="row__seat"></div>
              <div data-seat="C5" className="row__seat"></div>
              <div data-seat="C6" className="row__seat"></div>
              <div data-seat="C7" className="row__seat"></div>
              <div data-seat="C8" className="row__seat"></div>
              <div data-seat="C9" className="row__seat"></div>
              <div data-seat="C10" className="row__seat"></div>
              <div data-seat="C11" className="row__seat"></div>
              <div data-seat="C12" className="row__seat"></div>
              <div data-seat="C13" className="row__seat"></div>
              <div data-seat="C14" className="row__seat"></div>
              <div data-seat="C15" className="row__seat"></div>
              <div data-seat="C16" className="row__seat"></div>
              <div data-seat="C17" className="row__seat"></div>
              <div data-seat="C18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="D1" className="row__seat"></div>
              <div data-seat="D2" className="row__seat"></div>
              <div data-seat="D3" className="row__seat"></div>
              <div data-seat="D4" className="row__seat"></div>
              <div data-seat="D5" className="row__seat"></div>
              <div data-seat="D6" className="row__seat"></div>
              <div data-seat="D7" className="row__seat"></div>
              <div data-seat="D8" className="row__seat"></div>
              <div data-seat="D9" className="row__seat"></div>
              <div data-seat="D10" className="row__seat"></div>
              <div data-seat="D11" className="row__seat"></div>
              <div data-seat="D12" className="row__seat"></div>
              <div data-seat="D13" className="row__seat"></div>
              <div data-seat="D14" className="row__seat"></div>
              <div data-seat="D15" className="row__seat"></div>
              <div data-seat="D16" className="row__seat"></div>
              <div data-seat="D17" className="row__seat"></div>
              <div data-seat="D18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="E1" className="row__seat"></div>
              <div data-seat="E2" className="row__seat"></div>
              <div data-seat="E3" className="row__seat"></div>
              <div data-seat="E4" className="row__seat"></div>
              <div data-seat="E5" className="row__seat"></div>
              <div data-seat="E6" className="row__seat"></div>
              <div data-seat="E7" className="row__seat"></div>
              <div data-seat="E8" className="row__seat"></div>
              <div data-seat="E9" className="row__seat"></div>
              <div data-seat="E10" className="row__seat"></div>
              <div data-seat="E11" className="row__seat"></div>
              <div data-seat="E12" className="row__seat"></div>
              <div data-seat="E13" className="row__seat"></div>
              <div data-seat="E14" className="row__seat"></div>
              <div data-seat="E15" className="row__seat"></div>
              <div data-seat="E16" className="row__seat"></div>
              <div data-seat="E17" className="row__seat"></div>
              <div data-seat="E18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="F1" className="row__seat"></div>
              <div data-seat="F2" className="row__seat"></div>
              <div data-seat="F3" className="row__seat"></div>
              <div data-seat="F4" className="row__seat"></div>
              <div data-seat="F5" className="row__seat"></div>
              <div data-seat="F6" className="row__seat"></div>
              <div data-seat="F7" className="row__seat"></div>
              <div data-seat="F8" className="row__seat"></div>
              <div data-seat="F9" className="row__seat"></div>
              <div data-seat="F10" className="row__seat"></div>
              <div data-seat="F11" className="row__seat"></div>
              <div data-seat="F12" className="row__seat"></div>
              <div data-seat="F13" className="row__seat"></div>
              <div data-seat="F14" className="row__seat"></div>
              <div data-seat="F15" className="row__seat"></div>
              <div data-seat="F16" className="row__seat"></div>
              <div data-seat="F17" className="row__seat"></div>
              <div data-seat="F18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="G1" className="row__seat"></div>
              <div data-seat="G2" className="row__seat"></div>
              <div data-seat="G3" className="row__seat"></div>
              <div data-seat="G4" className="row__seat"></div>
              <div data-seat="G5" className="row__seat"></div>
              <div data-seat="G6" className="row__seat"></div>
              <div data-seat="G7" className="row__seat"></div>
              <div data-seat="G8" className="row__seat"></div>
              <div data-seat="G9" className="row__seat"></div>
              <div data-seat="G10" className="row__seat"></div>
              <div data-seat="G11" className="row__seat"></div>
              <div data-seat="G12" className="row__seat"></div>
              <div data-seat="G13" className="row__seat"></div>
              <div data-seat="G14" className="row__seat"></div>
              <div data-seat="G15" className="row__seat"></div>
              <div data-seat="G16" className="row__seat"></div>
              <div data-seat="G17" className="row__seat"></div>
              <div data-seat="G18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="H1" className="row__seat"></div>
              <div data-seat="H2" className="row__seat"></div>
              <div data-seat="H3" className="row__seat"></div>
              <div data-seat="H4" className="row__seat"></div>
              <div data-seat="H5" className="row__seat"></div>
              <div data-seat="H6" className="row__seat"></div>
              <div data-seat="H7" className="row__seat"></div>
              <div data-seat="H8" className="row__seat"></div>
              <div data-seat="H9" className="row__seat"></div>
              <div data-seat="H10" className="row__seat"></div>
              <div data-seat="H11" className="row__seat"></div>
              <div data-seat="H12" className="row__seat"></div>
              <div data-seat="H13" className="row__seat"></div>
              <div data-seat="H14" className="row__seat"></div>
              <div data-seat="H15" className="row__seat"></div>
              <div data-seat="H16" className="row__seat"></div>
              <div data-seat="H17" className="row__seat"></div>
              <div data-seat="H18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="I1" className="row__seat"></div>
              <div data-seat="I2" className="row__seat"></div>
              <div data-seat="I3" className="row__seat"></div>
              <div data-seat="I4" className="row__seat"></div>
              <div data-seat="I5" className="row__seat"></div>
              <div data-seat="I6" className="row__seat"></div>
              <div data-seat="I7" className="row__seat"></div>
              <div data-seat="I8" className="row__seat"></div>
              <div data-seat="I9" className="row__seat"></div>
              <div data-seat="I10" className="row__seat"></div>
              <div data-seat="I11" className="row__seat"></div>
              <div data-seat="I12" className="row__seat"></div>
              <div data-seat="I13" className="row__seat"></div>
              <div data-seat="I14" className="row__seat"></div>
              <div data-seat="I15" className="row__seat"></div>
              <div data-seat="I16" className="row__seat"></div>
              <div data-seat="I17" className="row__seat"></div>
              <div data-seat="I18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="J1" className="row__seat"></div>
              <div data-seat="J2" className="row__seat"></div>
              <div data-seat="J3" className="row__seat"></div>
              <div data-seat="J4" className="row__seat"></div>
              <div data-seat="J5" className="row__seat"></div>
              <div data-seat="J6" className="row__seat"></div>
              <div data-seat="J7" className="row__seat"></div>
              <div data-seat="J8" className="row__seat"></div>
              <div data-seat="J9" className="row__seat"></div>
              <div data-seat="J10" className="row__seat"></div>
              <div data-seat="J11" className="row__seat"></div>
              <div data-seat="J12" className="row__seat"></div>
              <div data-seat="J13" className="row__seat"></div>
              <div data-seat="J14" className="row__seat"></div>
              <div data-seat="J15" className="row__seat"></div>
              <div data-seat="J16" className="row__seat"></div>
              <div data-seat="J17" className="row__seat"></div>
              <div data-seat="J18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="K1" className="row__seat"></div>
              <div data-seat="K2" className="row__seat"></div>
              <div data-seat="K3" className="row__seat"></div>
              <div data-seat="K4" className="row__seat"></div>
              <div data-seat="K5" className="row__seat"></div>
              <div data-seat="K6" className="row__seat"></div>
              <div data-seat="K7" className="row__seat"></div>
              <div data-seat="K8" className="row__seat"></div>
              <div data-seat="K9" className="row__seat"></div>
              <div data-seat="K10" className="row__seat"></div>
              <div data-seat="K11" className="row__seat"></div>
              <div data-seat="K12" className="row__seat"></div>
              <div data-seat="K13" className="row__seat"></div>
              <div data-seat="K14" className="row__seat"></div>
              <div data-seat="K15" className="row__seat"></div>
              <div data-seat="K16" className="row__seat"></div>
              <div data-seat="K17" className="row__seat"></div>
              <div data-seat="K18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="L1" className="row__seat"></div>
              <div data-seat="L2" className="row__seat"></div>
              <div data-seat="L3" className="row__seat"></div>
              <div data-seat="L4" className="row__seat"></div>
              <div data-seat="L5" className="row__seat"></div>
              <div data-seat="L6" className="row__seat"></div>
              <div data-seat="L7" className="row__seat"></div>
              <div data-seat="L8" className="row__seat"></div>
              <div data-seat="L9" className="row__seat"></div>
              <div data-seat="L10" className="row__seat"></div>
              <div data-seat="L11" className="row__seat"></div>
              <div data-seat="L12" className="row__seat"></div>
              <div data-seat="L13" className="row__seat"></div>
              <div data-seat="L14" className="row__seat"></div>
              <div data-seat="L15" className="row__seat"></div>
              <div data-seat="L16" className="row__seat"></div>
              <div data-seat="L17" className="row__seat"></div>
              <div data-seat="L18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="M1" className="row__seat"></div>
              <div data-seat="M2" className="row__seat"></div>
              <div data-seat="M3" className="row__seat"></div>
              <div data-seat="M4" className="row__seat"></div>
              <div data-seat="M5" className="row__seat"></div>
              <div data-seat="M6" className="row__seat"></div>
              <div data-seat="M7" className="row__seat"></div>
              <div data-seat="M8" className="row__seat"></div>
              <div data-seat="M9" className="row__seat"></div>
              <div data-seat="M10" className="row__seat"></div>
              <div data-seat="M11" className="row__seat"></div>
              <div data-seat="M12" className="row__seat"></div>
              <div data-seat="M13" className="row__seat"></div>
              <div data-seat="M14" className="row__seat"></div>
              <div data-seat="M15" className="row__seat"></div>
              <div data-seat="M16" className="row__seat"></div>
              <div data-seat="M17" className="row__seat"></div>
              <div data-seat="M18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="N1" className="row__seat"></div>
              <div data-seat="N2" className="row__seat"></div>
              <div data-seat="N3" className="row__seat"></div>
              <div data-seat="N4" className="row__seat"></div>
              <div data-seat="N5" className="row__seat"></div>
              <div data-seat="N6" className="row__seat"></div>
              <div data-seat="N7" className="row__seat"></div>
              <div data-seat="N8" className="row__seat"></div>
              <div data-seat="N9" className="row__seat"></div>
              <div data-seat="N10" className="row__seat"></div>
              <div data-seat="N11" className="row__seat"></div>
              <div data-seat="N12" className="row__seat"></div>
              <div data-seat="N13" className="row__seat"></div>
              <div data-seat="N14" className="row__seat"></div>
              <div data-seat="N15" className="row__seat"></div>
              <div data-seat="N16" className="row__seat"></div>
              <div data-seat="N17" className="row__seat"></div>
              <div data-seat="N18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="O1" className="row__seat"></div>
              <div data-seat="O2" className="row__seat"></div>
              <div data-seat="O3" className="row__seat"></div>
              <div data-seat="O4" className="row__seat"></div>
              <div data-seat="O5" className="row__seat"></div>
              <div data-seat="O6" className="row__seat"></div>
              <div data-seat="O7" className="row__seat"></div>
              <div data-seat="O8" className="row__seat"></div>
              <div data-seat="O9" className="row__seat"></div>
              <div data-seat="O10" className="row__seat"></div>
              <div data-seat="O11" className="row__seat"></div>
              <div data-seat="O12" className="row__seat"></div>
              <div data-seat="O13" className="row__seat"></div>
              <div data-seat="O14" className="row__seat"></div>
              <div data-seat="O15" className="row__seat"></div>
              <div data-seat="O16" className="row__seat"></div>
              <div data-seat="O17" className="row__seat"></div>
              <div data-seat="O18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="P1" className="row__seat"></div>
              <div data-seat="P2" className="row__seat"></div>
              <div data-seat="P3" className="row__seat"></div>
              <div data-seat="P4" className="row__seat"></div>
              <div data-seat="P5" className="row__seat"></div>
              <div data-seat="P6" className="row__seat"></div>
              <div data-seat="P7" className="row__seat"></div>
              <div data-seat="P8" className="row__seat"></div>
              <div data-seat="P9" className="row__seat"></div>
              <div data-seat="P10" className="row__seat"></div>
              <div data-seat="P11" className="row__seat"></div>
              <div data-seat="P12" className="row__seat"></div>
              <div data-seat="P13" className="row__seat"></div>
              <div data-seat="P14" className="row__seat"></div>
              <div data-seat="P15" className="row__seat"></div>
              <div data-seat="P16" className="row__seat"></div>
              <div data-seat="P17" className="row__seat"></div>
              <div data-seat="P18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="Q1" className="row__seat"></div>
              <div data-seat="Q2" className="row__seat"></div>
              <div data-seat="Q3" className="row__seat"></div>
              <div data-seat="Q4" className="row__seat"></div>
              <div data-seat="Q5" className="row__seat"></div>
              <div data-seat="Q6" className="row__seat"></div>
              <div data-seat="Q7" className="row__seat"></div>
              <div data-seat="Q8" className="row__seat"></div>
              <div data-seat="Q9" className="row__seat"></div>
              <div data-seat="Q10" className="row__seat"></div>
              <div data-seat="Q11" className="row__seat"></div>
              <div data-seat="Q12" className="row__seat"></div>
              <div data-seat="Q13" className="row__seat"></div>
              <div data-seat="Q14" className="row__seat"></div>
              <div data-seat="Q15" className="row__seat"></div>
              <div data-seat="Q16" className="row__seat"></div>
              <div data-seat="Q17" className="row__seat"></div>
              <div data-seat="Q18" className="row__seat"></div>
            </div>
            <div className="row">
              <div data-seat="R1" className="row__seat"></div>
              <div data-seat="R2" className="row__seat"></div>
              <div data-seat="R3" className="row__seat"></div>
              <div data-seat="R4" className="row__seat"></div>
              <div data-seat="R5" className="row__seat"></div>
              <div data-seat="R6" className="row__seat"></div>
              <div data-seat="R7" className="row__seat"></div>
              <div data-seat="R8" className="row__seat"></div>
              <div data-seat="R9" className="row__seat"></div>
              <div data-seat="R10" className="row__seat"></div>
              <div data-seat="R11" className="row__seat"></div>
              <div data-seat="R12" className="row__seat"></div>
              <div data-seat="R13" className="row__seat"></div>
              <div data-seat="R14" className="row__seat"></div>
              <div data-seat="R15" className="row__seat"></div>
              <div data-seat="R16" className="row__seat"></div>
              <div data-seat="R17" className="row__seat"></div>
              <div data-seat="R18" className="row__seat"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="plan">
        <h3 className="plan__title">Seating Plan</h3>
        <div className="rows rows--mini">
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A1,
                "row__seat--selected": seatSelect.A1
              })}
              onClick={onSeatSelect}
              data-tooltip="A1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A2,
                "row__seat--selected": seatSelect.A2
              })}
              onClick={onSeatSelect}
              data-tooltip="A2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A3,
                "row__seat--selected": seatSelect.A3
              })}
              onClick={onSeatSelect}
              data-tooltip="A3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A4,
                "row__seat--selected": seatSelect.A4
              })}
              onClick={onSeatSelect}
              data-tooltip="A4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A5,
                "row__seat--selected": seatSelect.A5
              })}
              onClick={onSeatSelect}
              data-tooltip="A5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A6,
                "row__seat--selected": seatSelect.A6
              })}
              onClick={onSeatSelect}
              data-tooltip="A6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A7,
                "row__seat--selected": seatSelect.A7
              })}
              onClick={onSeatSelect}
              data-tooltip="A7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A8,
                "row__seat--selected": seatSelect.A8
              })}
              onClick={onSeatSelect}
              data-tooltip="A8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A9,
                "row__seat--selected": seatSelect.A9
              })}
              onClick={onSeatSelect}
              data-tooltip="A9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A10,
                "row__seat--selected": seatSelect.A10
              })}
              onClick={onSeatSelect}
              data-tooltip="A10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A11,
                "row__seat--selected": seatSelect.A11
              })}
              onClick={onSeatSelect}
              data-tooltip="A11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A12,
                "row__seat--selected": seatSelect.A12
              })}
              onClick={onSeatSelect}
              data-tooltip="A12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A13,
                "row__seat--selected": seatSelect.A13
              })}
              onClick={onSeatSelect}
              data-tooltip="A13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A14,
                "row__seat--selected": seatSelect.A14
              })}
              onClick={onSeatSelect}
              data-tooltip="A14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A15,
                "row__seat--selected": seatSelect.A15
              })}
              onClick={onSeatSelect}
              data-tooltip="A15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A16,
                "row__seat--selected": seatSelect.A16
              })}
              onClick={onSeatSelect}
              data-tooltip="A16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A17,
                "row__seat--selected": seatSelect.A17
              })}
              onClick={onSeatSelect}
              data-tooltip="A17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.A18,
                "row__seat--selected": seatSelect.A18
              })}
              onClick={onSeatSelect}
              data-tooltip="A18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B1,
                "row__seat--selected": seatSelect.B1
              })}
              onClick={onSeatSelect}
              data-tooltip="B1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B2,
                "row__seat--selected": seatSelect.B2
              })}
              onClick={onSeatSelect}
              data-tooltip="B2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B3,
                "row__seat--selected": seatSelect.B3
              })}
              onClick={onSeatSelect}
              data-tooltip="B3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B4,
                "row__seat--selected": seatSelect.B4
              })}
              onClick={onSeatSelect}
              data-tooltip="B4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B5,
                "row__seat--selected": seatSelect.B5
              })}
              onClick={onSeatSelect}
              data-tooltip="B5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B6,
                "row__seat--selected": seatSelect.B6
              })}
              onClick={onSeatSelect}
              data-tooltip="B6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B7,
                "row__seat--selected": seatSelect.B7
              })}
              onClick={onSeatSelect}
              data-tooltip="B7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B8,
                "row__seat--selected": seatSelect.B8
              })}
              onClick={onSeatSelect}
              data-tooltip="B8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B9,
                "row__seat--selected": seatSelect.B9
              })}
              onClick={onSeatSelect}
              data-tooltip="B9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B10,
                "row__seat--selected": seatSelect.B10
              })}
              onClick={onSeatSelect}
              data-tooltip="B10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B11,
                "row__seat--selected": seatSelect.B11
              })}
              onClick={onSeatSelect}
              data-tooltip="B11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B12,
                "row__seat--selected": seatSelect.B12
              })}
              onClick={onSeatSelect}
              data-tooltip="B12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B13,
                "row__seat--selected": seatSelect.B13
              })}
              onClick={onSeatSelect}
              data-tooltip="B13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B14,
                "row__seat--selected": seatSelect.B14
              })}
              onClick={onSeatSelect}
              data-tooltip="B14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B15,
                "row__seat--selected": seatSelect.B15
              })}
              onClick={onSeatSelect}
              data-tooltip="B15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B16,
                "row__seat--selected": seatSelect.B16
              })}
              onClick={onSeatSelect}
              data-tooltip="B16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B17,
                "row__seat--selected": seatSelect.B17
              })}
              onClick={onSeatSelect}
              data-tooltip="B17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.B18,
                "row__seat--selected": seatSelect.B18
              })}
              onClick={onSeatSelect}
              data-tooltip="B18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C1,
                "row__seat--selected": seatSelect.C1
              })}
              onClick={onSeatSelect}
              data-tooltip="C1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C2,
                "row__seat--selected": seatSelect.C2
              })}
              onClick={onSeatSelect}
              data-tooltip="C2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C3,
                "row__seat--selected": seatSelect.C3
              })}
              onClick={onSeatSelect}
              data-tooltip="C3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C4,
                "row__seat--selected": seatSelect.C4
              })}
              onClick={onSeatSelect}
              data-tooltip="C4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C5,
                "row__seat--selected": seatSelect.C5
              })}
              onClick={onSeatSelect}
              data-tooltip="C5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C6,
                "row__seat--selected": seatSelect.C6
              })}
              onClick={onSeatSelect}
              data-tooltip="C6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C7,
                "row__seat--selected": seatSelect.C7
              })}
              onClick={onSeatSelect}
              data-tooltip="C7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C8,
                "row__seat--selected": seatSelect.C8
              })}
              onClick={onSeatSelect}
              data-tooltip="C8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C9,
                "row__seat--selected": seatSelect.C9
              })}
              onClick={onSeatSelect}
              data-tooltip="C9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C10,
                "row__seat--selected": seatSelect.C10
              })}
              onClick={onSeatSelect}
              data-tooltip="C10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C11,
                "row__seat--selected": seatSelect.C11
              })}
              onClick={onSeatSelect}
              data-tooltip="C11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C12,
                "row__seat--selected": seatSelect.C12
              })}
              onClick={onSeatSelect}
              data-tooltip="C12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C13,
                "row__seat--selected": seatSelect.C13
              })}
              onClick={onSeatSelect}
              data-tooltip="C13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C14,
                "row__seat--selected": seatSelect.C14
              })}
              onClick={onSeatSelect}
              data-tooltip="C14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C15,
                "row__seat--selected": seatSelect.C15
              })}
              onClick={onSeatSelect}
              data-tooltip="C15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C16,
                "row__seat--selected": seatSelect.C16
              })}
              onClick={onSeatSelect}
              data-tooltip="C16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C17,
                "row__seat--selected": seatSelect.C17
              })}
              onClick={onSeatSelect}
              data-tooltip="C17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.C18,
                "row__seat--selected": seatSelect.C18
              })}
              onClick={onSeatSelect}
              data-tooltip="C18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D1,
                "row__seat--selected": seatSelect.D1
              })}
              onClick={onSeatSelect}
              data-tooltip="D1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D2,
                "row__seat--selected": seatSelect.D2
              })}
              onClick={onSeatSelect}
              data-tooltip="D2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D3,
                "row__seat--selected": seatSelect.D3
              })}
              onClick={onSeatSelect}
              data-tooltip="D3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D4,
                "row__seat--selected": seatSelect.D4
              })}
              onClick={onSeatSelect}
              data-tooltip="D4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D5,
                "row__seat--selected": seatSelect.D5
              })}
              onClick={onSeatSelect}
              data-tooltip="D5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D6,
                "row__seat--selected": seatSelect.D6
              })}
              onClick={onSeatSelect}
              data-tooltip="D6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D7,
                "row__seat--selected": seatSelect.D7
              })}
              onClick={onSeatSelect}
              data-tooltip="D7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D8,
                "row__seat--selected": seatSelect.D8
              })}
              onClick={onSeatSelect}
              data-tooltip="D8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D9,
                "row__seat--selected": seatSelect.D9
              })}
              onClick={onSeatSelect}
              data-tooltip="D9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D10,
                "row__seat--selected": seatSelect.D10
              })}
              onClick={onSeatSelect}
              data-tooltip="D10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D11,
                "row__seat--selected": seatSelect.D11
              })}
              onClick={onSeatSelect}
              data-tooltip="D11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D12,
                "row__seat--selected": seatSelect.D12
              })}
              onClick={onSeatSelect}
              data-tooltip="D12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D13,
                "row__seat--selected": seatSelect.D13
              })}
              onClick={onSeatSelect}
              data-tooltip="D13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D14,
                "row__seat--selected": seatSelect.D14
              })}
              onClick={onSeatSelect}
              data-tooltip="D14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D15,
                "row__seat--selected": seatSelect.D15
              })}
              onClick={onSeatSelect}
              data-tooltip="D15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D16,
                "row__seat--selected": seatSelect.D16
              })}
              onClick={onSeatSelect}
              data-tooltip="D16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D17,
                "row__seat--selected": seatSelect.D17
              })}
              onClick={onSeatSelect}
              data-tooltip="D17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.D18,
                "row__seat--selected": seatSelect.D18
              })}
              onClick={onSeatSelect}
              data-tooltip="D18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E1,
                "row__seat--selected": seatSelect.E1
              })}
              onClick={onSeatSelect}
              data-tooltip="E1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E2,
                "row__seat--selected": seatSelect.E2
              })}
              onClick={onSeatSelect}
              data-tooltip="E2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E3,
                "row__seat--selected": seatSelect.E3
              })}
              onClick={onSeatSelect}
              data-tooltip="E3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E4,
                "row__seat--selected": seatSelect.E4
              })}
              onClick={onSeatSelect}
              data-tooltip="E4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E5,
                "row__seat--selected": seatSelect.E5
              })}
              onClick={onSeatSelect}
              data-tooltip="E5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E6,
                "row__seat--selected": seatSelect.E6
              })}
              onClick={onSeatSelect}
              data-tooltip="E6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E7,
                "row__seat--selected": seatSelect.E7
              })}
              onClick={onSeatSelect}
              data-tooltip="E7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E8,
                "row__seat--selected": seatSelect.E8
              })}
              onClick={onSeatSelect}
              data-tooltip="E8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E9,
                "row__seat--selected": seatSelect.E9
              })}
              onClick={onSeatSelect}
              data-tooltip="E9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E10,
                "row__seat--selected": seatSelect.E10
              })}
              onClick={onSeatSelect}
              data-tooltip="E10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E11,
                "row__seat--selected": seatSelect.E11
              })}
              onClick={onSeatSelect}
              data-tooltip="E11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E12,
                "row__seat--selected": seatSelect.E12
              })}
              onClick={onSeatSelect}
              data-tooltip="E12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E13,
                "row__seat--selected": seatSelect.E13
              })}
              onClick={onSeatSelect}
              data-tooltip="E13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E14,
                "row__seat--selected": seatSelect.E14
              })}
              onClick={onSeatSelect}
              data-tooltip="E14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E15,
                "row__seat--selected": seatSelect.E15
              })}
              onClick={onSeatSelect}
              data-tooltip="E15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E16,
                "row__seat--selected": seatSelect.E16
              })}
              onClick={onSeatSelect}
              data-tooltip="E16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E17,
                "row__seat--selected": seatSelect.E17
              })}
              onClick={onSeatSelect}
              data-tooltip="E17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.E18,
                "row__seat--selected": seatSelect.E18
              })}
              onClick={onSeatSelect}
              data-tooltip="E18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F1,
                "row__seat--selected": seatSelect.F1
              })}
              onClick={onSeatSelect}
              data-tooltip="F1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F2,
                "row__seat--selected": seatSelect.F2
              })}
              onClick={onSeatSelect}
              data-tooltip="F2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F3,
                "row__seat--selected": seatSelect.F3
              })}
              onClick={onSeatSelect}
              data-tooltip="F3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F4,
                "row__seat--selected": seatSelect.F4
              })}
              onClick={onSeatSelect}
              data-tooltip="F4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F5,
                "row__seat--selected": seatSelect.F5
              })}
              onClick={onSeatSelect}
              data-tooltip="F5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F6,
                "row__seat--selected": seatSelect.F6
              })}
              onClick={onSeatSelect}
              data-tooltip="F6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F7,
                "row__seat--selected": seatSelect.F7
              })}
              onClick={onSeatSelect}
              data-tooltip="F7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F8,
                "row__seat--selected": seatSelect.F8
              })}
              onClick={onSeatSelect}
              data-tooltip="F8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F9,
                "row__seat--selected": seatSelect.F9
              })}
              onClick={onSeatSelect}
              data-tooltip="F9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F10,
                "row__seat--selected": seatSelect.F10
              })}
              onClick={onSeatSelect}
              data-tooltip="F10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F11,
                "row__seat--selected": seatSelect.F11
              })}
              onClick={onSeatSelect}
              data-tooltip="F11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F12,
                "row__seat--selected": seatSelect.F12
              })}
              onClick={onSeatSelect}
              data-tooltip="F12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F13,
                "row__seat--selected": seatSelect.F13
              })}
              onClick={onSeatSelect}
              data-tooltip="F13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F14,
                "row__seat--selected": seatSelect.F14
              })}
              onClick={onSeatSelect}
              data-tooltip="F14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F15,
                "row__seat--selected": seatSelect.F15
              })}
              onClick={onSeatSelect}
              data-tooltip="F15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F16,
                "row__seat--selected": seatSelect.F16
              })}
              onClick={onSeatSelect}
              data-tooltip="F16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F17,
                "row__seat--selected": seatSelect.F17
              })}
              onClick={onSeatSelect}
              data-tooltip="F17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.F18,
                "row__seat--selected": seatSelect.F18
              })}
              onClick={onSeatSelect}
              data-tooltip="F18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G1,
                "row__seat--selected": seatSelect.G1
              })}
              onClick={onSeatSelect}
              data-tooltip="G1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G2,
                "row__seat--selected": seatSelect.G2
              })}
              onClick={onSeatSelect}
              data-tooltip="G2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G3,
                "row__seat--selected": seatSelect.G3
              })}
              onClick={onSeatSelect}
              data-tooltip="G3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G4,
                "row__seat--selected": seatSelect.G4
              })}
              onClick={onSeatSelect}
              data-tooltip="G4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G5,
                "row__seat--selected": seatSelect.G5
              })}
              onClick={onSeatSelect}
              data-tooltip="G5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G6,
                "row__seat--selected": seatSelect.G6
              })}
              onClick={onSeatSelect}
              data-tooltip="G6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G7,
                "row__seat--selected": seatSelect.G7
              })}
              onClick={onSeatSelect}
              data-tooltip="G7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G8,
                "row__seat--selected": seatSelect.G8
              })}
              onClick={onSeatSelect}
              data-tooltip="G8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G9,
                "row__seat--selected": seatSelect.G9
              })}
              onClick={onSeatSelect}
              data-tooltip="G9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G10,
                "row__seat--selected": seatSelect.G10
              })}
              onClick={onSeatSelect}
              data-tooltip="G10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G11,
                "row__seat--selected": seatSelect.G11
              })}
              onClick={onSeatSelect}
              data-tooltip="G11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G12,
                "row__seat--selected": seatSelect.G12
              })}
              onClick={onSeatSelect}
              data-tooltip="G12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G13,
                "row__seat--selected": seatSelect.G13
              })}
              onClick={onSeatSelect}
              data-tooltip="G13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G14,
                "row__seat--selected": seatSelect.G14
              })}
              onClick={onSeatSelect}
              data-tooltip="G14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G15,
                "row__seat--selected": seatSelect.G15
              })}
              onClick={onSeatSelect}
              data-tooltip="G15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G16,
                "row__seat--selected": seatSelect.G16
              })}
              onClick={onSeatSelect}
              data-tooltip="G16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G17,
                "row__seat--selected": seatSelect.G17
              })}
              onClick={onSeatSelect}
              data-tooltip="G17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.G18,
                "row__seat--selected": seatSelect.G18
              })}
              onClick={onSeatSelect}
              data-tooltip="G18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H1,
                "row__seat--selected": seatSelect.H1
              })}
              onClick={onSeatSelect}
              data-tooltip="H1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H2,
                "row__seat--selected": seatSelect.H2
              })}
              onClick={onSeatSelect}
              data-tooltip="H2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H3,
                "row__seat--selected": seatSelect.H3
              })}
              onClick={onSeatSelect}
              data-tooltip="H3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H4,
                "row__seat--selected": seatSelect.H4
              })}
              onClick={onSeatSelect}
              data-tooltip="H4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H5,
                "row__seat--selected": seatSelect.H5
              })}
              onClick={onSeatSelect}
              data-tooltip="H5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H6,
                "row__seat--selected": seatSelect.H6
              })}
              onClick={onSeatSelect}
              data-tooltip="H6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H7,
                "row__seat--selected": seatSelect.H7
              })}
              onClick={onSeatSelect}
              data-tooltip="H7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H8,
                "row__seat--selected": seatSelect.H8
              })}
              onClick={onSeatSelect}
              data-tooltip="H8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H9,
                "row__seat--selected": seatSelect.H9
              })}
              onClick={onSeatSelect}
              data-tooltip="H9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H10,
                "row__seat--selected": seatSelect.H10
              })}
              onClick={onSeatSelect}
              data-tooltip="H10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H11,
                "row__seat--selected": seatSelect.H11
              })}
              onClick={onSeatSelect}
              data-tooltip="H11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H12,
                "row__seat--selected": seatSelect.H12
              })}
              onClick={onSeatSelect}
              data-tooltip="H12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H13,
                "row__seat--selected": seatSelect.H13
              })}
              onClick={onSeatSelect}
              data-tooltip="H13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H14,
                "row__seat--selected": seatSelect.H14
              })}
              onClick={onSeatSelect}
              data-tooltip="H14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H15,
                "row__seat--selected": seatSelect.H15
              })}
              onClick={onSeatSelect}
              data-tooltip="H15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H16,
                "row__seat--selected": seatSelect.H16
              })}
              onClick={onSeatSelect}
              data-tooltip="H16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H17,
                "row__seat--selected": seatSelect.H17
              })}
              onClick={onSeatSelect}
              data-tooltip="H17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.H18,
                "row__seat--selected": seatSelect.H18
              })}
              onClick={onSeatSelect}
              data-tooltip="H18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I1,
                "row__seat--selected": seatSelect.I1
              })}
              onClick={onSeatSelect}
              data-tooltip="I1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I2,
                "row__seat--selected": seatSelect.I2
              })}
              onClick={onSeatSelect}
              data-tooltip="I2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I3,
                "row__seat--selected": seatSelect.I3
              })}
              onClick={onSeatSelect}
              data-tooltip="I3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I4,
                "row__seat--selected": seatSelect.I4
              })}
              onClick={onSeatSelect}
              data-tooltip="I4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I5,
                "row__seat--selected": seatSelect.I5
              })}
              onClick={onSeatSelect}
              data-tooltip="I5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I6,
                "row__seat--selected": seatSelect.I6
              })}
              onClick={onSeatSelect}
              data-tooltip="I6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I7,
                "row__seat--selected": seatSelect.I7
              })}
              onClick={onSeatSelect}
              data-tooltip="I7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I8,
                "row__seat--selected": seatSelect.I8
              })}
              onClick={onSeatSelect}
              data-tooltip="I8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I9,
                "row__seat--selected": seatSelect.I9
              })}
              onClick={onSeatSelect}
              data-tooltip="I9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I10,
                "row__seat--selected": seatSelect.I10
              })}
              onClick={onSeatSelect}
              data-tooltip="I10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I11,
                "row__seat--selected": seatSelect.I11
              })}
              onClick={onSeatSelect}
              data-tooltip="I11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I12,
                "row__seat--selected": seatSelect.I12
              })}
              onClick={onSeatSelect}
              data-tooltip="I12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I13,
                "row__seat--selected": seatSelect.I13
              })}
              onClick={onSeatSelect}
              data-tooltip="I13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I14,
                "row__seat--selected": seatSelect.I14
              })}
              onClick={onSeatSelect}
              data-tooltip="I14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I15,
                "row__seat--selected": seatSelect.I15
              })}
              onClick={onSeatSelect}
              data-tooltip="I15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I16,
                "row__seat--selected": seatSelect.I16
              })}
              onClick={onSeatSelect}
              data-tooltip="I16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I17,
                "row__seat--selected": seatSelect.I17
              })}
              onClick={onSeatSelect}
              data-tooltip="I17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.I18,
                "row__seat--selected": seatSelect.I18
              })}
              onClick={onSeatSelect}
              data-tooltip="I18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J1,
                "row__seat--selected": seatSelect.J1
              })}
              onClick={onSeatSelect}
              data-tooltip="J1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J2,
                "row__seat--selected": seatSelect.J2
              })}
              onClick={onSeatSelect}
              data-tooltip="J2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J3,
                "row__seat--selected": seatSelect.J3
              })}
              onClick={onSeatSelect}
              data-tooltip="J3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J4,
                "row__seat--selected": seatSelect.J4
              })}
              onClick={onSeatSelect}
              data-tooltip="J4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J5,
                "row__seat--selected": seatSelect.J5
              })}
              onClick={onSeatSelect}
              data-tooltip="J5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J6,
                "row__seat--selected": seatSelect.J6
              })}
              onClick={onSeatSelect}
              data-tooltip="J6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J7,
                "row__seat--selected": seatSelect.J7
              })}
              onClick={onSeatSelect}
              data-tooltip="J7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J8,
                "row__seat--selected": seatSelect.J8
              })}
              onClick={onSeatSelect}
              data-tooltip="J8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J9,
                "row__seat--selected": seatSelect.J9
              })}
              onClick={onSeatSelect}
              data-tooltip="J9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J10,
                "row__seat--selected": seatSelect.J10
              })}
              onClick={onSeatSelect}
              data-tooltip="J10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J11,
                "row__seat--selected": seatSelect.J11
              })}
              onClick={onSeatSelect}
              data-tooltip="J11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J12,
                "row__seat--selected": seatSelect.J12
              })}
              onClick={onSeatSelect}
              data-tooltip="J12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J13,
                "row__seat--selected": seatSelect.J13
              })}
              onClick={onSeatSelect}
              data-tooltip="J13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J14,
                "row__seat--selected": seatSelect.J14
              })}
              onClick={onSeatSelect}
              data-tooltip="J14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J15,
                "row__seat--selected": seatSelect.J15
              })}
              onClick={onSeatSelect}
              data-tooltip="J15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J16,
                "row__seat--selected": seatSelect.J16
              })}
              onClick={onSeatSelect}
              data-tooltip="J16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J17,
                "row__seat--selected": seatSelect.J17
              })}
              onClick={onSeatSelect}
              data-tooltip="J17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.J18,
                "row__seat--selected": seatSelect.J18
              })}
              onClick={onSeatSelect}
              data-tooltip="J18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K1,
                "row__seat--selected": seatSelect.K1
              })}
              onClick={onSeatSelect}
              data-tooltip="K1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K2,
                "row__seat--selected": seatSelect.K2
              })}
              onClick={onSeatSelect}
              data-tooltip="K2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K3,
                "row__seat--selected": seatSelect.K3
              })}
              onClick={onSeatSelect}
              data-tooltip="K3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K4,
                "row__seat--selected": seatSelect.K4
              })}
              onClick={onSeatSelect}
              data-tooltip="K4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K5,
                "row__seat--selected": seatSelect.K5
              })}
              onClick={onSeatSelect}
              data-tooltip="K5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K6,
                "row__seat--selected": seatSelect.K6
              })}
              onClick={onSeatSelect}
              data-tooltip="K6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K7,
                "row__seat--selected": seatSelect.K7
              })}
              onClick={onSeatSelect}
              data-tooltip="K7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K8,
                "row__seat--selected": seatSelect.K8
              })}
              onClick={onSeatSelect}
              data-tooltip="K8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K9,
                "row__seat--selected": seatSelect.K9
              })}
              onClick={onSeatSelect}
              data-tooltip="K9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K10,
                "row__seat--selected": seatSelect.K10
              })}
              onClick={onSeatSelect}
              data-tooltip="K10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K11,
                "row__seat--selected": seatSelect.K11
              })}
              onClick={onSeatSelect}
              data-tooltip="K11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K12,
                "row__seat--selected": seatSelect.K12
              })}
              onClick={onSeatSelect}
              data-tooltip="K12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K13,
                "row__seat--selected": seatSelect.K13
              })}
              onClick={onSeatSelect}
              data-tooltip="K13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K14,
                "row__seat--selected": seatSelect.K14
              })}
              onClick={onSeatSelect}
              data-tooltip="K14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K15,
                "row__seat--selected": seatSelect.K15
              })}
              onClick={onSeatSelect}
              data-tooltip="K15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K16,
                "row__seat--selected": seatSelect.K16
              })}
              onClick={onSeatSelect}
              data-tooltip="K16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K17,
                "row__seat--selected": seatSelect.K17
              })}
              onClick={onSeatSelect}
              data-tooltip="K17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.K18,
                "row__seat--selected": seatSelect.K18
              })}
              onClick={onSeatSelect}
              data-tooltip="K18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L1,
                "row__seat--selected": seatSelect.L1
              })}
              onClick={onSeatSelect}
              data-tooltip="L1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L2,
                "row__seat--selected": seatSelect.L2
              })}
              onClick={onSeatSelect}
              data-tooltip="L2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L3,
                "row__seat--selected": seatSelect.L3
              })}
              onClick={onSeatSelect}
              data-tooltip="L3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L4,
                "row__seat--selected": seatSelect.L4
              })}
              onClick={onSeatSelect}
              data-tooltip="L4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L5,
                "row__seat--selected": seatSelect.L5
              })}
              onClick={onSeatSelect}
              data-tooltip="L5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L6,
                "row__seat--selected": seatSelect.L6
              })}
              onClick={onSeatSelect}
              data-tooltip="L6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L7,
                "row__seat--selected": seatSelect.L7
              })}
              onClick={onSeatSelect}
              data-tooltip="L7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L8,
                "row__seat--selected": seatSelect.L8
              })}
              onClick={onSeatSelect}
              data-tooltip="L8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L9,
                "row__seat--selected": seatSelect.L9
              })}
              onClick={onSeatSelect}
              data-tooltip="L9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L10,
                "row__seat--selected": seatSelect.L10
              })}
              onClick={onSeatSelect}
              data-tooltip="L10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L11,
                "row__seat--selected": seatSelect.L11
              })}
              onClick={onSeatSelect}
              data-tooltip="L11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L12,
                "row__seat--selected": seatSelect.L12
              })}
              onClick={onSeatSelect}
              data-tooltip="L12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L13,
                "row__seat--selected": seatSelect.L13
              })}
              onClick={onSeatSelect}
              data-tooltip="L13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L14,
                "row__seat--selected": seatSelect.L14
              })}
              onClick={onSeatSelect}
              data-tooltip="L14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L15,
                "row__seat--selected": seatSelect.L15
              })}
              onClick={onSeatSelect}
              data-tooltip="L15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L16,
                "row__seat--selected": seatSelect.L16
              })}
              onClick={onSeatSelect}
              data-tooltip="L16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L17,
                "row__seat--selected": seatSelect.L17
              })}
              onClick={onSeatSelect}
              data-tooltip="L17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.L18,
                "row__seat--selected": seatSelect.L18
              })}
              onClick={onSeatSelect}
              data-tooltip="L18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M1,
                "row__seat--selected": seatSelect.M1
              })}
              onClick={onSeatSelect}
              data-tooltip="M1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M2,
                "row__seat--selected": seatSelect.M2
              })}
              onClick={onSeatSelect}
              data-tooltip="M2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M3,
                "row__seat--selected": seatSelect.M3
              })}
              onClick={onSeatSelect}
              data-tooltip="M3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M4,
                "row__seat--selected": seatSelect.M4
              })}
              onClick={onSeatSelect}
              data-tooltip="M4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M5,
                "row__seat--selected": seatSelect.M5
              })}
              onClick={onSeatSelect}
              data-tooltip="M5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M6,
                "row__seat--selected": seatSelect.M6
              })}
              onClick={onSeatSelect}
              data-tooltip="M6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M7,
                "row__seat--selected": seatSelect.M7
              })}
              onClick={onSeatSelect}
              data-tooltip="M7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M8,
                "row__seat--selected": seatSelect.M8
              })}
              onClick={onSeatSelect}
              data-tooltip="M8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M9,
                "row__seat--selected": seatSelect.M9
              })}
              onClick={onSeatSelect}
              data-tooltip="M9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M10,
                "row__seat--selected": seatSelect.M10
              })}
              onClick={onSeatSelect}
              data-tooltip="M10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M11,
                "row__seat--selected": seatSelect.M11
              })}
              onClick={onSeatSelect}
              data-tooltip="M11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M12,
                "row__seat--selected": seatSelect.M12
              })}
              onClick={onSeatSelect}
              data-tooltip="M12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M13,
                "row__seat--selected": seatSelect.M13
              })}
              onClick={onSeatSelect}
              data-tooltip="M13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M14,
                "row__seat--selected": seatSelect.M14
              })}
              onClick={onSeatSelect}
              data-tooltip="M14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M15,
                "row__seat--selected": seatSelect.M15
              })}
              onClick={onSeatSelect}
              data-tooltip="M15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M16,
                "row__seat--selected": seatSelect.M16
              })}
              onClick={onSeatSelect}
              data-tooltip="M16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M17,
                "row__seat--selected": seatSelect.M17
              })}
              onClick={onSeatSelect}
              data-tooltip="M17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.M18,
                "row__seat--selected": seatSelect.M18
              })}
              onClick={onSeatSelect}
              data-tooltip="M18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N1,
                "row__seat--selected": seatSelect.N1
              })}
              onClick={onSeatSelect}
              data-tooltip="N1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N2,
                "row__seat--selected": seatSelect.N2
              })}
              onClick={onSeatSelect}
              data-tooltip="N2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N3,
                "row__seat--selected": seatSelect.N3
              })}
              onClick={onSeatSelect}
              data-tooltip="N3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N4,
                "row__seat--selected": seatSelect.N4
              })}
              onClick={onSeatSelect}
              data-tooltip="N4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N5,
                "row__seat--selected": seatSelect.N5
              })}
              onClick={onSeatSelect}
              data-tooltip="N5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N6,
                "row__seat--selected": seatSelect.N6
              })}
              onClick={onSeatSelect}
              data-tooltip="N6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N7,
                "row__seat--selected": seatSelect.N7
              })}
              onClick={onSeatSelect}
              data-tooltip="N7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N8,
                "row__seat--selected": seatSelect.N8
              })}
              onClick={onSeatSelect}
              data-tooltip="N8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N9,
                "row__seat--selected": seatSelect.N9
              })}
              onClick={onSeatSelect}
              data-tooltip="N9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N10,
                "row__seat--selected": seatSelect.N10
              })}
              onClick={onSeatSelect}
              data-tooltip="N10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N11,
                "row__seat--selected": seatSelect.N11
              })}
              onClick={onSeatSelect}
              data-tooltip="N11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N12,
                "row__seat--selected": seatSelect.N12
              })}
              onClick={onSeatSelect}
              data-tooltip="N12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N13,
                "row__seat--selected": seatSelect.N13
              })}
              onClick={onSeatSelect}
              data-tooltip="N13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N14,
                "row__seat--selected": seatSelect.N14
              })}
              onClick={onSeatSelect}
              data-tooltip="N14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N15,
                "row__seat--selected": seatSelect.N15
              })}
              onClick={onSeatSelect}
              data-tooltip="N15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N16,
                "row__seat--selected": seatSelect.N16
              })}
              onClick={onSeatSelect}
              data-tooltip="N16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N17,
                "row__seat--selected": seatSelect.N17
              })}
              onClick={onSeatSelect}
              data-tooltip="N17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.N18,
                "row__seat--selected": seatSelect.N18
              })}
              onClick={onSeatSelect}
              data-tooltip="N18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O1,
                "row__seat--selected": seatSelect.O1
              })}
              onClick={onSeatSelect}
              data-tooltip="O1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O2,
                "row__seat--selected": seatSelect.O2
              })}
              onClick={onSeatSelect}
              data-tooltip="O2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O3,
                "row__seat--selected": seatSelect.O3
              })}
              onClick={onSeatSelect}
              data-tooltip="O3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O4,
                "row__seat--selected": seatSelect.O4
              })}
              onClick={onSeatSelect}
              data-tooltip="O4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O5,
                "row__seat--selected": seatSelect.O5
              })}
              onClick={onSeatSelect}
              data-tooltip="O5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O6,
                "row__seat--selected": seatSelect.O6
              })}
              onClick={onSeatSelect}
              data-tooltip="O6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O7,
                "row__seat--selected": seatSelect.O7
              })}
              onClick={onSeatSelect}
              data-tooltip="O7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O8,
                "row__seat--selected": seatSelect.O8
              })}
              onClick={onSeatSelect}
              data-tooltip="O8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O9,
                "row__seat--selected": seatSelect.O9
              })}
              onClick={onSeatSelect}
              data-tooltip="O9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O10,
                "row__seat--selected": seatSelect.O10
              })}
              onClick={onSeatSelect}
              data-tooltip="O10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O11,
                "row__seat--selected": seatSelect.O11
              })}
              onClick={onSeatSelect}
              data-tooltip="O11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O12,
                "row__seat--selected": seatSelect.O12
              })}
              onClick={onSeatSelect}
              data-tooltip="O12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O13,
                "row__seat--selected": seatSelect.O13
              })}
              onClick={onSeatSelect}
              data-tooltip="O13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O14,
                "row__seat--selected": seatSelect.O14
              })}
              onClick={onSeatSelect}
              data-tooltip="O14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O15,
                "row__seat--selected": seatSelect.O15
              })}
              onClick={onSeatSelect}
              data-tooltip="O15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O16,
                "row__seat--selected": seatSelect.O16
              })}
              onClick={onSeatSelect}
              data-tooltip="O16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O17,
                "row__seat--selected": seatSelect.O17
              })}
              onClick={onSeatSelect}
              data-tooltip="O17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.O18,
                "row__seat--selected": seatSelect.O18
              })}
              onClick={onSeatSelect}
              data-tooltip="O18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P1,
                "row__seat--selected": seatSelect.P1
              })}
              onClick={onSeatSelect}
              data-tooltip="P1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P2,
                "row__seat--selected": seatSelect.P2
              })}
              onClick={onSeatSelect}
              data-tooltip="P2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P3,
                "row__seat--selected": seatSelect.P3
              })}
              onClick={onSeatSelect}
              data-tooltip="P3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P4,
                "row__seat--selected": seatSelect.P4
              })}
              onClick={onSeatSelect}
              data-tooltip="P4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P5,
                "row__seat--selected": seatSelect.P5
              })}
              onClick={onSeatSelect}
              data-tooltip="P5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P6,
                "row__seat--selected": seatSelect.P6
              })}
              onClick={onSeatSelect}
              data-tooltip="P6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P7,
                "row__seat--selected": seatSelect.P7
              })}
              onClick={onSeatSelect}
              data-tooltip="P7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P8,
                "row__seat--selected": seatSelect.P8
              })}
              onClick={onSeatSelect}
              data-tooltip="P8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P9,
                "row__seat--selected": seatSelect.P9
              })}
              onClick={onSeatSelect}
              data-tooltip="P9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P10,
                "row__seat--selected": seatSelect.P10
              })}
              onClick={onSeatSelect}
              data-tooltip="P10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P11,
                "row__seat--selected": seatSelect.P11
              })}
              onClick={onSeatSelect}
              data-tooltip="P11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P12,
                "row__seat--selected": seatSelect.P12
              })}
              onClick={onSeatSelect}
              data-tooltip="P12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P13,
                "row__seat--selected": seatSelect.P13
              })}
              onClick={onSeatSelect}
              data-tooltip="P13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P14,
                "row__seat--selected": seatSelect.P14
              })}
              onClick={onSeatSelect}
              data-tooltip="P14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P15,
                "row__seat--selected": seatSelect.P15
              })}
              onClick={onSeatSelect}
              data-tooltip="P15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P16,
                "row__seat--selected": seatSelect.P16
              })}
              onClick={onSeatSelect}
              data-tooltip="P16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P17,
                "row__seat--selected": seatSelect.P17
              })}
              onClick={onSeatSelect}
              data-tooltip="P17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.P18,
                "row__seat--selected": seatSelect.P18
              })}
              onClick={onSeatSelect}
              data-tooltip="P18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q1,
                "row__seat--selected": seatSelect.Q1
              })}
              onClick={onSeatSelect}
              data-tooltip="Q1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q2,
                "row__seat--selected": seatSelect.Q2
              })}
              onClick={onSeatSelect}
              data-tooltip="Q2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q3,
                "row__seat--selected": seatSelect.Q3
              })}
              onClick={onSeatSelect}
              data-tooltip="Q3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q4,
                "row__seat--selected": seatSelect.Q4
              })}
              onClick={onSeatSelect}
              data-tooltip="Q4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q5,
                "row__seat--selected": seatSelect.Q5
              })}
              onClick={onSeatSelect}
              data-tooltip="Q5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q6,
                "row__seat--selected": seatSelect.Q6
              })}
              onClick={onSeatSelect}
              data-tooltip="Q6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q7,
                "row__seat--selected": seatSelect.Q7
              })}
              onClick={onSeatSelect}
              data-tooltip="Q7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q8,
                "row__seat--selected": seatSelect.Q8
              })}
              onClick={onSeatSelect}
              data-tooltip="Q8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q9,
                "row__seat--selected": seatSelect.Q9
              })}
              onClick={onSeatSelect}
              data-tooltip="Q9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q10,
                "row__seat--selected": seatSelect.Q10
              })}
              onClick={onSeatSelect}
              data-tooltip="Q10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q11,
                "row__seat--selected": seatSelect.Q11
              })}
              onClick={onSeatSelect}
              data-tooltip="Q11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q12,
                "row__seat--selected": seatSelect.Q12
              })}
              onClick={onSeatSelect}
              data-tooltip="Q12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q13,
                "row__seat--selected": seatSelect.Q13
              })}
              onClick={onSeatSelect}
              data-tooltip="Q13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q14,
                "row__seat--selected": seatSelect.Q14
              })}
              onClick={onSeatSelect}
              data-tooltip="Q14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q15,
                "row__seat--selected": seatSelect.Q15
              })}
              onClick={onSeatSelect}
              data-tooltip="Q15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q16,
                "row__seat--selected": seatSelect.Q16
              })}
              onClick={onSeatSelect}
              data-tooltip="Q16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q17,
                "row__seat--selected": seatSelect.Q17
              })}
              onClick={onSeatSelect}
              data-tooltip="Q17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.Q18,
                "row__seat--selected": seatSelect.Q18
              })}
              onClick={onSeatSelect}
              data-tooltip="Q18"
            ></div>
          </div>
          <div className="row">
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R1,
                "row__seat--selected": seatSelect.R1
              })}
              onClick={onSeatSelect}
              data-tooltip="R1"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R2,
                "row__seat--selected": seatSelect.R2
              })}
              onClick={onSeatSelect}
              data-tooltip="R2"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R3,
                "row__seat--selected": seatSelect.R3
              })}
              onClick={onSeatSelect}
              data-tooltip="R3"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R4,
                "row__seat--selected": seatSelect.R4
              })}
              onClick={onSeatSelect}
              data-tooltip="R4"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R5,
                "row__seat--selected": seatSelect.R5
              })}
              onClick={onSeatSelect}
              data-tooltip="R5"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R6,
                "row__seat--selected": seatSelect.R6
              })}
              onClick={onSeatSelect}
              data-tooltip="R6"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R7,
                "row__seat--selected": seatSelect.R7
              })}
              onClick={onSeatSelect}
              data-tooltip="R7"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R8,
                "row__seat--selected": seatSelect.R8
              })}
              onClick={onSeatSelect}
              data-tooltip="R8"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R9,
                "row__seat--selected": seatSelect.R9
              })}
              onClick={onSeatSelect}
              data-tooltip="R9"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R10,
                "row__seat--selected": seatSelect.R10
              })}
              onClick={onSeatSelect}
              data-tooltip="R10"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R11,
                "row__seat--selected": seatSelect.R11
              })}
              onClick={onSeatSelect}
              data-tooltip="R11"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R12,
                "row__seat--selected": seatSelect.R12
              })}
              onClick={onSeatSelect}
              data-tooltip="R12"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R13,
                "row__seat--selected": seatSelect.R13
              })}
              onClick={onSeatSelect}
              data-tooltip="R13"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R14,
                "row__seat--selected": seatSelect.R14
              })}
              onClick={onSeatSelect}
              data-tooltip="R14"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R15,
                "row__seat--selected": seatSelect.R15
              })}
              onClick={onSeatSelect}
              data-tooltip="R15"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R16,
                "row__seat--selected": seatSelect.R16
              })}
              onClick={onSeatSelect}
              data-tooltip="R16"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R17,
                "row__seat--selected": seatSelect.R17
              })}
              onClick={onSeatSelect}
              data-tooltip="R17"
            ></div>
            <div
              className={classnames("row__seat tooltip", {
                "row__seat--reserved": seat.R18,
                "row__seat--selected": seatSelect.R18
              })}
              onClick={onSeatSelect}
              data-tooltip="R18"
            ></div>
          </div>
        </div>

        <ul className="legend mb-3">
          <li className="legend__item legend__item--free">Free</li>
          <li className="legend__item legend__item--reserved">Reserved</li>
          <li className="legend__item legend__item--selected">Selected</li>
        </ul>
        <div className="text-center">
          <span>Total: ₱</span>
          {total}
        </div>

        <StripeCheckout
          amount={parseInt(total.toString().concat("00"))}
          email={user.email}
          description="Movie Ticket"
          locale="auto"
          name="ZCinema"
          stripeKey={publishableKey}
          token={onToken}
          label="Checkout"
          currency="PHP"
        >
          <button className="action action--buy" disabled={!total}>
            Checkout
          </button>
        </StripeCheckout>
      </div>

      <button
        className="action action--lookaround action--disabled"
        arial-label="Unlook View"
      ></button>
    </>
  );
};

export default withRouter(SeatPreview);
