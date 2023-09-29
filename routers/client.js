const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("client/home");
});
router.get("/login", (req, res) => {
    res.render("client/login");
});
router.get("/dash", (req, res) => {
    res.render("client/dash");
})
router.get("/about", (req, res) => {
    res.render("client/about");
})

module.exports = router;