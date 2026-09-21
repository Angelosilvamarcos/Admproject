# CONECTA MAIS 4.1 — GitHub Pages

Esta versão foi feita para o repositório ficar **todo na raiz**, exatamente como no print do GitHub.

## Estrutura
- `index.html`
- `main.jsx`
- `index.css`
- `package.json`
- `vite.config.js`
- `.github/workflows/deploy.yml`

## Publicação
No GitHub: Settings → Pages → Source: GitHub Actions.

Depois de enviar os arquivos para a branch `main`, o workflow faz o build e publica o `dist`.

## Importante
O login real depende do Supabase. O layout e a proteção das rotas já estão preparados.
