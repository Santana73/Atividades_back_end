# Loja de Informática — Back-end + Front-end com autenticação

## Como rodar
1. **Criar o banco e a tabela** (MySQL 8+ ou MariaDB):
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   Cria o banco `loja_informatica`, a tabela `produtos` e 5 produtos iniciais.
2. **Configurar as credenciais**: copie `.env.example` para `.env` e preencha `DB_USER`, `DB_PASSWORD` etc.
   O `.env` está no `.gitignore` e não deve ser versionado.
3. **Instalar e iniciar**:
   ```bash
   npm install
   npm start
   ```
4. Abra **http://localhost:3000** (você será levado para a tela de login).

Se o banco não responder, o servidor avisa no console e encerra.

## Banco de dados
- Driver: `mysql2` (pool de conexões em `db.js`, lendo o `.env` via `dotenv`).
- Tabela `produtos`: `id` (PK, auto increment), `nome` (UNIQUE), `categoria` (indexada), `preco` DECIMAL(10,2), `estoque`.
- `data/produtosData.js` concentra o SQL; todas as consultas usam parâmetros `?` (sem SQL Injection).

| Endpoint | SQL |
|---|---|
| `GET /produtos` | `SELECT` |
| `GET /produtos/:id` | `SELECT ... WHERE id = ?` |
| `GET /produtos?categoria=X` | `SELECT ... WHERE categoria = ?` |
| `POST /produtos` | `INSERT` |
| `PUT /produtos/:id` | `UPDATE` |
| `DELETE /produtos/:id` | `DELETE` |

Os usuários de login continuam fictícios e em memória (`data/usuariosData.js`).

## Contas fictícias
| Usuário  | Senha        | Role  | Permissão                              |
|----------|--------------|-------|----------------------------------------|
| admin    | admin123     | admin | consultar, cadastrar, editar, remover  |
| cliente  | cliente123   | user  | somente consultar                      |

## Fluxo de autenticação
1. `POST /login` com `{ "usuario", "senha" }` → devolve `{ token, tipo, usuario }` (JWT HS256, expira em 1h).
2. O front-end guarda o token no **localStorage** e envia `Authorization: Bearer <token>` em todo `fetch` (função `requisitar` em `public/js/auth.js`).
3. **Middleware `autenticar`** (`middlewares/autenticar.js`) valida o token a cada requisição → **401** se ausente/inválido/expirado.
4. **Middleware `autorizar('admin')`** (`middlewares/autorizar.js`) confere a role → **403** se não for admin.

| Rota                  | Acesso               |
|-----------------------|----------------------|
| `POST /login`         | público              |
| `GET /produtos[/:id]` | usuário autenticado  |
| `POST /produtos`      | **somente admin**    |
| `PUT/DELETE /produtos/:id` | somente admin   |

## Estrutura
```
app.js / server.js
db.js                          conexão MySQL (pool)
database/schema.sql            criação do banco, tabela e dados iniciais
.env / .env.example            credenciais (o .env não vai para o git)
config/auth.js                 segredo, expiração e algoritmo do JWT
routes/ controllers/ services/ data/ errors/ middlewares/
public/
  login.html  js/login.js      tela de login
  index.html  js/app.js        listagem + cadastro
  js/auth.js                   localStorage + fetch com Authorization
  css/style.css
```
