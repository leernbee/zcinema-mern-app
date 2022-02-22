import React from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import IndexNavbar from "../components/Navbars/IndexNavbar";
import PageHeader from "../components/Headers/PageHeader";
import DarkFooter from "../components/Footers/DarkFooter";

import QRCode from "qrcode.react";

const Completed = props => {
  React.useEffect(() => {
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });

  const [state, setState] = React.useState("");
  const [seats, setSeats] = React.useState("");
  const [qr, setQr] = React.useState("");

  React.useEffect(() => {
    setState(props.location.state);
    setSeats(props.location.state.seats.join(", "));
    setQr(props.location.state.token);
  }, [props.location.state]);

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <PageHeader title="Thank You" />
        <div className="section">
          <Container>
            <Row>
              <Col lg="10" className="mx-auto">
                <div className="tile">
                  <div className="header mb-3">{state.title}</div>

                  <div className="text-center">
                    <QRCode size={256} value={qr} />
                  </div>
                  <div className="dates row">
                    <div className="col-lg-4 text-center">
                      <strong>SCREEN</strong> {state.screen}
                    </div>
                    <div className="col-lg-4 text-center">
                      <strong>DATE</strong> {state.movieDate}
                    </div>
                    <div className="col-lg-4 text-center">
                      <strong>TIME</strong> {state.movieTime}
                    </div>
                  </div>

                  <div className="stats">
                    <div className="row">
                      <div className="col-lg-6 text-center">
                        <strong>SEATS</strong> {seats}
                      </div>

                      <div className="col-lg-6 text-center">
                        <strong>PRICE</strong> ₱{state.amount}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <DarkFooter />
      </div>
    </>
  );
};

export default Completed;
