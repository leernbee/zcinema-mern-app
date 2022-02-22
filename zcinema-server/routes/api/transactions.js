const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Transaction = require("../../models/Transaction");
const Seat = require("../../models/Seat");
const User = require("../../models/User");

// @route POST api/account/update
// @desc Update user profile
// @access Private
router.post("/complete", auth, async (req, res) => {
  try {
    const transaction = new Transaction({
      screen: req.body.screen,
      title: req.body.title,
      movieDate: req.body.date,
      movieTime: req.body.time,
      seats: req.body.seats,
      amount: req.body.amount,
      token: req.body.token,
      user: req.body.user
    });

    await transaction.save();

    req.body.seats.forEach(async seat => {
      const filter = {
        screen: req.body.screen,
        date: req.body.date,
        time: req.body.time,
        "seats.no": seat
      };

      const update = {
        $set: { "seats.$.reserved": true }
      };

      await Seat.findOneAndUpdate(filter, update, {
        new: true
      });
    });

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    let transactions = await Transaction.find({ user: req.user.id })
      .sort({
        date: "desc"
      })
      .limit(5);

    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/adminall", auth, async (req, res) => {
  try {
    let transactions = await Transaction.find({})
      .populate("user", "name email", User)
      .sort({
        date: "desc"
      });

    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
