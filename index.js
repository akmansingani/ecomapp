const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

const cors = require('cors');

// config env. variables
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const braintreeRoutes = require("./routes/braintreeRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// connect to db
mongoose.connect(process.env.MONGO_URI,  
    {
        useNewUrlParser: true,
        useCreateIndex : true
    })
.then(() => console.log('DB Connected'));


// routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT);



