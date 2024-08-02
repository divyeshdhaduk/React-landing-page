const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    store_name: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    package_id:{
      type: Schema.Types.ObjectId,
      ref: "Package"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Store", StoreSchema);