/*
  # Criar tabela de Cooperativas

  1. Nova Tabela
    - `cooperativas` - Cooperativas vinculadas a centrais
      - `id` (uuid, primary key)
      - `central_id` (uuid, foreign key)
      - `codigo` (text, unique)
      - `nome` (text)
      - `cnpj` (text, unique)
      - `tipo` (text: 'central' ou 'singular')
      - `envio_cartao` (text: 'cooperativa' ou 'cooperado')
      - `conta_cartao` (text)
      - `limite_outorgado` (numeric)
      - `limite_utilizado` (numeric)
      - Campos de endereço e contato
      - `ativo` (boolean)
      - `created_at`, `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS
    - Políticas para master, central e cooperativa
*/

CREATE TABLE IF NOT EXISTS cooperativas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  central_id uuid NOT NULL REFERENCES centrais(id) ON DELETE RESTRICT,
  codigo text NOT NULL,
  nome text NOT NULL,
  cnpj text UNIQUE NOT NULL,
  tipo text CHECK (tipo IN ('central', 'singular')) DEFAULT 'singular',
  envio_cartao text CHECK (envio_cartao IN ('cooperativa', 'cooperado')) DEFAULT 'cooperativa',
  conta_cartao text,
  limite_outorgado numeric DEFAULT 0,
  limite_utilizado numeric DEFAULT 0,
  endereco text,
  cidade text,
  estado text,
  telefone text,
  email text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_cooperativas_central_codigo ON cooperativas(central_id, codigo);
CREATE INDEX idx_cooperativas_central_id ON cooperativas(central_id);
CREATE INDEX idx_cooperativas_nome ON cooperativas(nome);

ALTER TABLE cooperativas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master pode visualizar todas as cooperativas"
  ON cooperativas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'perfil' = 'master'
    )
  );

CREATE POLICY "Central pode visualizar suas cooperativas"
  ON cooperativas FOR SELECT
  TO authenticated
  USING (
    central_id = (SELECT raw_app_meta_data->>'central_id' FROM auth.users WHERE id = auth.uid())::uuid
  );

CREATE POLICY "Cooperativa pode visualizar a si mesma"
  ON cooperativas FOR SELECT
  TO authenticated
  USING (
    id = (SELECT raw_app_meta_data->>'cooperativa_id' FROM auth.users WHERE id = auth.uid())::uuid
  );

CREATE POLICY "Master e Central podem criar cooperativas"
  ON cooperativas FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'perfil' IN ('master', 'central')
    )
  );

CREATE POLICY "Master e Central podem editar suas cooperativas"
  ON cooperativas FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND (
        u.raw_app_meta_data->>'perfil' = 'master'
        OR (
          u.raw_app_meta_data->>'perfil' = 'central'
          AND cooperativas.central_id = (u.raw_app_meta_data->>'central_id')::uuid
        )
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND (
        u.raw_app_meta_data->>'perfil' = 'master'
        OR (
          u.raw_app_meta_data->>'perfil' = 'central'
          AND cooperativas.central_id = (u.raw_app_meta_data->>'central_id')::uuid
        )
      )
    )
  );
