const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRouter = require("./routes/auth");
const transactionRouter = require("./routes/transaction");
const getDataRouter = require("./routes/getData")
// const getAddTokenRouter = require("./routes/addToken")

const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });


app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/getData", getDataRouter);
// app.use("/api/tokens/", getAddTokenRouter)


app.get("/", (req, res) => {
  res.send("runnnig")
})
app.listen(5000, () => {
  console.log("server running on port 5000");
});
