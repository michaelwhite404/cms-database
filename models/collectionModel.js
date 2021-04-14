const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const pluralize = require("pluralize");
const slugify = require("slugify");
const { fieldTypes } = require("../constants");

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A collection must have a name"],
  },
  singularName: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
    immutable: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  slug: {
    type: String,
  },
  shortId: {
    type: String,
    required: true,
    default: () => nanoid(12),
    immutable: true,
  },
  createdBy: String,
  fields: [
    {
      name: String,
      type: {
        type: String,
        enum: {
          values: fieldTypes,
          message: `Valid field type include: [ ${fieldTypes.join(", ")} ]`,
        },
      },
      slug: {
        type: String,
        required: true,
      },
      required: {
        type: Boolean,
        required: true,
        default: false,
      },
      editable: {
        type: Boolean,
        required: true,
        default: true,
        immutable: true,
      },
      validations: {
        type: Object,
        required: false,
      },
      helpText: {
        type: String,
        required: false,
      },
      order: {
        type: Number,
      },
    },
  ],
});

collectionSchema.pre("save", function (next) {
  this.singularName = pluralize.singular(this.name);
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
