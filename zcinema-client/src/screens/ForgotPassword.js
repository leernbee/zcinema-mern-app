import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import IndexNavbar from "../components/Navbars/IndexNavbar";
import DarkFooter from "../components/Footers/DarkFooter";

// import AuthContext from 'context/auth/authContext';
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

import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../actions/authActions";

const ForgotPassword = props => {
  const [emailFocus, setEmailFocus] = React.useState(false);

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

  const auth = useSelector(state => state.auth);
  const errors = useSelector(state => state.errors);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    email: "",
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

  const [alert1, setAlert1] = React.useState(false);

  const forgot = async userData => {
    const success = await dispatch(forgotPassword(userData));

    if (success === true) {
      setAlert1(true);
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: state.email
    };

    forgot(userData);

    setState({ ...state, email: "" });
  };

  return (
    <>
      {/* {passwordForgot && (
        <SweetAlert
          show={passwordForgot}
          title="Forgot Password"
          text="Please check your email for reset password"
          onConfirm={() => {
            setPasswordForgot();
          }}
        />
      )} */}
      <IndexNavbar />
      <div className="wrapper">
        {/* Forgot Password */}
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
                          <i className="now-ui-icons travel_info"></i>
                        </div>
                        <strong>Email sent!</strong> Check your inbox for the
                        password reset link.
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
                </Col>
              </Row>
              <Row>
                <Card className="card-signup" data-background-color="blue">
                  <Form className="form" noValidate onSubmit={onSubmit}>
                    <CardHeader className="text-center">
                      <CardTitle className="title-up" tag="h3">
                        Forgot Password
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div
                        className={classnames("text-danger", {
                          "mb-2": state.errors.emailnotfound
                        })}
                      >
                        {state.errors.emailnotfound}
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
                          "mb-2": state.errors.error
                        })}
                      >
                        {state.errors.error}
                      </div>
                    </CardBody>
                    <CardFooter className="text-center">
                      <Button
                        className="btn-neutral btn-round"
                        color="info"
                        type="submit"
                        size="lg"
                      >
                        Forgot Password
                      </Button>
                    </CardFooter>
                  </Form>
                </Card>
              </Row>
            </Container>
          </div>
        </div>
        {/* end Forgot Password */}
        <div className="main"></div>
        <DarkFooter />
      </div>
    </>
  );
};

export default withRouter(ForgotPassword);
