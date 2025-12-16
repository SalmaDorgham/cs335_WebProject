const mongoose = require("mongoose");
const { Schema } = mongoose;

//cart
const CartItemSchema = new mongoose.Schema({

    item: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    tradeitem: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    status: {
      type: String,
      enum: ["waiting", "approved", "denied", "complete"],
      default: "waiting",
    },

  },{ _id: false });

//user
const UserSchema = new mongoose.Schema({

    email: {type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },

    country: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },

    cart: {
      type: Map,
      of: CartItemSchema,
      default: {},
    },

},{ timestamps: true });

UserSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    if (ret.cart instanceof Map) ret.cart = Object.fromEntries(ret.cart);
    return ret;
  },
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel