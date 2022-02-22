const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const EmailService = require("../../EmailService");
const uuid = require("uuid/v1");

require("dotenv").config();

// @route POST api/users/register
// @desc Register user
// @access Public
router.post(
  "/register",
  [
    check("name", "Name field is required")
      .not()
      .isEmpty(),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email field is required")
      .isEmail()
      .withMessage("Email is invalid"),
    check("mobile")
      .not()
      .isEmpty()
      .withMessage("Mobile No. field is required"),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6
    }),
    check("password2")
      .not()
      .isEmpty()
      .withMessage("Confirm Password field is required")
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords must match");
        } else {
          return value;
        }
      })
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorResponse = errors.array({ onlyFirstError: true });

      const extractedErrors = {};
      errorResponse.map(err => (extractedErrors[err.param] = err.msg));
      return res.status(400).json(extractedErrors);
    }

    const { name, email, mobile, password } = req.body;

    const verifyToken = uuid();

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      }

      user = new User({
        name,
        email,
        mobile,
        password,
        verification: verifyToken
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      const newUser = await user.save();

      EmailService.sendText(
        newUser.email,
        "Welcome to ZCinema!",
        `<p>Verify your registration. Click the link below:<br>
        <a href="${process.env.host_url}/confirm/${verifyToken}">${process.env.host_url}/confirm/${verifyToken}</a></p>`
      )
        .then(() => {
          // Email sent successfully
        })
        .catch(() => {
          // Error sending email
        });

      res.json(newUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post(
  "/login",
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email field is required")
      .isEmail()
      .withMessage("Email is invalid"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password field is required")
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorResponse = errors.array({ onlyFirstError: true });

      const extractedErrors = {};
      errorResponse.map(err => (extractedErrors[err.param] = err.msg));
      return res.status(400).json(extractedErrors);
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ emailnotfound: "Email not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!user.active) {
        return res.status(400).json({ emailnotfound: "Email not verified" });
      }

      if (!isMatch) {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ success: true, token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.put("/confirmed", async (req, res) => {
  const token = req.body.token;

  try {
    let user = await User.findOneAndUpdate(
      { verification: token },
      { active: true }
    );

    if (user) {
      res.json(user);
    } else {
      res.status(400).send({ error: "Token not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/forgot-password", async (req, res) => {
  const { email } = req.body.email;
  const token = uuid();

  try {
    let user = await User.findOneAndUpdate({ email }, { forgot: token });

    if (user) {
      EmailService.sendText(
        user.email,
        "Forgot Password?",
        `<p>Reset your password. Click the link below:<br>
          <a href="${process.env.host_url}/reset-password/${token}">${process.env.host_url}/reset-password/${token}</a></p>`
      )
        .then(() => {
          // Email sent successfully
        })
        .catch(() => {
          // Error sending email
        });

      res.json(user);
    } else {
      res.status(400).send({ error: "Email not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put(
  "/reset-password",
  [
    check("password", "New Password must be at least 6 characters").isLength({
      min: 6
    }),
    check("password2")
      .not()
      .isEmpty()
      .withMessage("Confirm New Password field is required")
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords must match");
        } else {
          return value;
        }
      })
  ],
  async (req, res) => {
    let errors = validationResult(req);
    const extractedErrors = {};

    if (!errors.isEmpty()) {
      var errorResponse = errors.array({ onlyFirstError: true });
      errorResponse.map(err => (extractedErrors[err.param] = err.msg));
      return res.status(400).json(extractedErrors);
    }

    try {
      let user = await User.findOne({ forgot: req.body.token });

      if (!user) {
        console.log(user);
        return res.status(400).json({ invalidtoken: "Invalid Token" });
      }

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(req.body.password, salt);
      user.forgot = "";

      await user.save();

      res.json({ success: true });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
