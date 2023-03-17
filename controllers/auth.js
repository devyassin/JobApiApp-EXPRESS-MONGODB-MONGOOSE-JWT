const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const {
    body: { email },
  } = req;
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    throw new UnauthenticatedError("Email already exict try new one !");
  }


  const user = await User.create({ ...req.body });
  const token = user.getToken();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide an email and password !");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Not valid Cridentials !");
  }

  const isPasswordCorrect = await user.comparePasswords(password);

  if (!isPasswordCorrect) {
    console.log(isPasswordCorrect);
    throw new UnauthenticatedError("Incorrect password !");
  }

  const token = user.getToken();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { login, register };
