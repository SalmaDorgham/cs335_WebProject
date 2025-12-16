const bcrypt = require("bcryptjs");
const User = require("../models/Users");

const bad = (res, msg, code = 400) => res.status(code).json({ ok: false, message: msg });

/*
    register
    login
    reset password
*/

exports.register = async (req, res) => {
  try {
    const { email, password, country, state, city } = req.body;
    if (!email || !password || !country || !state || !city) return bad(res, "Missing fields");

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return bad(res, "Email already registered");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      country,
      state,
      city,
      cart: {},
    });

    return res.status(201).json({ ok: true, user: user.toJSON() });
  } catch (e) {
    return bad(res, "Register failed");
  }
};

/*===================================================================*/

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return bad(res, "Missing email/password");

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return bad(res, "Incorrect email or password", 401);

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return bad(res, "Incorrect email or password", 401);

    return res.json({ ok: true, user: user.toJSON() });
  } catch {
    return bad(res, "Login failed");
  }
};

/*===================================================================*/

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return bad(res, "Missing fields");

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return bad(res, "No account found with this email.", 404);

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ ok: true, message: "Password updated successfully!" });
  } catch {
    return bad(res, "Reset password failed");
  }
};
