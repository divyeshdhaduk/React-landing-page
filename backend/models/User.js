const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    email_verified_at: {
      type: Date,
    },
    status: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: "en",
    },
    password: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    two_auth: {
      type: Boolean,
      default: false,
    },
    two_auth_secret: {
      type: String,
      default: "",
    },
    store_id: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    role_id: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      default:null,
    },
    image:{
      type:String,
      default:''
    },
    isAdmin:{
      type:Boolean,
      default:false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
