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
const User = require("./models/user");
const jobauto = require("./jobauto/job");
var fs = require('fs');
dotenv.config();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
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
app.use("/", async (req, res) => {
    res.redirect('http://web.ktool.site/#/');
});
app.use("/admin", async (req, res) => {
    res.redirect('http://web.ktool.site/#/admin');
});

//router client
// app.use("/", clientRouter);
// app.use("/admin", adminRouter);

// app.set("view engine", "ejs");
// app.set("views", "./views");

//
// app.use("/get-hist-otp", async () => {
//     const data = await jobauto.getHistoryPhoneOtp();
//     fs.appendFile('listphone.txt', data, function (err) {
//         if (err) throw err;
//         console.log('Saved!');
//     });
// })

// jobauto.jobUpdateHistory("AnnieLS");
// jobauto.updateDB(0);
// jobauto.updateUserHistStatus("AnnieLS", 0);

// setInterval(async () => {
//     console.log("update money:: " + new Date());
//     jobauto.updateAmountUser();
//     // const listUser = await User.find();
//     // if (listUser && listUser.length > 0) {
//     //     for(var i = 0; i < listUser.length; i++) {
//     //         jobauto.jobBackup(listUser[i]._id);
//     //     }
//     // }
// }, 10000);

// setInterval(async () => {
//     const listUser = await User.find();
//     if (listUser && listUser.length > 0) {
//         for (var i = 0; i < listUser.length; i++) {
//             jobauto.jobBackup(listUser[i]._id);
//         }
//     }
// }, 10000);
// jobauto.updateAmountUser();


const dbUrl = process.env.mongodbUrl;
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

app.listen(5000, () => {
    mongoose.connect(dbUrl, connectionParams).then(() => {
        console.log("connect db success");
        // app.use("/get-hist-otp", async () => {
        //     const data = await jobauto.getHistoryPhoneOtp();
        //     fs.appendFile('listphone.txt', data, function (err) {
        //         if (err) throw err;
        //         console.log('Saved!');
        //     });
        // })

        // jobauto.jobUpdateHistory("AnnieLS");
        // jobauto.updateDB(0);
        // jobauto.updateUserHistStatus("AnnieLS", 0);

        setInterval(async () => {
            console.log("update money:: " + new Date());
            jobauto.updateAmountUser();
            // const listUser = await User.find();
            // if (listUser && listUser.length > 0) {
            //     for(var i = 0; i < listUser.length; i++) {
            //         jobauto.jobBackup(listUser[i]._id);
            //     }
            // }
        }, 10000);

        setInterval(async () => {
            const listUser = await User.find();
            if (listUser && listUser.length > 0) {
                for (var i = 0; i < listUser.length; i++) {
                    jobauto.jobBackup(listUser[i]._id);
                }
            }
        }, 10000);
        jobauto.updateAmountUser();
    }).catch((e) => {
        console.log("connect db error:: ", e);
    })
})

