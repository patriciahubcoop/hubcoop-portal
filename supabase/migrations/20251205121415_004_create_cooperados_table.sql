/*
  # Criar tabela de Cooperados

  1. Nova Tabela
    - `cooperados` - Cooperados do sistema
      - `id` (uuid, primary key)
      - `central_id`, `cooperativa_id`, `ponto_atendimento_id` (uuid, foreign keys)
      - `cpf`, `nome_completo`, `rg`, `data_nascimento`, `sexo`
      - `email`, `telefone`, `celular`
      - Endereço completo
      - `conta_corrente`, `status`
      - `created_at`, `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS
    - Políticas para acesso hierárquico
*/

CREATE TABLE IF NOT EXISTS cooperados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  central_id uuid REFERENCES centrais(id) ON DELETE SET NULL,
  cooperativa_id uuid NOT NULL REFERENCES cooperativas(id) ON DELETE CASCADE,
  ponto_atendimento_id uuid REFERENCES pontos_atendimento(id) ON DELETE SET NULL,
  cpf text UNIQUE NOT NULL,
  nome_completo text NOT NULL,
  nome_impresso_cartao text,
  rg text,
  data_nascimento date,
  sexo text CHECK (sexo IN ('M', 'F', 'Outro')),
  email text,
  telefone text,
  celular text,
  endereco text,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  estado text,
  cep text,
  conta_corrente text,
  status text CHECK (status IN ('ativo', 'inativo', 'bloqueado', 'anulado')) DEFAULT 'ativo',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_cooperados_cpf ON cooperados(cpf);
CREATE INDEX idx_cooperados_central_id ON cooperados(central_id);
CREATE INDEX idx_cooperados_cooperativa_id ON cooperados(cooperativa_id);
CREATE INDEX idx_cooperados_ponto_atendimento_id ON cooperados(ponto_atendimento_id);
CREATE INDEX idx_cooperados_status ON cooperados(status);

ALTER TABLE cooperados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master pode visualizar todos os cooperados"
  ON cooperados FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'perfil' = 'master'
    )
  );

CREATE POLICY "Central pode visualizar seus cooperados"
  ON cooperados FOR SELECT
  TO authenticated
  USING (
    central_id = (SELECT raw_app_meta_data->>'central_id' FROM auth.users WHERE id = auth.uid())::uuid
  );

CREATE POLICY "Cooperativa pode visualizar seus cooperados"
  ON cooperados FOR SELECT
  TO authenticated
  USING (
    cooperativa_id = (SELECT raw_app_meta_data->>'cooperativa_id' FROM auth.users WHERE id = auth.uid())::uuid
  );

CREATE POLICY "Ponto pode visualizar seus cooperados"
  ON cooperados FOR SELECT
  TO authenticated
  USING (
    ponto_atendimento_id = (SELECT raw_app_meta_data->>'ponto_atendimento_id' FROM auth.users WHERE id = auth.uid())::uuid
  );

CREATE POLICY "Master, Central, Cooperativa e Ponto podem criar cooperados"
  ON cooperados FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.raw_app_meta_data->>'perfil' IN ('master', 'central', 'cooperativa', 'ponto_atendimento')
    )
  );

CREATE POLICY "Acesso hierárquico para editar cooperados"
  ON cooperados FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND (
        u.raw_app_meta_data->>'perfil' = 'master'
        OR (
          u.raw_app_meta_data->>'perfil' = 'central'
          AND cooperados.central_id = (u.raw_app_meta_data->>'central_id')::uuid
        )
        OR (
          u.raw_app_meta_data->>'perfil' = 'cooperativa'
          AND cooperados.cooperativa_id = (u.raw_app_meta_data->>'cooperativa_id')::uuid
        )
        OR (
          u.raw_app_meta_data->>'perfil' = 'ponto_atendimento'
          AND cooperados.ponto_atendimento_id = (u.raw_app_meta_data->>'ponto_atendimento_id')::uuid
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
          AND cooperados.central_id = (u.raw_app_meta_data->>'central_id')::uuid
        )
        OR (
          u.raw_app_meta_data->>'perfil' = 'cooperativa'
          AND cooperados.cooperativa_id = (u.raw_app_meta_data->>'cooperativa_id')::uuid
        )
        OR (
          u.raw_app_meta_data->>'perfil' = 'ponto_atendimento'
          AND cooperados.ponto_atendimento_id = (u.raw_app_meta_data->>'ponto_atendimento_id')::uuid
        )
      )
    )
  );
