import User from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, AuthenticationError } from "../errors/index.js";
import attachCookie from "../utils/attachCookies.js";

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new BadRequestError("Please provide all the necessary details");

  const userAlreadyExists = await User.findOne({ email: email });

  // console.log(userAlreadyExists);
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }

  const newUser = await User.create({ name, email, password });
  const token = newUser.createJWT();
  attachCookie({ res, token });
  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    data: {
      user: {
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        location: newUser.location,
      },

      location: newUser.location,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Please provide all values");
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new AuthenticationError("No such User exists!");
  const isPasswordCorrect = user.checkPassword(password);

  if (!isPasswordCorrect) throw new AuthenticationError("Incorrect Password!");

  const token = user.createJWT();
  const oneDay = 1000 * 60 * 60 * 24;

  attachCookie({ res, token });
  user.password = undefined;
  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      user,

      location: user.location,
    },
  });
};

const updateUser = async (req, res, next) => {
  const { email, name, lastName, location } = req.body;

  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.name = name;
  user.email = email;
  user.location = location;
  user.lastName = lastName;

  await user.save();
  const token = user.createJWT();
  attachCookie({ res, token });
  res.status(200).json({
    status: "success",
    data: {
      user,

      userLocation: location,
    },
  });
};

export { login, signup, updateUser };
