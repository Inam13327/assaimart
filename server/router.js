import { parse } from "url";
import pool from "./db.js";
import { hashPassword, verifyPassword, createToken, verifyToken, revokeToken } from "./auth.js";
import { randomUUID } from "crypto";

// --- Helper Functions ---

function createId() {
  return randomUUID();
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  });
  res.end(payload);
}

function notFound(res) {
  sendJson(res, 404, { error: "Not found" });
}

function methodNotAllowed(res) {
  sendJson(res, 405, { error: "Method not allowed" });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        const json = JSON.parse(data);
        console.log('Incoming Body:', json); // Debugging
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function getAuthToken(req) {
  const header = req.headers["authorization"];
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer") return null;
  return token || null;
}

// --- Middleware-like Functions ---

async function requireAdmin(req, res) {
  const token = getAuthToken(req);
  const payload = verifyToken(token);
  if (!payload) {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }
  
  try {
    const [rows] = await pool.query("SELECT * FROM admin_users WHERE id = ?", [payload.adminId]);
    if (rows.length === 0) {
      sendJson(res, 401, { error: "Unauthorized" });
      return null;
    }
    return { admin: rows[0], token };
  } catch (err) {
    console.error("Admin Auth Error:", err);
    sendJson(res, 500, { error: err.message });
    return null;
  }
}

// --- Initialization ---

export async function initDB() {
  try {
    const connection = await pool.getConnection();
    try {
      // Check Admin
      // We assume tables exist because schema.sql should be run manually or we could try to run it.
      // But typically we just check if empty and seed.
      
      // Seed Admin
      const [admins] = await connection.query("SELECT count(*) as count FROM admin_users");
      if (admins[0].count === 0) {
        console.log("Seeding default admin user...");
        await connection.query(
          "INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)",
          [createId(), "assaimartofficial@gmail.com", hashPassword("AssaiMart123#"), "Administrator"]
        );
      }

      // Seed Categories
      const [cats] = await connection.query("SELECT count(*) as count FROM categories");
      if (cats[0].count === 0) {
        console.log("Seeding default categories...");
        const categories = [
          { name: "Premium Perfumes", slug: "premium", tier: "premium" },
          { name: "Medium Range Perfumes", slug: "medium", tier: "medium" },
          { name: "Basic / Budget Perfumes", slug: "basic", tier: "basic" },
          { name: "Men", slug: "men", tier: "segment-men" },
          { name: "Women", slug: "women", tier: "segment-women" },
          { name: "Unisex", slug: "unisex", tier: "segment-unisex" },
        ];
        for (const cat of categories) {
          await connection.query(
            "INSERT INTO categories (id, name, slug, tier) VALUES (?, ?, ?, ?)",
            [createId(), cat.name, cat.slug, cat.tier]
          );
        }
      }

      // Ensure subscribers table has is_read column
      try {
        await connection.query("ALTER TABLE subscribers ADD COLUMN is_read BOOLEAN DEFAULT FALSE");
        console.log("Added is_read column to subscribers table");
      } catch (e) {
        // Column likely exists
      }

    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Database initialization failed (tables might be missing):", err);
  }
}

// --- Main Handler ---

export async function handleRequest(req, res) {
  const { pathname, query } = parse(req.url || "", true);

  // 1. Global CORS & Method Fix
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (!pathname || !pathname.startsWith("/api")) {
    notFound(res);
    return;
  }

  // Health Check
  if (pathname === "/api/health" && req.method === "GET") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  // --- Orders (Public POST) ---
  if ((pathname === "/api/orders" || pathname === "/api/checkout") && req.method === "POST") {
    try {
      const body = await parseBody(req);
      console.log('Incoming Order Body:', body);

      const { items, customer } = body;
      if (!items || !Array.isArray(items) || !customer || !customer.name || !customer.phone || !customer.address) {
        sendJson(res, 400, { error: "Missing order information" });
        return;
      }

      const orderId = createId();
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();

        // Insert Order
        await connection.query(
          "INSERT INTO orders (id, customer_name, customer_email, customer_phone, customer_address, status) VALUES (?, ?, ?, ?, ?, ?)",
          [orderId, customer.name, customer.email || "", customer.phone, customer.address, "processing"]
        );

        // Insert Order Items
        for (const item of items) {
          await connection.query(
            "INSERT INTO order_items (order_id, product_id, product_name, quantity, price, image_url) VALUES (?, ?, ?, ?, ?, ?)",
            [orderId, item.productId || null, item.name, item.quantity, item.price, item.imageUrl || item.image || ""]
          );
        }

        await connection.commit();
        sendJson(res, 201, { orderId });
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
      }

    } catch (err) {
      console.error("Order Save Error:", err);
      if (err instanceof SyntaxError && err.message.includes("JSON")) {
          sendJson(res, 400, { error: "Invalid JSON" });
      } else {
          sendJson(res, 500, { error: err.message });
      }
    }
    return;
  }

  if (pathname && pathname.startsWith("/api/orders/") && req.method === "GET") {
    const id = pathname.split("/").pop();
    try {
      const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
      if (rows.length === 0) {
        notFound(res);
        return;
      }
      const o = rows[0];
      const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
      const order = {
        id: o.id,
        customer: {
          name: o.customer_name,
          email: o.customer_email,
          phone: o.customer_phone,
          address: o.customer_address
        },
        status: o.status,
        createdAt: o.created_at,
        items: items.map(i => ({
          productId: i.product_id,
          productName: i.product_name,
          quantity: i.quantity,
          price: Number(i.price),
          imageUrl: i.image_url
        }))
      };
      sendJson(res, 200, order);
    } catch (e) {
      sendJson(res, 500, { error: e.message });
    }
    return;
  }
 
  // --- Admin Login ---
  if (pathname === "/api/admin/login" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const { email, password } = body;
      
      const [rows] = await pool.query("SELECT * FROM admin_users WHERE email = ?", [email]);
      const admin = rows[0];

      if (!admin || !verifyPassword(password, admin.password_hash)) {
        sendJson(res, 401, { error: "Invalid credentials" });
        return;
      }

      const token = createToken(admin.id);
      sendJson(res, 200, {
        token,
        admin: { id: admin.id, email: admin.email, name: admin.name },
      });
    } catch (e) {
      console.error("Login Error:", e);
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // --- Admin Logout ---
  if (pathname === "/api/admin/logout" && req.method === "POST") {
    const token = getAuthToken(req);
    if (token) {
      revokeToken(token);
    }
    sendJson(res, 200, { success: true });
    return;
  }

  // --- Reset Password ---
  if (pathname === "/api/admin/reset-password" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const { password } = body;
      
      if (!password || typeof password !== "string" || password.length < 6) {
        sendJson(res, 400, { error: "Password must be at least 6 characters" });
        return;
      }

      // Hardcoded for now to reset the main admin
      const [rows] = await pool.query("SELECT * FROM admin_users WHERE email = ?", ["assaimartofficial@gmail.com"]);
      if (rows.length === 0) {
        sendJson(res, 404, { error: "Admin user not found" });
        return;
      }
      
      const adminId = rows[0].id;
      const newHash = hashPassword(password);
      await pool.query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [newHash, adminId]);
      
      sendJson(res, 200, { success: true });
    } catch (e) {
      console.error(e);
      sendJson(res, 400, { error: "Invalid request body" });
    }
    return;
  }

  // --- Categories (Public GET) ---
  if (pathname === "/api/categories" && req.method === "GET") {
    try {
      const [rows] = await pool.query("SELECT * FROM categories");
      sendJson(res, 200, rows);
    } catch (e) {
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // --- Contact (Public POST) ---
  if (pathname === "/api/contact" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const { name, email, subject, message } = body;
      if (!name || !email || !subject || !message) {
        sendJson(res, 400, { error: "Missing contact information" });
        return;
      }
      
      await pool.query(
        "INSERT INTO messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)",
        [createId(), name, email, subject, message]
      );
      
      sendJson(res, 201, { success: true });
    } catch (e) {
      console.error(e);
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // --- Newsletter (Public POST) ---
  if (pathname === "/api/newsletter/subscribe" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const email = body && typeof body.email === "string" ? body.email.trim() : "";
      if (!email) {
        sendJson(res, 400, { error: "Email is required" });
        return;
      }
      
      // Check duplicate
      const [existing] = await pool.query("SELECT id FROM subscribers WHERE email = ?", [email]);
      if (existing.length === 0) {
         await pool.query(
          "INSERT INTO subscribers (id, email) VALUES (?, ?)",
          [createId(), email]
        );
      }
      sendJson(res, 200, { success: true });
    } catch (e) {
      console.error(e);
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // --- Products (Public GET) ---
  if (pathname === "/api/products" && req.method === "GET") {
    try {
      let sql = "SELECT * FROM products WHERE 1=1";
      const params = [];

      if (query.category) {
        sql += " AND category_slug = ?";
        params.push(query.category);
      }
      if (query.segment) {
        sql += " AND segment = ?";
        params.push(query.segment);
      }
      // Tier is in categories table actually, but product also stores it? 
      // Schema says product doesn't have tier column? 
      // Wait, schema.sql says products has category_slug. Categories table has tier.
      // The JSON logic filtered by p.tier.
      // If schema doesn't have tier in products, we need to join categories.
      // Let's check schema again.
      // Schema: products has `category_slug`, `segment`, `product_type`. No `tier`.
      // Categories table has `tier`.
      // So filtering by tier requires JOIN.
      
      if (query.tier) {
         // We need to join
         // This complicates things if we construct string.
         // Let's modify the base query if tier is present.
         // "SELECT p.* FROM products p JOIN categories c ON p.category_slug = c.slug WHERE c.tier = ?"
         // This assumes we only select products.
      }
      
      // For simplicity and speed in this rewrite, let's fetch all and filter in JS if complex, 
      // OR better, do a proper join if needed.
      // But let's check if products table has tier in schema.
      // Schema: `CREATE TABLE products ...`
      // `category_slug VARCHAR(255)`
      // `segment VARCHAR(50)`
      // `product_type VARCHAR(50)`
      // No tier.
      // But the JSON data had tier.
      // Maybe I should add tier to products or join.
      // Let's just do a JOIN query for everything to be safe.
      
      let querySql = `
        SELECT p.*, c.tier as category_tier 
        FROM products p 
        LEFT JOIN categories c ON p.category_slug = c.slug 
        WHERE 1=1
      `;
      
      if (query.category) {
        querySql += " AND p.category_slug = ?";
        params.push(query.category);
      }
      if (query.segment) {
        querySql += " AND p.segment = ?";
        params.push(query.segment);
      }
      if (query.tier) {
        querySql += " AND c.tier = ?";
        params.push(query.tier);
      }
      if (query.productType) {
        querySql += " AND p.product_type = ?";
        params.push(query.productType);
      }
      if (query.featured) {
        querySql += " AND p.is_featured = TRUE";
      }
      if (query.q) {
        querySql += " AND (p.name LIKE ? OR p.description LIKE ?)";
        const term = `%${query.q}%`;
        params.push(term, term);
      }
      
      const [rows] = await pool.query(querySql, params);
      
      // Transform rows to match frontend expectations (camelCase vs snake_case)
      const products = rows.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        brand: p.brand,
        size: p.size,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        categorySlug: p.category_slug,
        segment: p.segment,
        tier: p.category_tier || "premium", // Fallback if join is null
        productType: p.product_type,
        featuredHome: Boolean(p.is_featured),
        imageUrl: p.image_url,
        notes: typeof p.notes === 'string' ? JSON.parse(p.notes) : p.notes,
        available: Boolean(p.stock_status),
        rating: p.rating ? Number(p.rating) : undefined,
        ratingMedia: typeof p.rating_media === 'string' ? JSON.parse(p.rating_media) : p.rating_media,
      }));
      
      // Fallback for missing tier (e.g. if category deleted)
      // If we don't have tiers, frontend might crash if it relies on it for filtering
      
      sendJson(res, 200, products);
    } catch (e) {
      console.error(e);
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // --- Single Product (GET) ---
  if (pathname && pathname.startsWith("/api/products/") && req.method === "GET") {
    const id = pathname.split("/").pop();
    try {
      const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
      if (rows.length === 0) {
        notFound(res);
        return;
      }
      const p = rows[0];
      const product = {
        id: p.id,
        name: p.name,
        description: p.description,
        brand: p.brand,
        size: p.size,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        categorySlug: p.category_slug,
        segment: p.segment,
        productType: p.product_type,
        featuredHome: Boolean(p.is_featured),
        imageUrl: p.image_url,
        notes: typeof p.notes === 'string' ? JSON.parse(p.notes) : p.notes,
        available: Boolean(p.stock_status),
        rating: p.rating ? Number(p.rating) : undefined,
        ratingMedia: typeof p.rating_media === 'string' ? JSON.parse(p.rating_media) : p.rating_media,
      };
      sendJson(res, 200, product);
    } catch (e) {
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // --- Admin Routes (Protected) ---

  // Admin Overview
  if (pathname === "/api/admin/overview" && req.method === "GET") {
    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    
    try {
      const [prodCount] = await pool.query("SELECT count(*) as count FROM products");
      const [ordCount] = await pool.query("SELECT count(*) as count FROM orders");
      const [newOrdCount] = await pool.query("SELECT count(*) as count FROM orders WHERE status = 'processing'");
      const [msgCount] = await pool.query("SELECT count(DISTINCT email) as count FROM messages WHERE is_read = FALSE");
      const [subCount] = await pool.query("SELECT count(*) as count FROM subscribers WHERE is_read = FALSE");
      
      const overview = {
        totalProducts: prodCount[0].count,
        totalOrders: ordCount[0].count,
        newOrders: newOrdCount[0].count,
        unreadMessages: msgCount[0].count,
        unreadSubscribers: subCount[0].count,
      };
      sendJson(res, 200, overview);
    } catch (e) {
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // Admin Messages
  if (pathname === "/api/admin/messages" && req.method === "GET") {
    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    try {
      const [rows] = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
      const messages = rows.map(m => ({
        ...m,
        read: Boolean(m.is_read),
        createdAt: m.created_at
      }));
      sendJson(res, 200, messages);
    } catch (e) {
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // Admin Mark Messages Read
  if (pathname === "/api/admin/messages/mark-read" && req.method === "POST") {
    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    try {
      await pool.query("UPDATE messages SET is_read = TRUE");
      sendJson(res, 200, { success: true });
    } catch (e) {
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // Admin Delete Message
  if (pathname && pathname.startsWith("/api/admin/messages/") && req.method === "DELETE") {
    const id = pathname.split("/").pop();
    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    try {
      await pool.query("DELETE FROM messages WHERE id = ?", [id]);
      sendJson(res, 200, { id });
    } catch (e) {
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // Admin Subscribers
  if (pathname === "/api/admin/subscribers" && req.method === "GET") {
    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    try {
      const [rows] = await pool.query("SELECT * FROM subscribers ORDER BY created_at DESC");
      sendJson(res, 200, rows);
    } catch (e) {
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // Admin Mark Subscribers Read
  if (pathname === "/api/admin/subscribers/mark-read" && req.method === "POST") {
    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    try {
      await pool.query("UPDATE subscribers SET is_read = TRUE");
      sendJson(res, 200, { success: true });
    } catch (e) {
      sendJson(res, 500, { error: e.message });
    }
    return;
  }

  // Admin Products (GET/POST)
  if (pathname === "/api/admin/products") {
    if (req.method === "GET") {
      const ctx = await requireAdmin(req, res);
      if (!ctx) return;
      try {
        // Reuse the public logic or similar? Public logic has filters. Admin usually wants all.
        // We need to map snake_case to camelCase
        const [rows] = await pool.query("SELECT * FROM products");
        const products = rows.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          brand: p.brand,
          size: p.size,
          price: Number(p.price),
          originalPrice: p.original_price ? Number(p.original_price) : undefined,
          categorySlug: p.category_slug,
          segment: p.segment,
          productType: p.product_type,
          featuredHome: Boolean(p.is_featured),
          imageUrl: p.image_url,
          notes: typeof p.notes === 'string' ? JSON.parse(p.notes) : p.notes,
          available: Boolean(p.stock_status),
          rating: p.rating ? Number(p.rating) : undefined,
          ratingMedia: typeof p.rating_media === 'string' ? JSON.parse(p.rating_media) : p.rating_media,
        }));
        sendJson(res, 200, products);
      } catch (e) {
        sendJson(res, 500, { error: e.message });
      }
      return;
    }

    if (req.method === "POST") {
      const ctx = await requireAdmin(req, res);
      if (!ctx) return;
      try {
        const body = await parseBody(req);
        const id = createId();
        
        const params = [
          id,
          body.name || "",
          body.description || "",
          body.brand || "ASSAIMART",
          body.size || "100ml",
          Number(body.price) || 0,
          body.originalPrice ? Number(body.originalPrice) : null,
          body.imageUrl || "",
          body.categorySlug || "premium",
          body.segment || "unisex",
          body.productType || "Perfume",
          body.available !== false,
          Boolean(body.featuredHome),
          Boolean(body.bestseller),
          Number(body.rating) || 0,
          JSON.stringify(body.notes || {}),
          JSON.stringify(body.ratingMedia || [])
        ];

        await pool.query(`
          INSERT INTO products (
            id, name, description, brand, size, price, original_price, image_url,
            category_slug, segment, product_type, stock_status, is_featured, is_bestseller,
            rating, notes, rating_media
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, params);
        
        sendJson(res, 201, { id, ...body });
      } catch (e) {
        console.error("Product Save Error:", e);
        sendJson(res, 500, { error: e.message });
      }
      return;
    }
  }

  // Admin Product Detail (PUT/DELETE)
  if (pathname && pathname.startsWith("/api/admin/products/")) {
    const id = pathname.split("/").pop();
    if (req.method === "PUT") {
      const ctx = await requireAdmin(req, res);
      if (!ctx) return;
      try {
        const body = await parseBody(req);
        // We need to fetch existing to merge? OR just update what's provided.
        // SQL UPDATE allows partial updates if we build query dynamically.
        // For simplicity, let's assume body contains fields to update or we update all.
        // Frontend usually sends full object.
        
        let updateSql = "UPDATE products SET ";
        const updateParams = [];
        
        // Map fields
        const fieldMap = {
          name: "name",
          description: "description",
          brand: "brand",
          size: "size",
          price: "price",
          originalPrice: "original_price",
          imageUrl: "image_url",
          categorySlug: "category_slug",
          segment: "segment",
          productType: "product_type",
          available: "stock_status",
          featuredHome: "is_featured",
          bestseller: "is_bestseller",
          rating: "rating",
          notes: "notes",
          ratingMedia: "rating_media"
        };

        const clauses = [];
        for (const [key, val] of Object.entries(body)) {
          if (fieldMap[key]) {
            clauses.push(`${fieldMap[key]} = ?`);
            if (key === 'notes' || key === 'ratingMedia') {
               updateParams.push(JSON.stringify(val));
            } else {
               updateParams.push(val);
            }
          }
        }
        
        if (clauses.length === 0) {
           sendJson(res, 200, { message: "Nothing to update" });
           return;
        }
        
        updateSql += clauses.join(", ") + " WHERE id = ?";
        updateParams.push(id);
        
        await pool.query(updateSql, updateParams);
        sendJson(res, 200, { id, ...body });
      } catch (e) {
        console.error("Product Update Error:", e);
        sendJson(res, 500, { error: e.message });
      }
      return;
    }

    if (req.method === "DELETE") {
      const ctx = await requireAdmin(req, res);
      if (!ctx) return;
      try {
        await pool.query("DELETE FROM products WHERE id = ?", [id]);
        sendJson(res, 200, { id });
      } catch (e) {
        sendJson(res, 500, { error: e.message });
      }
      return;
    }
  }

  // Admin Orders
  if (pathname === "/api/admin/orders" && req.method === "GET") {
    const ctx = await requireAdmin(req, res);
    if (!ctx) return;
    try {
      const [orders] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
      // For each order, get items
      // This is N+1 but acceptable for small scale. Better to use JOIN.
      // Let's use Promise.all
      const enriched = await Promise.all(orders.map(async (o) => {
        const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [o.id]);
        return {
           id: o.id,
           customer: {
             name: o.customer_name,
             email: o.customer_email,
             phone: o.customer_phone,
             address: o.customer_address
           },
           status: o.status,
           createdAt: o.created_at,
           items: items.map(i => ({
             productId: i.product_id,
             productName: i.product_name,
             quantity: i.quantity,
             price: Number(i.price),
             imageUrl: i.image_url
           }))
        };
      }));
      sendJson(res, 200, enriched);
    } catch (e) {
      sendJson(res, 500, { error: e.message });
    }
    return;
  }
  
  // Admin Single Order (GET - Details, PUT - Update Status)
  if (pathname && pathname.startsWith("/api/admin/orders/")) {
    const id = pathname.split("/").pop();
    
    // GET Single Order
    if (req.method === "GET") {
      const ctx = await requireAdmin(req, res);
      if (!ctx) return;
      try {
        const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
        if (rows.length === 0) {
          notFound(res);
          return;
        }
        const o = rows[0];
        const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
        
        const order = {
           id: o.id,
           customer: {
             name: o.customer_name,
             email: o.customer_email,
             phone: o.customer_phone,
             address: o.customer_address
           },
           status: o.status,
           createdAt: o.created_at,
           items: items.map(i => ({
             productId: i.product_id,
             productName: i.product_name,
             quantity: i.quantity,
             price: Number(i.price),
             imageUrl: i.image_url
           }))
        };
        sendJson(res, 200, order);
      } catch (e) {
        sendJson(res, 500, { error: e.message });
      }
      return;
    }

    // PUT Update Status
    if (req.method === "PUT") {
      const ctx = await requireAdmin(req, res);
      if (!ctx) return;
      try {
        const body = await parseBody(req);
        const { status } = body;
        if (status) {
          await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
        }
        sendJson(res, 200, { id, status });
      } catch (e) {
        sendJson(res, 500, { error: e.message });
      }
      return;
    }

    // DELETE Order
    if (req.method === "DELETE") {
      const ctx = await requireAdmin(req, res);
      if (!ctx) return;
      try {
        // Delete order items first (though CASCADE might be set, let's be safe)
        await pool.query("DELETE FROM order_items WHERE order_id = ?", [id]);
        await pool.query("DELETE FROM orders WHERE id = ?", [id]);
        sendJson(res, 200, { id });
      } catch (e) {
        sendJson(res, 500, { error: e.message });
      }
      return;
    }
    return;
  }

  methodNotAllowed(res);
}
