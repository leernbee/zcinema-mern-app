import React, { useEffect } from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import IndexNavbar from "../components/Navbars/IndexNavbar";
import PageHeader from "../components/Headers/PageHeader";
import DarkFooter from "../components/Footers/DarkFooter";

import MovieForm from "../components/movies/MovieForm";
import Movies from "../components/movies/Movies";

import { useSelector } from "react-redux";

const AdminMovies = props => {
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");

    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });

  useEffect(() => {
    if (auth.user.role === "user") {
      props.history.push("/signin");
    }
  }, [props.history, auth.user.role]);

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <PageHeader title="Movies" />
        <div className="section">
          <Container>
            <Row>
              <Col lg="5" className="mb-lg-0 mb-3">
                <MovieForm />
              </Col>
              <Col lg="7">
                <Movies />
              </Col>
            </Row>
          </Container>
        </div>
        <DarkFooter />
      </div>
    </>
  );
};

export default AdminMovies;
