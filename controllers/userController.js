const User = require("../models/user");

const userController = {
    getAllUser: async(req, res) => {
        try{
            const user = await User.find();
            res.json({code: 200, data: user});
        }catch(err) {
            res.json({code: 500, error: err});
        }
    },
    deleteUser: async(req, res) => {
        try{
            const user = await User.findById(req.params.id);
            res.json({code: 200, data: user});
        }catch(err) {
            res.json({code: 500, error: err});
        }
    }
}

module.exports = userController;