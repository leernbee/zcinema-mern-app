import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

import axios from "axios";
import QRCode from "qrcode.react";
// reactstrap components
import {
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button
} from "reactstrap";

// core components
import IndexNavbar from "../components/Navbars/IndexNavbar";
import AccountHeader from "../components/Headers/AccountHeader";
import DarkFooter from "../components/Footers/DarkFooter";

import { useDispatch, useSelector } from "react-redux";
import { updateProfile, changePassword } from "../actions/accountActions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Account = props => {
  const auth = useSelector(state => state.auth);
  const errors = useSelector(state => state.errors);
  const dispatch = useDispatch();

  const [pills, setPills] = React.useState("1");

  React.useEffect(() => {
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");

    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });

  // const authContext = useContext(AuthContext);
  // const { changePassword, updateProfile, user, errors } = authContext;

  const [state, setState] = useState({
    name: "",
    mobile: "",
    oldPassword: "",
    newPassword: "",
    newPassword2: "",
    errors: {}
  });

  useEffect(() => {
    if (errors) {
      setState({ ...state, errors: errors });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  const [email, setEmail] = React.useState("");
  const [transactions, setTransactions] = React.useState([]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setState({
        ...state,
        name: auth.user.name,
        mobile: auth.user.mobile
      });
      setEmail(auth.user.email);
    }
    // if (user.name !== undefined) {
    //   setState({ ...state, name: user.name });
    //   setEmail(user.email);
    //   axios
    //     .get("/api/transactions/all")
    //     .then(res => {
    //       setTransactions(res.data);
    //     })
    //     .catch(err => {
    //       console.log(err.message);
    //     });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pills === "2") {
      axios
        .get("/api/transactions/all")
        .then(res => {
          setTransactions(res.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pills]);

  const onChange = e => {
    setState({ ...state, [e.target.id]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    const newName = {
      name: state.name,
      mobile: state.mobile
    };

    setState({ ...state, errors: {} });

    const success = await dispatch(updateProfile(newName));

    if (success === true) {
      toast("Account update successful!");
    }
  };

  const onSubmit2 = e => {
    e.preventDefault();

    const passwords = {
      oldPassword: state.oldPassword,
      newPassword: state.newPassword,
      newPassword2: state.newPassword2
    };

    setState({ ...state, errors: {} });

    dispatch(changePassword(passwords));
  };

  toast.configure({
    autoClose: 8000,
    draggable: false
    //etc you get the idea
  });

  return (
    <>
      <ToastContainer />
      <IndexNavbar />
      <div className="wrapper">
        <AccountHeader />
        <div className="section">
          <Container>
            <Row>
              <Col className="ml-auto mr-auto" md="6">
                <div className="nav-align-center">
                  <Nav
                    className="nav-pills-info nav-pills-just-icons"
                    pills
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={pills === "1" ? "active" : ""}
                        href="#pablo"
                        onClick={e => {
                          e.preventDefault();
                          setPills("1");
                        }}
                      >
                        <i className="fas fa-user"></i>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={pills === "2" ? "active" : ""}
                        href="#pablo"
                        onClick={e => {
                          e.preventDefault();
                          setPills("2");
                        }}
                      >
                        <i className="fas fa-ticket-alt"></i>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <TabContent className="gallery" activeTab={"pills" + pills}>
                  <TabPane tabId="pills1">
                    <Row>
                      <Col md="6" className="mx-auto">
                        <Form className="mb-5" noValidate onSubmit={onSubmit}>
                          <FormGroup>
                            <Label>Name</Label>
                            <Input
                              onChange={onChange}
                              value={state.name}
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Name..."
                            />
                          </FormGroup>
                          <div
                            className={classnames("text-danger", {
                              "mb-3": state.errors.name
                            })}
                          >
                            {state.errors.name}
                          </div>
                          <FormGroup>
                            <Label>Mobile No.</Label>
                            <Input
                              onChange={onChange}
                              value={state.mobile}
                              type="text"
                              name="mobile"
                              id="mobile"
                              placeholder="Mobile No..."
                            />
                          </FormGroup>
                          <div
                            className={classnames("text-danger", {
                              "mb-3": state.errors.mobile
                            })}
                          >
                            {state.errors.mobile}
                          </div>
                          <FormGroup>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              name="email"
                              id="email"
                              placeholder="Email..."
                              value={email}
                              readOnly
                            />
                          </FormGroup>
                          <div className="text-center">
                            <Button color="success">Update Profile</Button>
                          </div>
                        </Form>

                        <Form noValidate onSubmit={onSubmit2}>
                          <FormGroup>
                            <Label>Old Password</Label>
                            <Input
                              onChange={onChange}
                              value={state.oldPassword}
                              type="password"
                              name="oldPassword"
                              id="oldPassword"
                              placeholder="Old Password..."
                            />
                          </FormGroup>
                          <div
                            className={classnames("text-danger", {
                              "mb-3": state.errors.oldPassword
                            })}
                          >
                            {state.errors.oldPassword}
                          </div>
                          <FormGroup>
                            <Label>New Password</Label>
                            <Input
                              onChange={onChange}
                              value={state.newPassword}
                              type="password"
                              name="newPassword"
                              id="newPassword"
                              placeholder="New Password..."
                            />
                          </FormGroup>
                          <div
                            className={classnames("text-danger", {
                              "mb-3": state.errors.newPassword
                            })}
                          >
                            {state.errors.newPassword}
                          </div>
                          <FormGroup>
                            <Label>Confirm New Password</Label>
                            <Input
                              onChange={onChange}
                              value={state.newPassword2}
                              type="password"
                              name="newPassword2"
                              id="newPassword2"
                              placeholder="Confirm New Password..."
                            />
                          </FormGroup>
                          <div
                            className={classnames("text-danger", {
                              "mb-3": state.errors.newPassword2
                            })}
                          >
                            {state.errors.newPassword2}
                          </div>
                          <div className="text-center">
                            <Button color="success">Change Password</Button>
                          </div>
                        </Form>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="pills2">
                    <Container>
                      {transactions.length > 0 ? (
                        transactions.map(item => (
                          <Row key={item._id} className="mb-3">
                            <Col lg="10" className="mx-auto">
                              <div className="tile">
                                <div className="header mb-3">{item.title}</div>

                                <div className="text-center">
                                  <QRCode size={256} value={item.token} />
                                </div>
                                <div className="dates row">
                                  <div className="col-lg-4 text-center">
                                    <strong>SCREEN</strong> {item.screen}
                                  </div>
                                  <div className="col-lg-4 text-center">
                                    <strong>DATE</strong> {item.movieDate}
                                  </div>
                                  <div className="col-lg-4 text-center">
                                    <strong>TIME</strong> {item.movieTime}
                                  </div>
                                </div>

                                <div className="stats">
                                  <div className="row">
                                    <div className="col-lg-6 text-center">
                                      <strong>SEATS</strong>{" "}
                                      {item.seats.join(", ")}
                                    </div>

                                    <div className="col-lg-6 text-center">
                                      <strong>PRICE</strong> ₱{item.amount}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        ))
                      ) : (
                        <div className="text-center">Nothing to Show</div>
                      )}
                    </Container>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </Container>
        </div>
        <DarkFooter />
      </div>
    </>
  );
};

export default withRouter(Account);
