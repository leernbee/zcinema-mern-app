import React, { useEffect, useState } from "react";
import axios from "axios";
// reactstrap components
import { Container, Row, Col } from "reactstrap";
import moment from "moment";
// core components
import IndexNavbar from "../components/Navbars/IndexNavbar";
import PageHeader from "../components/Headers/PageHeader";
import DarkFooter from "../components/Footers/DarkFooter";
import setAuthToken from "../utils/setAuthToken";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import { useSelector } from "react-redux";

const AdminTransactions = props => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

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
    if (isAuthenticated && user.role !== "admin") {
      props.history.push("/signin");
    }
  }, [isAuthenticated, props.history, user]);

  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    if (localStorage.jwtToken) {
      // Set auth token header auth
      const token = localStorage.jwtToken;
      setAuthToken(token);
    }

    axios
      .get("/api/transactions/adminall")
      .then(res => {
        setTransactions(res.data);
      })
      .catch(err => console.log(err.message));
  }, []);

  function priceFormatter(cell) {
    return <span>₱ {cell}</span>;
  }

  function seatsFormatter(cell) {
    return <span>{cell.join(", ")}</span>;
  }

  function dateFormatter(cell) {
    return <span>{moment(cell).format("MMM D, YYYY, HH:mmA")}</span>;
  }

  const columns = [
    {
      dataField: "date",
      text: "Timestamp",
      formatter: dateFormatter,
      sort: true
    },
    {
      dataField: "user.name",
      text: "Name",
      sort: true
    },
    {
      dataField: "user.email",
      text: "Email",
      sort: true
    },
    {
      dataField: "screen",
      text: "Screen",
      sort: true
    },
    {
      dataField: "title",
      text: "Title",
      sort: true
    },
    {
      dataField: "movieDate",
      text: "Date",
      sort: true
    },
    {
      dataField: "movieTime",
      text: "Time",
      sort: true
    },
    {
      dataField: "seats",
      text: "Seats",
      formatter: seatsFormatter,
      sort: false
    },
    {
      dataField: "amount",
      text: "Price",
      formatter: priceFormatter,
      sort: true
    }
  ];

  const defaultSorted = [
    {
      dataField: "date",
      order: "desc"
    }
  ];

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <PageHeader title="Transactions" />
        <div className="section">
          <Container>
            <Row>
              <Col>
                <BootstrapTable
                  wrapperClasses="table-responsive"
                  bootstrap4
                  keyField="_id"
                  data={transactions}
                  columns={columns}
                  pagination={paginationFactory()}
                  defaultSorted={defaultSorted}
                />
              </Col>
            </Row>
          </Container>
        </div>
        <DarkFooter />
      </div>
    </>
  );
};

export default AdminTransactions;
