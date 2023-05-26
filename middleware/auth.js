import jwt from "jsonwebtoken";

import { AuthenticationError } from "../errors/index.js";

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: payload.userId };
  } catch (error) {
    console.log("Error at auth.js file ", error);
    throw new AuthenticationError("Authentication invalid");
  }

  next();
};

export default auth;
