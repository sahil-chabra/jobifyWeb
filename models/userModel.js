import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a user name"],
    minlength: 3,
    maxlength: 25,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 25,
    trim: true,
    default: "lastName",
  },
  location: {
    type: String,
    default: "my city",
  },
});

userScheme.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userScheme.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIREY,
  });
};

userScheme.methods.checkPassword = async function (candidatePassword) {
  const check = await bcrypt.compare(candidatePassword, this.password);
  return check;
};

export default mongoose.model("User", userScheme);
