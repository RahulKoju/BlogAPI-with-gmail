require("dotenv").config();
const { Schema, model } = require("mongoose");
const { createToken } = require("../services/authentication");
const bcrypt = require("bcryptjs");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    profileImageUrl: {
      type: String,
      default: "/images/useravatar.jpg",
    },
    verified:{
      type:Boolean,
      default:false,
    }
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password,salt);
  this.salt = salt;
  this.password = hashedPassword;
  next();
});
userSchema.static(
  "matchPasswordAndGenrateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not found");
    const validPassword = await bcrypt.compare(password,user.password);
    if (!validPassword)
      throw new Error("Incorrect password");
    if (!user.verified) {
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
				const url = `${process.env.BASE_URL}user/${user.id}/verify/${token.token}`;
				await sendEmail(user.email, "Verify Email", url);
			}
			return res
				.status(400)
				.send({ message: "An Email sent to your account please verify" });
		}
    const token = createToken(user);
    return token;
  }
);
const User = model("user", userSchema);
module.exports = User;
