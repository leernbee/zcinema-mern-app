import React from "react";

// reactstrap components
import { Container } from "reactstrap";

import { useSelector } from "react-redux";
// core components

function AccountHeader() {
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

  const auth = useSelector(state => state.auth);

  const [name, setName] = React.useState("");

  React.useEffect(() => {
    setName(auth.user.name);
  }, [auth.user]);

  return (
    <>
      <div
        className="page-header clear-filter account-header-small"
        filter-color="blue"
      >
        <div
          className="page-header-image"
          style={{
            backgroundImage:
              "url(" + require("../../assets/img/movie-posters.jpg") + ")"
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <h3 className="title">Hi, {name}</h3>
        </Container>
      </div>
    </>
  );
}

export default AccountHeader;
