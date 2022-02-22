const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const uuidv4 = require("uuid/v4");
const path = require("path");
require("dotenv").config();

const Movie = require("../../models/Movie");
const multer = require("multer");
var AWS = require("aws-sdk");
var fs = require("fs");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/");
  },
  filename: function(req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

// @route     GET api/movies
// @desc      Get all movies
// @access    Public
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({
      screen: "asc"
    });
    res.json(movies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/movies
// @desc      Add new movie
// @access    Private
router.post(
  "/",
  auth,
  upload.single("file"),
  [
    check("title", "Title is required")
      .not()
      .isEmpty(),
    check("screen", "Screen is required")
      .not()
      .isEmpty(),
    check("trailer", "Trailer is required")
      .not()
      .isEmpty()
  ],
  (req, res) => {
    const file = req.file;

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorResponse = errors.array({ onlyFirstError: true });
      const extractedErrors = {};
      errorResponse.map(err => (extractedErrors[err.param] = err.msg));
      return res.status(400).json(extractedErrors);
    }

    const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.filename,
      Body: fs.createReadStream(file.path),
      ACL: "public-read"
    };

    s3bucket.upload(params, async function(err, data) {
      if (err) {
        res.status(500).json({ error: true, Message: err });
      } else {
        const { title, screen, trailer } = req.body;

        try {
          const newMovie = new Movie({
            title,
            screen,
            poster: s3FileURL + req.file.filename,
            trailer
          });
          const movie = await newMovie.save();

          res.json(movie);
        } catch (error) {
          console.error(err.message);
          res.status(500).send("Server Error");
        }
      }
    });
  }
);

// @route     PUT api/movies/:id
// @desc      Update movie
// @access    Private
router.put(
  "/:id",
  upload.single("file"),
  [
    check("title", "Title is required")
      .not()
      .isEmpty(),
    check("screen", "Screen is required")
      .not()
      .isEmpty(),
    check("trailer", "Trailer is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const file = req.file;

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorResponse = errors.array({ onlyFirstError: true });
      const extractedErrors = {};
      errorResponse.map(err => (extractedErrors[err.param] = err.msg));
      return res.status(400).json(extractedErrors);
    }

    if (file !== undefined) {
      const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

      let s3bucket = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      });

      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.filename,
        Body: fs.createReadStream(file.path),
        ACL: "public-read"
      };

      s3bucket.upload(params, async function(err, data) {
        if (err) {
          res.status(500).json({ error: true, Message: err });
        } else {
          const { title, screen, trailer } = req.body;

          try {
            let movie = await Movie.findById(req.params.id);

            if (!movie) return res.status(404).json({ msg: "Movie not found" });

            const oldPoster = movie.poster;

            movie = await Movie.findByIdAndUpdate(
              req.params.id,
              {
                $set: {
                  title,
                  screen,
                  poster: s3FileURL + req.file.filename,
                  trailer
                }
              },
              { new: true }
            );

            let s3bucket = new AWS.S3({
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              region: process.env.AWS_REGION
            });

            var params = {
              Bucket: "zcinema",
              Key: oldPoster.substring(oldPoster.lastIndexOf("/") + 1)
            };

            s3bucket.deleteObject(params, function(err, data) {
              if (err) {
                res.json({ error: "Movie poster not removed from server" });
              }
            });

            res.json(movie);
          } catch (error) {
            console.error(err.message);
            res.status(500).send("Server Error");
          }
        }
      });
    } else {
      const { title, screen, trailer } = req.body;

      try {
        let movie = await Movie.findById(req.params.id);

        if (!movie) return res.status(404).json({ msg: "Movie not found" });

        movie = await Movie.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              title,
              screen,
              trailer
            }
          },
          { new: true }
        );

        res.json(movie);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    }
  }
);

// @route     DELETE api/movies/:id
// @desc      Delete movie
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    await Movie.findByIdAndRemove(req.params.id);

    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    var params = {
      Bucket: "zcinema",
      Key: movie.poster.substring(movie.poster.lastIndexOf("/") + 1)
    };

    s3bucket.deleteObject(params, function(err, data) {
      if (err) {
        res.json({ error: "Movie poster not removed from server" });
      }
    });

    res.json({ msg: "Movie removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
