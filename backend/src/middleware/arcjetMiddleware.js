import aj from "../config/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Access denied for bots." });
      } else {
        return res.status(403).json({ message: "Access denied by Arcjet." });
      }
    }

    // Additional spoofed bot check
    if (decision.results.some(isSpoofedBot)) {
      // Paid Arcjet accounts include additional verification checks using IP data.
      // Verification isn't always possible, so we recommend checking the decision
      // separately.
      // https://docs.arcjet.com/bot-protection/reference#bot-verification
      return res.status(403).json({
        error: "Spoofed bot detected.",
        message: "Malicious activity detected.",
      });
    }
    next();
  } catch (error) {
    console.error("Arcjet Middleware Error:", error);
    next();
  }
};
export default arcjetMiddleware;
