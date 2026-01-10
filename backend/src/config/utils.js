import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // accessible only by web server through HTTP and not by client-side JS &prevent XSS attacks:cross-site scripting
    sameSite: process.env.NODE_ENV === "production"  ? "none" : "lax"
    // sameSite: "strict", // CSRF protection
    secure: process.env.NODE_ENV === "development" ? false : true,
  });
  return token;
};
