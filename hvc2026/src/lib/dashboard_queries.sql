-- Consulta para quartos disponíveis
SELECT * FROM rooms 
WHERE status = 'disponível';

-- Consulta para serviços ativos
SELECT * FROM services 
WHERE active = true;

-- Consulta para reservas recentes
SELECT r.*, c.name as customer_name 
FROM reservations r
JOIN customers c ON r.customer_id = c.id
WHERE r.check_in_date >= CURRENT_DATE - INTERVAL '7 days';

-- Estatísticas de ocupação
SELECT 
  COUNT(*) as total_rooms,
  SUM(CASE WHEN status = 'disponível' THEN 1 ELSE 0 END) as available_rooms,
  SUM(CASE WHEN status = 'ocupado' THEN 1 ELSE 0 END) as occupied_rooms
FROM rooms;

-- Consulta para fotos dos quartos
SELECT 
  r.id,
  r.name,
  r.description,
  CONCAT('${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/rooms/', r.image_path) as image_url
FROM rooms r
WHERE r.status = 'disponível';

-- Consulta para fotos dos serviços
SELECT 
  s.id,
  s.name,
  s.description,
  CONCAT('${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/services/', s.image_path) as image_url
FROM services s
WHERE s.active = true;

-- Inserir fotos de quartos
INSERT INTO rooms (name, description, image_path, status)
VALUES 
  ('Quarto Presidencial', 'Quarto de luxo com vista para o mar', 'Pre.jpg', 'disponível'),
  ('Quarto Executivo', 'Quarto confortável para viagens de negócios', 'Exec.jpg', 'disponível');

-- Inserir fotos de serviços
INSERT INTO services (name, description, image_path, active)
VALUES 
  ('Massagem', 'Massagem relaxante de 60 minutos', 'massagem.jpg', true),
  ('Jantar Romântico', 'Jantar à luz de velas com vinho', 'jantar.jpg', true);

-- Inserir fotos via formulário admin
INSERT INTO rooms (name, description, image_path, status)
VALUES 
  (:nome, :descricao, :caminho_imagem, :status);

INSERT INTO services (name, description, image_path, active)
VALUES 
  (:nome, :descricao, :caminho_imagem, :ativo);