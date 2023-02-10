// const express = require('express');
// const app=express();
require('dotenv').config();
const express = require('express');
const app = express();

const connectDB = require('./db/connectDb');
const Router = require('./routes/app');

// const notFoundMiddleware = require('./middleware/not-found');
// const errorMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());

// routes

app.use('/home',Router);



const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connectDB
    
    await connectDB('mongodb+srv://ashutosh:Ashu5656@nodeexpressprojets.nuuengz.mongodb.net/Task?retryWrites=true&w=majority');
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
