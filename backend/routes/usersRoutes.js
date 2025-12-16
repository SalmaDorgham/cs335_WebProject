const router = require("express").Router();
const c = require("../controllers/usersController");

router.get("/", c.getAll);
router.get("/:id", c.getById);
router.patch("/:id", c.patch);
router.post("/:id/change-password", c.changePassword);

module.exports = router;
