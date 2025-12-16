const router = require("express").Router();
const c = require("../controllers/productsController");

router.get("/", c.getAll);
router.get("/:id", c.getById);

const upload = require("../middleware/upload");
router.post("/",upload.array("images", 4),c.create);

router.patch("/:id", c.patch);
router.delete("/:id", c.remove);

module.exports = router;
