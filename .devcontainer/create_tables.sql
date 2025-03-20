-- DROP TABLES
DROP TABLE IF EXISTS shopping_cart CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table 
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address VARCHAR(500)
);

-- Create shopping cart table
CREATE TABLE shopping_cart (
    cart_id SERIAL PRIMARY KEY,
    cart_details VARCHAR(500),
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL
);

-- Create products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_price DECIMAL(10,2) NOT NULL
);

-- Create orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    order_date DATE NOT NULL,
    order_time TIME NOT NULL
);