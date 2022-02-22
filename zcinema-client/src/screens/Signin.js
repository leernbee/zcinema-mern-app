import React, { useState, useEffect } from "react";
import { withRouter, useParams } from "react-router-dom";
import PropTypes from "prop-types";

import IndexNavbar from "../components/Navbars/IndexNavbar";
import DarkFooter from "../components/Footers/DarkFooter";

import classnames from "classnames";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Alert
} from "reactstrap";
import queryString from "query-string";

// import { GoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, confirmEmail } from "../actions/authActions";

const Signin = props => {
  const [emailFocus, setEmailFocus] = React.useState(false);
  const [passwordFocus, setPasswordFocus] = React.useState(false);

  React.useEffect(() => {
    document.body.classList.add("index-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("index-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });

  const [alert1, setAlert1] = React.useState(false);
  const [alert2, setAlert2] = React.useState(false);
  const [alert3, setAlert3] = React.useState(false);

  let { token } = useParams();

  const confirm = async token => {
    const success = await dispatch(confirmEmail(token, props.history));

    if (success === true) {
      setAlert1(true);
    }
  };

  useEffect(() => {
    const values = queryString.parse(props.location.search);

    if (values.confirm === "show") {
      setAlert2(true);
    }

    if (values.reset === "show") {
      setAlert3(true);
    }

    if (token !== undefined) {
      confirm(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auth = useSelector(state => state.auth);
  const errors = useSelector(state => state.errors);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    email: "",
    password: "",
    errors: {}
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      props.history.push("/");
    }

    if (errors) {
      setState({ ...state, errors: errors });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, auth.isAuthenticated, props.history]);

  const onChange = e => {
    setState({ ...state, [e.target.id]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: state.email,
      password: state.password
    };

    dispatch(loginUser(userData, props.history));
  };

  // const responseGoogle = response => {
  //   console.log(response);
  // };

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        {/* Signin */}
        <div className="page-header clear-filter" filter-color="blue">
          <div
            className="page-header-image"
            style={{
              backgroundImage:
                "url(" + require("../assets/img/header.jpg") + ")"
            }}
          ></div>
          <div className="content">
            <Container>
              <Row>
                <Col lg="8" className="mx-auto">
                  {alert1 && (
                    <Alert color="primary" isOpen={alert1}>
                      <Container className="text-left">
                        <div className="alert-icon">
                          <i className="now-ui-icons ui-2_like"></i>
                        </div>
                        <strong>Email confirmed!</strong> You can now sign in.
                        <button
                          type="button"
                          className="close"
                          onClick={() => setAlert1(false)}
                        >
                          <span aria-hidden="true">
                            <i className="now-ui-icons ui-1_simple-remove"></i>
                          </span>
                        </button>
                      </Container>
                    </Alert>
                  )}
                  {alert2 && (
                    <Alert color="primary" isOpen={alert2}>
                      <Container className="text-left">
                        <div className="alert-icon">
                          <i className="now-ui-icons travel_info"></i>
                        </div>
                        <strong>Confirm your email!</strong> Please check your
                        inbox for a confirmation email.
                        <button
                          type="button"
                          className="close"
                          onClick={() => setAlert2(false)}
                        >
                          <span aria-hidden="true">
                            <i className="now-ui-icons ui-1_simple-remove"></i>
                          </span>
                        </button>
                      </Container>
                    </Alert>
                  )}
                  {alert3 && (
                    <Alert color="primary" isOpen={alert3}>
                      <Container className="text-left">
                        <div className="alert-icon">
                          <i className="now-ui-icons travel_info"></i>
                        </div>
                        <strong>Password reset success!</strong> You can now
                        login using your new password.
                        <button
                          type="button"
                          className="close"
                          onClick={() => setAlert3(false)}
                        >
                          <span aria-hidden="true">
                            <i className="now-ui-icons ui-1_simple-remove"></i>
                          </span>
                        </button>
                      </Container>
                    </Alert>
                  )}
                </Col>
              </Row>
              <Row>
                <Card className="card-signup" data-background-color="blue">
                  <Form className="form" noValidate onSubmit={onSubmit}>
                    <CardHeader className="text-center">
                      <CardTitle className="title-up" tag="h3">
                        Welcome
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      {/* <GoogleLogin
                        clientId="759343328924-7fncl73uc55bq4ag9ntroogaj7p8qe56.apps.googleusercontent.com"
                        buttonText="Sign in with Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={"single_host_origin"}
                        className="mb-5"
                      /> */}
                      <div
                        className={classnames("text-danger", {
                          "mb-2": state.errors.emailnotfound
                        })}
                      >
                        {state.errors.emailnotfound}
                      </div>
                      <div
                        className={classnames("text-danger", {
                          "mb-2": state.errors.passwordincorrect
                        })}
                      >
                        {state.errors.passwordincorrect}
                      </div>
                      <InputGroup
                        className={
                          "no-border" + (emailFocus ? " input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-envelope"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={onChange}
                          value={state.email}
                          id="email"
                          placeholder="Email..."
                          type="email"
                          onFocus={() => setEmailFocus(true)}
                          onBlur={() => setEmailFocus(false)}
                          required
                        ></Input>
                      </InputGroup>
                      <div
                        className={classnames("text-danger", {
                          "mb-2": state.errors.email
                        })}
                      >
                        {state.errors.email}
                      </div>
                      <InputGroup
                        className={
                          "no-border" +
                          (passwordFocus ? " input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={onChange}
                          value={state.password}
                          id="password"
                          placeholder="Password..."
                          type="password"
                          onFocus={() => setPasswordFocus(true)}
                          onBlur={() => setPasswordFocus(false)}
                          required
                        ></Input>
                      </InputGroup>
                      <div
                        className={classnames("text-danger", {
                          "mb-2": state.errors.password
                        })}
                      >
                        {state.errors.password}
                      </div>
                    </CardBody>
                    <CardFooter className="text-center">
                      <Button
                        className="btn-neutral btn-round"
                        color="info"
                        type="submit"
                        size="lg"
                      >
                        Sign In
                      </Button>
                      <div>
                        <h6>
                          <button
                            className="btn-link text-white"
                            onClick={() =>
                              props.history.push("/forgot-password")
                            }
                          >
                            Forgot Password?
                          </button>
                        </h6>
                      </div>
                    </CardFooter>
                  </Form>
                </Card>
              </Row>
            </Container>
          </div>
        </div>
        {/* end Signin */}
        <div className="main"></div>
        <DarkFooter />
      </div>
    </>
  );
};

Signin.propTypes = {
  loginUser: PropTypes.func,
  confirmEmail: PropTypes.func,
  auth: PropTypes.object,
  errors: PropTypes.object
};

export default withRouter(Signin);
