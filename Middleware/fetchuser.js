import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const key = process.env.SECRET_KEY;

export const fetchUserData = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ error: "Please authenticate with a valid token" });
  }

  try {
    const data = jwt.verify(token, key);
    req.data = data;
    next();  // Pass control to the next middleware or route handler
  } catch (error) {
    console.log(error);
    res.status(400).send("Internal server error");
  }
};
