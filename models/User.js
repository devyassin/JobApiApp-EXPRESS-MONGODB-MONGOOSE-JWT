const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "u must provide a name"],
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    required: [true, "u must provide an email "],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email not valid !",
    ],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 6,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.methods.getToken = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );
};

UserSchema.methods.comparePasswords = async function (passwordEntred) {
  const isMatched = await bcryptjs.compare(passwordEntred, this.password);
  return isMatched;
};



module.exports = mongoose.model("User", UserSchema);
