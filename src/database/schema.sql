-- The objective is to create a database schema for an inventory management system. The schema will include 
-- tables for store, products, and inventory.

-- Each store has a unique name and API key.
CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, 
    api_key TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Connects store and products with their stock levels. 
-- Each store can have multiple products, and each product 
-- can be available in multiple stores. The stock column 
-- represents the quantity of a specific product available 
-- in a specific store.
CREATE TABLE IF NOT EXISTS inventory (
    store_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0), -- check ensures that stock cannot be negative

    -- identifies the entity uniquely by combining store_id and product_id, ensuring that 
    --each store-product pair is unique in the inventory.
    PRIMARY KEY (store_id, product_id),

    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    
    -- ON DELETE CASCADE ensures that if a parent record is deleted,
    -- all related child records are also deleted, maintaining
    -- referential integrity.
);

