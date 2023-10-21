const User = require("../models/user");
const authMiddl = require("../middlewares/authmidd");
const Thueso = require("../models/thueso");
const axios = require('axios');
const mongoose = require("mongoose");
const thusoController = {
    getAllAdmin: async (req, res) => {
        try {
            const user = await User.find();
            res.json({ code: 200, data: user });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    getAllByUser: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            let page = parseInt(req.query.page || 1);

            let skips = (page - 1) * 20;
            const listThueSo = await Thueso.find({ userID: req.user.id }).skip(skips).limit(20).sort({ createdAt: -1 });
            const count = await Thueso.countDocuments({ userID: req.user.id });
            if (listThueSo) {
                res.json({ code: 200, data: { data: listThueSo, totalPage: Math.ceil(count / 20) } });
            } else {
                res.json({ code: 404, error: "Không tìm thấy yêu cầu hợp lệ, vui lòng liên hệ admin" });
            }
        })
    },
    getDetail: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                let user = await User.findById(req.user.id);
                let thueSo = await Thueso.findById(req.body.code);
                if (!thueSo) {
                    thueSo = await Thueso.find({ codeID: req.body.code });
                }
                if (user && thueSo && thueSo.status == 0 && (!thueSo.otp || thueSo.otp == "")) {
                    const url = `http://14.225.255.45:3010/otp/${thueSo.codeID}?token=${process.env.tokenO}`;
                    const response = await axios.get(url);
                    if (response.data.otp && response.data.otp.length > 0 && new Date(thueSo.timeCreatePhone).getTime() < new Date(response.data.codeTime).getTime()) {
                        console.log(thueSo._id + " phoneNumber: " + thueSo.phoneNumber + " timecreate: " + thueSo.timeCreatePhone + " timeOTP: " + response.data.codeTime);
                        await Thueso.findByIdAndUpdate(req.body.code, { status: 1, otp: response.data.otp, codeTime: response.data.codeTime });
                        const updateTS = await Thueso.findById(req.body.code);
                        res.json({ code: 200, data: updateTS, createAt: thueSo.time });
                    } else {
                        if (thueSo.status == 0 && (new Date().getTime() - thueSo.time) / 1000 > 180) {
                            user = await User.findById(req.user.id);
                            let pay = user.amount + thueSo.amount;
                            await User.findByIdAndUpdate(req.user.id, { amount: pay });
                            const userUD = await User.findById(req.user.id);
                            await Thueso.findByIdAndUpdate(req.body.code, { status: 3 });
                            const updateTS = await Thueso.findById(req.body.code);
                            res.json({ code: 200, data: updateTS, createAt: thueSo.time, user: userUD });
                        } else {
                            res.json({ code: 200, data: thueSo, createAt: thueSo.time, user: user });
                        }

                    }
                } else {
                    res.json({ code: 404, error: "Không tìm thấy yêu cầu hợp lệ, vui lòng liên hệ admin", user: user, thueso: thueSo });
                }
            } catch (err) {
                res.json({ code: 502, error: err });
            }

        })
    },
    createThueSo: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                const user = await User.findById(req.user.id);
                if (user && user.amount > 1) {
                    const url = `http://14.225.255.45:3010/phone/${req.body.quocgia}/${req.body.dichvu}?token=${process.env.tokenO}`;
                    const response = await axios.get(url);
                    if (response && response.data && response.data.phoneNumber) {
                        let pay = user.amount - 800;
                        let amount = 800;
                        switch (req.body.dichvu) {
                            case "Google":
                                amount = 750;
                                break;
                            case "Microsoft":
                                amount = 700;
                                break;
                            case "Discord":
                                amount = 1000;
                                break;
                            case "Telegram":
                                amount = 4000;
                                break;
                            case "Facebook":
                                amount = 800;
                                break;
                            default:
                                amount = 800;
                                break;
                        }
                        const newThueso = await new Thueso({
                            codeID: response.data.id,
                            userID: new mongoose.mongo.ObjectId(user._id),
                            phoneNumber: response.data.phoneNumber,
                            brand: response.data.brand,
                            otp: '',
                            time: req.body.time || new Date().getTime(),
                            amount: amount,
                            timeCreatePhone: response.data.time || new Date()
                        })
                        const thueSo = await newThueso.save();
                        const userupdate = await User.findById(req.user.id);
                        pay = userupdate.amount - amount;
                        const usUD = await User.findByIdAndUpdate(req.user.id, { amount: pay });
                        res.json({ code: 200, data: thueSo, user: usUD });
                    } else {
                        res.json({ code: 404, error: "dịch vụ tạm dừng vui lòng liên hệ admin" });
                    }

                } else {
                    res.json({ code: 403, error: "tài khoản không đủ tiền" });
                }
            } catch (err) {
                res.json({ code: 502, error: err });
            }

        })
    },
    backAmount: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                const user = await User.findById(req.user.id);
                const thueSo = await Thueso.findById(req.body.code);
                if (user && thueSo && thueSo.status == 0) {
                    let pay = user.amount + thueSo.amount;
                    await User.findByIdAndUpdate(req.user.id, { amount: pay });
                    const userupdate = await User.findById(req.user.id);
                    await Thueso.findByIdAndUpdate(req.body.code, { status: 3 });
                    const thueSoUpdate = await Thueso.findById(req.body.code);
                    res.json({ code: 200, data: thueSoUpdate, user: userupdate });
                } else {
                    res.json({ code: 404, error: "Không tìm thấy yêu cầu hợp lệ, vui lòng liên hệ admin" });
                }

            } catch (err) {
                res.json({ code: 502, error: err });
            }
        });
    },
    updateThueSo: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                const updateTS = await Thueso.findByIdAndUpdate(req.body.code, { status: 3 });
                res.json({ code: 200, data: updateTS });
            } catch (err) {
                res.json({ code: 502, error: err });
            }
        })
    }
}

module.exports = thusoController;