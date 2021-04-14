const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
    },
    _cid: {
      type: mongoose.Schema.ObjectId,
      ref: "Collection",
      required: true,
    },
    "created-by": {
      type: String,
    },
    "updated-by": {
      type: String,
    },
    "updated-on": {
      type: Date,
      default: () => Date.now(),
      required: true,
    },
    "created-on": {
      type: Date,
      default: () => Date.now(),
      required: true,
    },
  },
  { strict: false }
);

itemSchema.index({ _cid: 1 });

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
