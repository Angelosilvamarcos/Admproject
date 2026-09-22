# CONECTA MAIS 4.1 — Vercel + Supabase

## Correção
O login agora aceita `VITE_SUPABASE_PUBLISHABLE_KEY` (atual) ou `VITE_SUPABASE_ANON_KEY` (legado).

## Vercel
Em Project → Settings → Environment Variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

Marque Production, Preview e Development e depois faça Redeploy.

## Supabase
Authentication → Users → Add user.
Crie o e-mail e senha da equipe. O login usa `signInWithPassword`.

## Rotas
Públicas: `/`, `/solicitacao`, `/protocolo/:id`, `/login`.
Protegidas: `/dashboard`, `/atendimentos`, `/indicadores`, `/configuracoes`.

A integração Google Planilhas não é inventada neste pacote: para preservar o seu fluxo, o `apps_script.gs` e a URL real do Apps Script precisam ser usados na próxima etapa.
