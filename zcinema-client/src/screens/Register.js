import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";

import IndexNavbar from "../components/Navbars/IndexNavbar";
import DarkFooter from "../components/Footers/DarkFooter";

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
import { registerUser } from "../actions/authActions";

const Register = props => {
  const [nameFocus, setNameFocus] = React.useState(false);
  const [emailFocus, setEmailFocus] = React.useState(false);
  const [mobileFocus, setMobileFocus] = React.useState(false);
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
    name: "",
    email: "",
    mobile: "",
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

  const onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: state.name,
      email: state.email,
      mobile: state.mobile,
      password: state.password,
      password2: state.password2
    };

    dispatch(registerUser(newUser, props.history));
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
                        Welcome
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <InputGroup
                        className={
                          "no-border" + (nameFocus ? " input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={onChange}
                          value={state.name}
                          id="name"
                          placeholder="Name..."
                          type="text"
                          onFocus={() => setNameFocus(true)}
                          onBlur={() => setNameFocus(false)}
                          required
                        ></Input>
                      </InputGroup>
                      <div
                        className={classnames("text-danger", {
                          "mb-2": state.errors.name
                        })}
                      >
                        {state.errors.name}
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
                          (mobileFocus ? " input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-mobile"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={onChange}
                          value={state.mobile}
                          id="mobile"
                          placeholder="Mobile No..."
                          type="text"
                          onFocus={() => setMobileFocus(true)}
                          onBlur={() => setMobileFocus(false)}
                          required
                        ></Input>
                      </InputGroup>
                      <div
                        className={classnames("text-danger", {
                          "mb-2": state.errors.mobile
                        })}
                      >
                        {state.errors.mobile}
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
                          placeholder="Confirm Password..."
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
                        Register
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

Register.propTypes = {
  registerUser: PropTypes.func,
  auth: PropTypes.object,
  errors: PropTypes.object
};

export default withRouter(Register);
