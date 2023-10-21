const User = require("../models/user");
const Payment = require("../models/payment");
const Thueso = require("../models/thueso");
const authMiddl = require("../middlewares/authmidd");
const adminController = {
    getListUser: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    getUserDetail: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    createUser: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    getDichVu: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    updateDichVu: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    createDichVu: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    getPayment: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    userInfo: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try {
                let username = req.body.username;
                const user = await User.findOne({ username: username });
                if (user) {
                    const { password, ...others } = user._doc;
                    const countRequest = await Thueso.countDocuments({ userID: user._id });
                    const totalOTP = await Thueso.countDocuments({ userID: user._id, status: 1 });
                    const totalAmountOtp = await Thueso.aggregate([{ $match: { userID: user._id, status: 1 } }, { $group: { _id: "$userID", totalAmount: { $sum: '$amount' } } }]);
                    const listOTP = await Thueso.find({ status: 1, userID: user._id });
                    const listPay = await Payment.aggregate([
                        { $match: { status: 1, userID: user._id } },
                        { $group: { _id: "$userID", totalAmount: { $sum: '$amount' } } }
                    ]);

                    let countPay = listPay[0];
                    let totalPay = countPay ? countPay.totalAmount * 1000 : 0;
                    let totalAmountOTPres = totalAmountOtp[0] ? totalAmountOtp[0].totalAmount : 0;
                    let amountChange = user.amount + totalAmountOTPres - totalPay;
                    let data = {
                        user: { ...others },
                        amount: user.amount,
                        totalPay: totalPay,
                        totalRequest: countRequest,
                        totalOTP: totalOTP,
                        totalAmountOTP: totalAmountOTPres,
                        listOTP: listOTP,
                        amountChange: amountChange
                    }
                    res.json({ code: 200, data: data });
                } else {
                    res.json({ code: 404, error: "không tìm thấy thông tin user có username: " + username });
                }
            } catch (err) {
                res.json({ code: 502, error: err });
            }

        })
    },
    hoantienUser: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try {
                let username = req.body.username;
                const user = await User.findOne({ username: username });
                if (user) {
                    const totalAmountOtp = await Thueso.aggregate([{ $match: { userID: user._id, status: 1 } }, { $group: { _id: "$userID", totalAmount: { $sum: '$amount' } } }]);
                    const listPay = await Payment.aggregate([
                        { $match: { status: 1, userID: user._id } },
                        { $group: { _id: "$userID", totalAmount: { $sum: '$amount' } } }
                    ]);
                    let totalPay = listPay[0] ? listPay[0].totalAmount * 1000 : 0;
                    let totalAmountOTPres = totalAmountOtp[0] ? totalAmountOtp[0].totalAmount : 0;
                    let amountChange = user.amount + totalAmountOTPres - totalPay;
                    let userUD;
                    let amountUD = user.amount - amountChange;
                    userUD = await User.findByIdAndUpdate(user._id, {amount: amountUD});
                    res.json({code: 200, data: userUD});
                } else {
                    res.json({ code: 404, error: "Không tìm thấy user có username: " + username });
                }
            } catch (err) {
                res.json({ code: 502, error: err });
            }
        })
    }
}

module.exports = adminController;