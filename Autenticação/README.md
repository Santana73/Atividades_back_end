# Loja de Informática — Back-end + Front-end com autenticação

## Como rodar
```bash
npm install
npm start
```
Abra **http://localhost:3000** (você será levado para a tela de login).

Opcional: `JWT_SECRET=um-segredo-longo npm start` (sem isso, usa um segredo de desenvolvimento).

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
config/auth.js                 segredo, expiração e algoritmo do JWT
routes/ controllers/ services/ data/ errors/ middlewares/
public/
  login.html  js/login.js      tela de login
  index.html  js/app.js        listagem + cadastro
  js/auth.js                   localStorage + fetch com Authorization
  css/style.css
```
