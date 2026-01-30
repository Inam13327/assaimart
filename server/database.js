import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const dataDir = join(process.cwd(), "server", "data");

async function ensureDataDir() {
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

async function readJson(file, defaultValue) {
  await ensureDataDir();
  const filePath = join(dataDir, file);
  if (!existsSync(filePath)) {
    await writeFile(filePath, JSON.stringify(defaultValue, null, 2), "utf8");
    return structuredClone(defaultValue);
  }
  const raw = await readFile(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(defaultValue);
  }
}

async function writeJson(file, data) {
  await ensureDataDir();
  const filePath = join(dataDir, file);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function getInitialData() {
  const [products, categories, orders, admin, messages, subscribers] = await Promise.all([
    readJson("products.json", []),
    readJson("categories.json", []),
    readJson("orders.json", []),
    readJson("admin.json", []),
    readJson("messages.json", []),
    readJson("subscribers.json", []),
  ]);

  return { products, categories, orders, adminUsers: admin, messages, subscribers };
}

export async function saveProducts(products) {
  await writeJson("products.json", products);
}

export async function saveCategories(categories) {
  await writeJson("categories.json", categories);
}

export async function saveOrders(orders) {
  await writeJson("orders.json", orders);
}

export async function saveAdminUsers(adminUsers) {
  await writeJson("admin.json", adminUsers);
}

export async function saveMessages(messages) {
  await writeJson("messages.json", messages);
}

export async function saveSubscribers(subscribers) {
  await writeJson("subscribers.json", subscribers);
}

export function createId() {
  return randomUUID();
}
