import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,

    // 🔐 REQUIRED FOR CROSS-DOMAIN AUTH
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });

  return token;
};
