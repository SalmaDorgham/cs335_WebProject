const bcrypt = require("bcryptjs");
const User = require("../models/Users");

const bad = (res, msg, code = 400) => res.status(code).json({ ok: false, message: msg });

/*
    get all
    get by id
    create
    update cart
    change password
*/

exports.getAll = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map((u) => u.toJSON()));
};

/*===================================================================*/

exports.getById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return bad(res, "User not found", 404);
  res.json(user.toJSON());
};

/*===================================================================*/
// update cart
exports.patch = async (req, res) => {
  try {
    const { email, country, state, city, cart } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return bad(res, "User not found", 404);

    if (email) user.email = email.toLowerCase();
    if (country) user.country = country;
    if (state) user.state = state;
    if (city) user.city = city;

    if (cart && typeof cart === "object") {
      user.cart = cart;
    }

    await user.save();
    res.json({ ok: true, user: user.toJSON() });
  } catch {
    return bad(res, "Update failed");
  }
};

/*===================================================================*/
// change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return bad(res, "Missing fields");

    const user = await User.findById(req.params.id);
    if (!user) return bad(res, "User not found", 404);

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return bad(res, "Incorrect current password.", 401);

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ ok: true, message: "Password updated" });
  } catch {
    return bad(res, "Password update failed");
  }
};
