const router = require("express").Router();
const c = require("../controllers/authController");

router.post("/register", c.register);
router.post("/login", c.login);
router.post("/reset-password", c.resetPassword);

module.exports = router;