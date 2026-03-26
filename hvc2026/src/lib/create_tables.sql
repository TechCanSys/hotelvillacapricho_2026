-- Tabela de quartos
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_path VARCHAR(255),
  status VARCHAR(20) NOT NULL CHECK (status IN ('disponível', 'ocupado', 'manutenção'))
);

-- Tabela de serviços
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_path VARCHAR(255),
  active BOOLEAN NOT NULL DEFAULT true
);

-- Tabela de clientes
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de reservas
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) NOT NULL,
  room_id INTEGER REFERENCES rooms(id) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  adults INTEGER NOT NULL,
  children INTEGER DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'confirmada', 'cancelada')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  room_type VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_promotion BOOLEAN DEFAULT false,
  promotion_price DECIMAL(10,2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE promotions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  room_type VARCHAR(100) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- Inserir dados iniciais
INSERT INTO rooms (name, description, image_path, status) VALUES
  ('Quarto Presidencial', 'Quarto de luxo com vista para o mar', 'Pre.jpg', 'disponível'),
  ('Quarto Executivo', 'Quarto confortável para viagens de negócios', 'Exec.jpg', 'disponível');

INSERT INTO services (name, description, image_path, active) VALUES
  ('Massagem', 'Massagem relaxante de 60 minutos', 'massagem.jpg', true),
  ('Jantar Romântico', 'Jantar à luz de velas com vinho', 'jantar.jpg', true);