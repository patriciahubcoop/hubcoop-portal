# Integração Supabase - Hubcoop

## Status da Implementação

✓ Banco de dados Supabase configurado
✓ Tabelas criadas com RLS (Row Level Security)
✓ Serviços de API criados
✓ Hook de autenticação sem senha
✓ Página de login com OTP
✓ Controle de acesso baseado em perfil

## Tabelas Criadas

### 1. `centrais`
- Armazena as centrais cooperativas (ex: Credisis)
- Campos: código, nome, CNPJ, endereço, contato
- RLS: Master pode CRUD; Central pode visualizar sua central

### 2. `cooperativas`
- Cooperativas vinculadas a centrais
- Campos: central_id, código, nome, CNPJ, tipo, limites
- RLS: Master pode CRUD; Central pode gerenciar suas cooperativas

### 3. `pontos_atendimento`
- Pontos de atendimento das cooperativas
- Campos: central_id, cooperativa_id, código, nome, contato
- RLS: Master, Central e Cooperativa podem gerenciar seus pontos

### 4. `cooperados`
- Cooperados do sistema
- Campos: central_id, cooperativa_id, ponto_atendimento_id, dados pessoais
- RLS: Acesso hierárquico baseado no perfil

## Autenticação sem Senha (OTP)

A autenticação funciona com código de verificação enviado por email:

1. Usuário insere seu email
2. Sistema envia código OTP para o email
3. Usuário insere o código
4. Login realizado e redirecionado para o dashboard

### Perfis e Permissões

| Perfil | Email | Acesso |
|--------|-------|--------|
| master | patricia.holanda@hubcoop.com.br | Apenas Centrais |
| central | patricia.holanda@credisis.com.br | Cooperativas e Pontos da sua central |
| cooperativa | patricia.holanda@cooperativacoopesa.com.br | Cooperados e Pontos da sua cooperativa |
| ponto_atendimento | patricia.holanda@pa03.com.br | Apenas cooperados do seu ponto |

## Serviços Criados

### `src/services/centraisService.ts`
```typescript
centraisService.list()       // Listar todas
centraisService.getById()    // Obter por ID
centraisService.create()     // Criar
centraisService.update()     // Atualizar
centraisService.delete()     // Deletar
```

### `src/services/cooperativasService.ts`
```typescript
cooperativasService.list()
cooperativasService.getById()
cooperativasService.create()
cooperativasService.update()
cooperativasService.delete()
```

### `src/services/pontosAtendimentoService.ts`
```typescript
pontosAtendimentoService.list()
pontosAtendimentoService.getById()
pontosAtendimentoService.create()
pontosAtendimentoService.update()
pontosAtendimentoService.delete()
```

### `src/services/cooperadosService.ts`
```typescript
cooperadosService.list()
cooperadosService.getById()
cooperadosService.create()
cooperadosService.update()
cooperadosService.delete()
```

### `src/services/authService.ts`
```typescript
authService.signUpWithoutPassword()  // Criar usuário
authService.signInWithOtp()          // Enviar OTP
authService.verifyOtp()              // Verificar OTP
authService.getCurrentUser()         // Usuário atual
authService.signOut()                // Logout
authService.updateUserMetadata()     // Atualizar metadados
```

## Hook de Autenticação

```typescript
import { useAuth } from '@/hooks/useAuth';

const {
  user,           // Usuário autenticado
  session,        // Sessão
  loading,        // Carregando
  perfil,         // Perfil (master, central, cooperativa, ponto_atendimento)
  centralId,      // ID da central (se aplicável)
  cooperativaId,  // ID da cooperativa (se aplicável)
  pontoAtendimentoId // ID do ponto (se aplicável)
} = useAuth();
```

## Páginas Principais

### Login (`/login`)
- Autenticação sem senha com OTP
- Integrada ao Supabase Auth

### Dashboard (`/dashboard`)
- Protegida por autenticação
- Filtra dados baseado no perfil do usuário

### Centrais (`/centrais`)
- Apenas para perfil `master`
- CRUD completo de centrais

### Cooperativas (`/cooperativas`)
- Para `master` e `central`
- `Master` vê todas; `Central` vê suas cooperativas

### Pontos de Atendimento (`/pontos-atendimento`)
- Para `master`, `central` e `cooperativa`
- Gerenciamento hierárquico de pontos

### Cooperados (`/cooperados`)
- Para todos os perfis
- Filtra dados baseado no perfil do usuário
- Inclui seleção de Central, Cooperativa e Ponto de Atendimento

## Popular Dados

Acesse a página "Popular Dados" para criar:
- 1 Central (Credisis)
- 14 Cooperativas
- 4 Pontos de Atendimento por cooperativa

## Variáveis de Ambiente

Já configuradas em `.env`:
```
VITE_SUPABASE_URL=seu_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

## Próximos Passos

1. Instalar dependências: `npm install`
2. Iniciar dev server: `npm run dev`
3. Acessar login em `http://localhost:5173/login`
4. Usar um email para receber o código OTP
5. Popular dados via página "Popular Dados"
6. Testar diferentes perfis

## Segurança

- RLS habilitado em todas as tabelas
- Acesso baseado em perfil do usuário
- Políticas que verificam `auth.uid()` e metadados do usuário
- Sem exposição de dados sensíveis
