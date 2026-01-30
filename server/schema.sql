-- Drop tables if they exist to ensure clean schema (Foreign keys require specific order)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS products; -- Depends on categories
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS subscribers;

-- Admin Users Table
CREATE TABLE admin_users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tier VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(255),
    size VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    image_url TEXT,
    category_slug VARCHAR(255),
    segment VARCHAR(50),
    product_type VARCHAR(50),
    stock_status BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2),
    notes JSON, -- Stores { top: [], heart: [], base: [] }
    rating_media JSON, -- Stores [{ type: 'image'|'video', url: '' }]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_slug) REFERENCES categories(slug) ON DELETE SET NULL
);

-- Orders Table
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_address TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36), -- Keep as simple string if product is deleted? Or Set Null? Or Cascade?
    -- If product is deleted, we still want to keep order history. So maybe just store product_id but allow it to not exist in products table?
    -- But FK constraint enforces existence.
    -- If we delete a product, we usually soft delete or keep it.
    -- But for now, let's allow Set Null or just don't enforce FK on product_id if we want to keep history even if product is gone.
    -- But typically we want FK. Let's use SET NULL.
    product_name VARCHAR(255),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Messages Table
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    subject VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscribers Table
CREATE TABLE subscribers (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
