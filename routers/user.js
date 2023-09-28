const userController = require("../controllers/userController");

const router = require("express").Router();

//get all
router.get("/", userController.getAllUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
