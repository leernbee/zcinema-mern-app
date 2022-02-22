import React, { useEffect } from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import IndexNavbar from "../components/Navbars/IndexNavbar";
import PageHeader from "../components/Headers/PageHeader";
import DarkFooter from "../components/Footers/DarkFooter";

const About = props => {
  useEffect(() => {
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");

    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <PageHeader title="About" />
        <div className="section">
          <Container>
            <Row>
              <Col>
                <p>
                  <strong>ZCinema</strong> is an online movie ticket booking
                  application made with MERN Stack.
                </p>
                <p>
                  Credits:
                  <br />
                  <a href="https://www.creative-tim.com/product/now-ui-kit-react">
                    https://www.creative-tim.com/product/now-ui-kit-react
                  </a>
                  <br />
                  <a href="https://tympanus.net/codrops/2016/01/12/cinema-seat-preview-experiment">
                    https://tympanus.net/codrops/2016/01/12/cinema-seat-preview-experiment/
                  </a>
                </p>
                <p>Use the ff. credentials for testing</p>
                <p>
                  Accounts:
                  <br />
                  admin@cnetmail.net/password
                  <br />
                  member@cnetmail.net/password
                </p>

                <p>
                  Credit Card:
                  <br />
                  4242 4242 4242 4242
                  <br />
                  03/22 123
                </p>
              </Col>
            </Row>
          </Container>
        </div>
        <DarkFooter />
      </div>
    </>
  );
};

export default About;
