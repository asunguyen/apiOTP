
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authController = {
    //register
    registerUser: async(req, res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed
            });
            const user = await newUser.save();
            res.json({code: 200, data: user});
        }catch(err) {
            res.json({code: 500, error: err});
        }
    },
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({username: req.body.username});
            if (!user) {
                res.json({code: 404, error: "Wrong username"});
            }
            const validPass = bcrypt.compare(req.body.password, user.password);
            if (!validPass) {
                res.json({code: 404, error: "Wrong password"});
            }
            if (user && validPass) {
                jwt.sign({
                    id: user._id,
                    admin: user.isAdmin,

                }, process.env.jwtKey);
                res.json({code: 200, data: user});
            }
            
        } catch(err) {
            res.json({code: 500, error: err});
        }
    }
};
module.exports = authController;