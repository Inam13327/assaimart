import { createHmac, randomBytes } from "crypto";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

function getSecret() {
  const base = process.env.ADMIN_SECRET || "change-this-secret";
  return base;
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", salt).update(password).digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const candidate = createHmac("sha256", salt).update(password).digest("hex");
  return candidate === hash;
}

export function createToken(adminId) {
  const secret = getSecret();
  const issuedAt = Date.now();
  const payload = `${adminId}:${issuedAt}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  // Token format: adminId:issuedAt:signature (base64url encoded)
  const token = Buffer.from(`${payload}:${signature}`).toString("base64url");
  return token;
}

export function verifyToken(token) {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    
    const [adminId, issuedAtStr, signature] = parts;
    const issuedAt = parseInt(issuedAtStr, 10);
    
    if (Date.now() - issuedAt > TOKEN_TTL_MS) {
      return null;
    }
    
    const secret = getSecret();
    const payload = `${adminId}:${issuedAt}`;
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    
    if (expected !== signature) {
      return null;
    }
    return { adminId };
  } catch (e) {
    return null;
  }
}

export function revokeToken(token) {
  // Stateless tokens cannot be easily revoked without a blacklist DB.
  // For this simple app, we accept that tokens are valid until expiry.
}

