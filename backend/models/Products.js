const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new mongoose.Schema(
  {
    // owner
    user: {
      type: Schema.Types.ObjectId, 
      ref:'User', 
      required: true 
    },

    title: { type: String, required: true, trim: true },

    category: {
      type: String,
      required: true,
      enum: ["Home", "Electronics", "Accessories", "Collectibles", "Clothes", "Toys"],
    },

    date: { type: Date, default: Date.now },

    traded: { type: Boolean, default: false },
    public: { type: Boolean, default: true },

    country: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },

    meeting: { type: String, maxlength: 50, trim: true },
    description: { type: String, maxlength: 5000, trim: true },

    images: {
      type: [String],
      validate: [(arr) => arr.length <= 4, "Max 4 images allowed"],
      default: undefined,
    },

  },
  { timestamps: true }
);

ProductSchema.pre("save", function () {
  if (!this.images || this.images.length === 0) {
    this.images = ["/uploads/product.png"];
  }
});


ProductSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel
