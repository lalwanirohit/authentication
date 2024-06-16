const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/authentication");

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/auth", authRoutes);

app.get((req, res, next) =>{
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
});

const portNumber = process.env.PORT || 3000;

app.listen(portNumber, () => {
    console.log(`server is running at port number ${portNumber}`);
})