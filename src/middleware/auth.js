import jwt from "jsonwebtoken";
import { userModel } from "../../database/models/user.model.js";

export const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({ message: "Please sign up" });
  }

  try {
    const decodedToken = jwt.verify(authorization, process.env.JWT_SECRET);
    if (!decodedToken || !decodedToken.id) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const isUserExist = await userModel.findById(decodedToken.id);
    if (!isUserExist) {
      return res.status(400).json({ message: "Invalid login credentials" });
    }
    req.authUser = isUserExist;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
