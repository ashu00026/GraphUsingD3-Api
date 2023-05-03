// const express = require('express');
// const app=express();
// require('dotenv').config();
const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
  // origin:'http://localhost:3000',
  origin: "https://visualizeapp.onrender.com",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const connectDB = require("./db/connectDb");
const Router = require("./routes/app");

// const notFoundMiddleware = require('./middleware/not-found');
// const errorMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());

// routes

app.use("/home", Router);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // connectDB

    await connectDB(process.env.URI);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
