import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

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
  Row
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../actions/authActions";

const ResetPassword = props => {
  const [passwordFocus, setPasswordFocus] = React.useState(false);
  const [password2Focus, setPassword2Focus] = React.useState(false);

  const auth = useSelector(state => state.auth);
  const errors = useSelector(state => state.errors);
  const dispatch = useDispatch();

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

  const [state, setState] = useState({
    password: "",
    password2: "",
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

  const reset = async newPassword => {
    const success = await dispatch(resetPassword(newPassword));

    if (success === true) {
      props.history.push("/signin?reset=show");
    }
  };

  const onSubmit = e => {
    e.preventDefault();

    const newPassword = {
      password: state.password,
      password2: state.password2,
      token: props.match.params.token
    };

    reset(newPassword);
  };

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        {/* Register */}
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
                <Card className="card-signup" data-background-color="blue">
                  <Form className="form" noValidate onSubmit={onSubmit}>
                    <CardHeader className="text-center">
                      <CardTitle className="title-up" tag="h3">
                        Reset Password
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div
                        className={classnames("text-danger", {
                          "mb-2": state.errors.invalidtoken
                        })}
                      >
                        {state.errors.invalidtoken}
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
                          placeholder="New Password..."
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
                      <InputGroup
                        className={
                          "no-border" +
                          (password2Focus ? " input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={onChange}
                          value={state.password2}
                          id="password2"
                          placeholder="Confirm New Password..."
                          type="password"
                          onFocus={() => setPassword2Focus(true)}
                          onBlur={() => setPassword2Focus(false)}
                          required
                        ></Input>
                      </InputGroup>
                      <div
                        className={classnames("text-danger", {
                          "mb-2": state.errors.password2
                        })}
                      >
                        {state.errors.password2}
                      </div>
                    </CardBody>
                    <CardFooter className="text-center">
                      <Button
                        className="btn-neutral btn-round"
                        color="info"
                        type="submit"
                        size="lg"
                      >
                        Reset Password
                      </Button>
                    </CardFooter>
                  </Form>
                </Card>
              </Row>
            </Container>
          </div>
        </div>
        {/* end Register */}
        <div className="main"></div>
        <DarkFooter />
      </div>
    </>
  );
};

export default withRouter(ResetPassword);
