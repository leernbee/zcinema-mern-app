const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const account = require("./routes/api/accounts");
const seats = require("./routes/api/seats");
const transactions = require("./routes/api/transactions");
const movies = require("./routes/api/movies");

const app = express();

app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

app.use("/api/users", users);
app.use("/api/account", account);
app.use("/api/seats", seats);
app.use("/api/transactions", transactions);
app.use("/api/movies", movies);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
