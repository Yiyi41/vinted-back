require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(formidable());
app.use(cors());

const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);
const filterRoutes = require("./routes/filtres");
app.use(filterRoutes);


app.all("*", (req, res) => {
  res.json("all routes");
});

app.listen(process.env.PORT, () => {
  console.log("Server🤖 started");
});
