require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
// body parser no longer required comes in built with express
const cookieParser = require("cookie-parser");
const cors = require("cors");
// Routes import
const authRoutes = require('./routes/auth')
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require('./routes/product')
const orderRoutes = require("./routes/order")
const paymentRoutes = require("./routes/payment")
// App initialization
const app = express();


// DB Connection
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("DB CONNECTED");
    })
    .catch((e) => {
        console.log(`DB ERROR ${e}`);
    });
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)
app.use("/api", paymentRoutes)
// Port
const port = process.env.PORT || 8000;

// Starting a Server
app.listen(port, () => {
    console.log(`App is running at port ${port}...`);
});
