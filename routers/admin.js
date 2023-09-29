const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("client/home");
});

router.get("/login", (req, res) => {
    res.render("admin/login");
})

module.exports = router;