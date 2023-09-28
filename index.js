const express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");


dotenv.config();
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

//router

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.get("/", (req, res) => {
    res.json("home");
})




const dbUrl = process.env.mongodbUrl;
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

app.listen(5000, () => {
    mongoose.connect(dbUrl, connectionParams).then(() => {
        console.log("connect db success");
    }).catch((e) => {
        console.log("connect db error:: ", e);
    })
})

