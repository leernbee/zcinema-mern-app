import React, { useEffect } from "react";

import { Button } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import {
  getMovies,
  deleteMovie,
  setCurrent,
  clearCurrent
} from "../../actions/movieActions";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

const Movies = () => {
  const { movies } = useSelector(state => state.movies);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMovies());

    // eslint-disable-next-line
  }, []);

  const onDelete = id => {
    dispatch(deleteMovie(id));
    dispatch(clearCurrent());
  };

  function actionFormatter(cell, row) {
    return (
      <>
        <Button
          color="warning"
          size="sm"
          onClick={() => dispatch(setCurrent(row))}
        >
          Edit
        </Button>{" "}
        <Button color="danger" size="sm" onClick={() => onDelete(cell)}>
          Delete
        </Button>
      </>
    );
  }

  const columns = [
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
      dataField: "_id",
      text: "Action",
      formatter: actionFormatter,
      sort: false
    }
  ];

  const defaultSorted = [
    {
      dataField: "screen",
      order: "asc"
    }
  ];

  return (
    <React.Fragment>
      {movies !== null && movies.length > 0 ? (
        <BootstrapTable
          wrapperClasses="table-responsive"
          bootstrap4
          keyField="_id"
          data={movies}
          columns={columns}
          pagination={paginationFactory()}
          defaultSorted={defaultSorted}
        />
      ) : (
        <>
          <p className="text-center">No movies to show</p>
        </>
      )}
    </React.Fragment>
  );
};

export default Movies;
