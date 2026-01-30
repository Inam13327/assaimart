import { createHmac, randomBytes } from "crypto";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 4;

let tokens = new Map();

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
  const payload = `${adminId}:${issuedAt}:${secret}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  const token = Buffer.from(`${adminId}:${issuedAt}:${signature}`).toString("base64url");
  tokens.set(token, { adminId, issuedAt });
  return token;
}

export function verifyToken(token) {
  if (!token) return null;
  const cached = tokens.get(token);
  if (!cached) return null;
  if (Date.now() - cached.issuedAt > TOKEN_TTL_MS) {
    tokens.delete(token);
    return null;
  }
  const secret = getSecret();
  const decoded = Buffer.from(token, "base64url").toString("utf8");
  const [adminId, issuedAt, signature] = decoded.split(":");
  const payload = `${adminId}:${issuedAt}:${secret}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  if (expected !== signature) {
    tokens.delete(token);
    return null;
  }
  return { adminId };
}

export function revokeToken(token) {
  tokens.delete(token);
}

