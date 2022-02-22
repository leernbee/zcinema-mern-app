/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container, Button } from "reactstrap";
// core components

function IndexHeader() {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage:
              "url(" + require("../../assets/img/header.jpg") + ")"
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <div className="content-center brand">
            <img
              alt="..."
              className="n-logo"
              src={require("../../assets/img/z-logo.png")}
            ></img>
            <h1 className="h1-seo">ZCINEMA</h1>
            <h3>Buy your movie tickets online. Skip the line.</h3>
            <Button
              className="btn-round"
              color="info"
              href="/movies"
              role="button"
              size="lg"
            >
              Browse Movies
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
}

export default IndexHeader;
