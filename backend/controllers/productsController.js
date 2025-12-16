const Product = require("../models/Products");

const bad = (res, msg, code = 400) => res.status(code).json({ ok: false, message: msg });

/*
    get all
    get by id
    create
    update
    delete
*/

exports.getAll = async (_req, res) => {
  const products = await Product.find()
    .populate("user")
    .sort({ createdAt: -1 });

  res.json(products.map((p) => p.toJSON()));
};

/*===================================================================*/

exports.getById = async (req, res) => {
  const p = await Product.findById(req.params.id)
    .populate("user");

  if (!p) return bad(res, "Not found", 404);
  res.json(p.toJSON());
};

/*===================================================================*/

exports.create = async (req, res) => {
  try {
    console.log("FILES:", req.files);

    const imagePaths = req.files
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : [];

    const created = await Product.create({
      user: req.body.user,
      title: req.body.title,
      category: req.body.category,
      traded: req.body.traded === "true",
      public: req.body.public === "true",
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      meeting: req.body.meeting,
      description: req.body.description,
      images: imagePaths,
    });

    res.status(201).json(created.toJSON());
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/*===================================================================*/
//update product
exports.patch = async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!p) return bad(res, "Not found", 404);
  res.json(p.toJSON());
};

/*===================================================================*/

exports.remove = async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return bad(res, "Not found", 404);
  res.json({ ok: true });
};
