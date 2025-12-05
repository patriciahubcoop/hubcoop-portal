/*
  # Criar tabela de Centrais

  1. Nova Tabela
    - `centrais` - Centrais cooperativas do sistema
      - `id` (uuid, primary key)
      - `codigo` (text, unique)
      - `nome` (text)
      - `cnpj` (text, unique)
      - `endereco` (text)
      - `cidade` (text)
      - `estado` (text)
      - `telefone` (text)
      - `email` (text)
      - `ativo` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS
    - Políticas para master (visualizar e editar) e central (visualizar sua central)
*/

CREATE TABLE IF NOT EXISTS centrais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text UNIQUE NOT NULL,
  nome text NOT NULL,
  cnpj text UNIQUE NOT NULL,
  endereco text,
  cidade text,
  estado text,
  telefone text,
  email text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_centrais_codigo ON centrais(codigo);
CREATE INDEX idx_centrais_nome ON centrais(nome);

ALTER TABLE centrais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master pode visualizar todas as centrais"
  ON centrais FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'perfil' = 'master'
    )
  );

CREATE POLICY "Centrais pode visualizar sua central"
  ON centrais FOR SELECT
  TO authenticated
  USING (
    id = (SELECT raw_app_meta_data->>'central_id' FROM auth.users WHERE id = auth.uid())::uuid
  );

CREATE POLICY "Master pode criar centrais"
  ON centrais FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'perfil' = 'master'
    )
  );

CREATE POLICY "Master pode editar centrais"
  ON centrais FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'perfil' = 'master'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'perfil' = 'master'
    )
  );
