# Loja de Informática — Back-end + Front-end

## Como rodar
```bash
npm install
npm start
```
Abra **http://localhost:3000** no navegador.

## Estrutura
```
app.js / server.js        Express (API + arquivos estáticos)
routes/ controllers/ services/ data/ errors/ middlewares/   Back-end (API /produtos)
public/
  index.html              Estrutura da página
  css/style.css           Estilos
  js/app.js               fetch GET/POST, renderização e atualização da lista
```

## Integração
- `GET  /produtos` (e `?categoria=X`) → listagem e filtro
- `POST /produtos` → cadastro; após o sucesso a listagem é recarregada
- Mensagens de erro da API (validação, nome duplicado) são exibidas no formulário.
