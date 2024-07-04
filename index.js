const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRoute = require("./Routes/user");
const authRoute = require("./Routes/auth");
const cartRoute = require("./Routes/cart");
const orderRoute = require("./Routes/order");
const productRoute = require("./Routes/product");
const cors = require("cors");
const stripeRoute = require("./Routes/stripe")

const bodyParser = require("body-parser");

dotenv.config();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });


console.log("Backend is working");

app.use(cors());
app.use(express.json()); 

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port ${port}`)
});
