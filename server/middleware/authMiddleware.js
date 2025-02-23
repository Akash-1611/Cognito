import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "❌ Access Denied: No Token Provided" });
  }

  // ✅ Extract the token from "Bearer <token>"
  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ error: "❌ Invalid Token Format" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach decoded user info to request
    next();
  } catch (err) {
    return res.status(403).json({ error: "❌ Invalid or Expired Token" });
  }
};

export default authMiddleware;
