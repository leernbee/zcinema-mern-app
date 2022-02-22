const express = require('express');
const router = express.Router();
const Seat = require('../../models/Seat');

router.get('/generate', async (req, res) => {
  try {
    let letters = 'ABCDEFGHIJKLMNOPQR';
    let seatsArr = [];
    for (var i = 0; i < letters.length; i++) {
      for (var j = 1; j <= 18; j++) {
        seatsArr.push({
          no: `${letters.charAt(i)}${j}`,
          reserved: Math.random() >= 0.5
        });
      }
    }
    let seats = new Seat({
      screen: req.body.screen,
      date: req.body.date,
      time: req.body.time,
      seats: seatsArr
    });

    seats = await seats.save();
    res.json(seats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/plan', async (req, res) => {
  try {
    let seats = await Seat.find({
      screen: req.query.screen,
      date: req.query.date,
      time: req.query.time
    });

    let resArr = [];
    if (seats.length < 1) {
      let letters = 'ABCDEFGHIJKLMNOPQR';
      let seatsArr = [];
      for (var i = 0; i < letters.length; i++) {
        for (var j = 1; j <= 18; j++) {
          seatsArr.push({
            no: `${letters.charAt(i)}${j}`,
            reserved: Math.random() >= 0.5
          });
        }
      }
      let seats = new Seat({
        screen: req.query.screen,
        date: req.query.date,
        time: req.query.time,
        seats: seatsArr
      });

      seats = await seats.save();
      resArr.push(seats);
    }

    if (resArr.length < 1) {
      res.json(seats);
    } else {
      res.json(resArr);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
