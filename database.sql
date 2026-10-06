-- Script de creacion de base de datos para api-mobile
-- Ejecutar sobre una base de datos PostgreSQL ya creada (por ejemplo: CREATE DATABASE api_mobile;)

-- Tabla de usuarios (login del sistema)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    numero_identificacion VARCHAR(50) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    marca VARCHAR(100),
    stock INTEGER NOT NULL DEFAULT 0,
    precio NUMERIC(12, 2) NOT NULL DEFAULT 0,
    imagen VARCHAR(255), -- URL publica de la imagen del producto
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Usuario de prueba (password: 123456, ya encriptado con bcrypt)
-- Puedes generarlo tu mismo con bcrypt o registrarlo via POST /api/usuarios
-- INSERT INTO usuarios (username, password) VALUES ('admin', '$2a$10$examplehasheddummyvalue...');
