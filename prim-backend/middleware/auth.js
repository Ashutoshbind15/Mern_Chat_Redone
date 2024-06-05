import User from "../models/User.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  console.log(req.header("Authorization"));
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log(token);
  if (!token) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    console.log(decoded);

    if (!decoded.id) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    req.user = {
      id: user._id,
      username: user.username,
    };

    next();
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export default authMiddleware;
