-- =========================================================
-- MYHOUSE: Script SQL para criação das tabelas no Supabase
-- Cole e execute este script no "SQL Editor" do seu painel Supabase
-- =========================================================

-- 1. Tabela da Casa / Orçamento Geral
CREATE TABLE IF NOT EXISTS houses (
  id TEXT PRIMARY KEY DEFAULT 'main-house',
  name TEXT NOT NULL DEFAULT 'Nossa Casinha',
  total_budget NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Ambientes (Cômodos)
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  house_id TEXT REFERENCES houses(id) ON DELETE CASCADE DEFAULT 'main-house',
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Móveis / Itens
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1,
  store_url TEXT,
  store_name TEXT,
  purchased BOOLEAN NOT NULL DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  notes TEXT,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- Habilitar Políticas de Acesso Público (Leitura e Escrita direta)
-- =========================================================
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total publico houses" ON houses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total publico rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total publico items" ON items FOR ALL USING (true) WITH CHECK (true);

-- =========================================================
-- Habilitar Publicação Realtime para sincronização ao vivo
-- =========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE houses;
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE items;

-- =========================================================
-- Registro Base Inicial (Apenas a Casa vazia com orçamento a definir)
-- =========================================================
INSERT INTO houses (id, name, total_budget)
VALUES ('main-house', 'Nossa Casinha', 0)
ON CONFLICT (id) DO NOTHING;
