const express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const clientRouter = require("./routers/client");
const adminRouter = require("./routers/admin");
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const payRouter = require("./routers/payment");
const thuesoRouter = require("./routers/thueso");
const thongbaoRouter = require("./routers/thongbaoRouter");

dotenv.config();
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

//file tĩnh
app.use("/public", express.static(path.join(__dirname, "/public")));
//router api

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/payment", payRouter);
app.use("/api/v1/thueso", thuesoRouter);
app.use("/api/v1/notice/", thongbaoRouter);
app.use("/api/v1/admin/", adminRouter);

//router client
app.use("/", clientRouter);
app.use("/admin", adminRouter);
app.set("view engine", "ejs");
app.set("views", "./views");

//





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

