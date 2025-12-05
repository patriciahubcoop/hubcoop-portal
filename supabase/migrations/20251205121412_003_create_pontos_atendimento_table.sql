/*
  # Criar tabela de Pontos de Atendimento

  1. Nova Tabela
    - `pontos_atendimento` - Pontos de atendimento das cooperativas
      - `id` (uuid, primary key)
      - `central_id` (uuid, foreign key)
      - `cooperativa_id` (uuid, foreign key)
      - `codigo` (text)
      - `nome` (text)
      - Campos de endereço, contato e responsável
      - `ativo` (boolean)
      - `created_at`, `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS
    - Políticas para master, central, cooperativa
*/

CREATE TABLE IF NOT EXISTS pontos_atendimento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  central_id uuid NOT NULL REFERENCES centrais(id) ON DELETE CASCADE,
  cooperativa_id uuid NOT NULL REFERENCES cooperativas(id) ON DELETE CASCADE,
  codigo text NOT NULL,
  nome text NOT NULL,
  endereco text,
  cidade text,
  estado text,
  telefone text,
  email text,
  responsavel text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_pontos_cooperativa_codigo ON pontos_atendimento(cooperativa_id, codigo);
CREATE INDEX idx_pontos_central_id ON pontos_atendimento(central_id);
CREATE INDEX idx_pontos_cooperativa_id ON pontos_atendimento(cooperativa_id);

ALTER TABLE pontos_atendimento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master pode visualizar todos os pontos"
  ON pontos_atendimento FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'perfil' = 'master'
    )
  );

CREATE POLICY "Central pode visualizar seus pontos"
  ON pontos_atendimento FOR SELECT
  TO authenticated
  USING (
    central_id = (SELECT raw_app_meta_data->>'central_id' FROM auth.users WHERE id = auth.uid())::uuid
  );

CREATE POLICY "Cooperativa pode visualizar seus pontos"
  ON pontos_atendimento FOR SELECT
  TO authenticated
  USING (
    cooperativa_id = (SELECT raw_app_meta_data->>'cooperativa_id' FROM auth.users WHERE id = auth.uid())::uuid
  );

CREATE POLICY "Ponto de Atendimento pode se visualizar"
  ON pontos_atendimento FOR SELECT
  TO authenticated
  USING (
    id = (SELECT raw_app_meta_data->>'ponto_atendimento_id' FROM auth.users WHERE id = auth.uid())::uuid
  );

CREATE POLICY "Master, Central e Cooperativa podem criar pontos"
  ON pontos_atendimento FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_app_meta_data->>'perfil' IN ('master', 'central', 'cooperativa')
    )
  );

CREATE POLICY "Master, Central e Cooperativa podem editar seus pontos"
  ON pontos_atendimento FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND (
        u.raw_app_meta_data->>'perfil' = 'master'
        OR (
          u.raw_app_meta_data->>'perfil' = 'central'
          AND pontos_atendimento.central_id = (u.raw_app_meta_data->>'central_id')::uuid
        )
        OR (
          u.raw_app_meta_data->>'perfil' = 'cooperativa'
          AND pontos_atendimento.cooperativa_id = (u.raw_app_meta_data->>'cooperativa_id')::uuid
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
          AND pontos_atendimento.central_id = (u.raw_app_meta_data->>'central_id')::uuid
        )
        OR (
          u.raw_app_meta_data->>'perfil' = 'cooperativa'
          AND pontos_atendimento.cooperativa_id = (u.raw_app_meta_data->>'cooperativa_id')::uuid
        )
      )
    )
  );
