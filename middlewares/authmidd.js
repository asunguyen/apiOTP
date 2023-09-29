const jwt = require("jsonwebtoken");

const authMiddl = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.jwtKey, (err, user) => {
                if (err) {
                    res.json({code: 403, error: "Token is not valid"});
                } 
                req.user = user;
                next();
            })
        } else {
            res.json({code: 401, error: "You're not authenticated"});
        }
    },
    verifyTokenAdmin: (req, res, next) => {
        authMiddl.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin) {
                next();
            } else {
                res.json({code: 403, error: "You're not allowed to delete other"});
            }
        })
    }
};
module.exports = authMiddl;