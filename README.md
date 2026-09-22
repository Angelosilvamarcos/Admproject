# CONECTA MAIS 4.1 — Vercel + Supabase

A área pública registra novas solicitações no Supabase e a área interna gerencia os atendimentos.

## Estrutura
- Público: nova solicitação e protocolo.
- Equipe: login, dashboard, atendimentos, indicadores e configurações.
- Atendimentos: abrir um registro, alterar status, prioridade, categoria e responsável e salvar no Supabase.

## Deploy
A Vercel usa as variáveis:
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

## Supabase
Execute o `supabase.sql` no SQL Editor do projeto e crie o usuário da equipe em Authentication → Users.

## Google
A integração Google Apps Script/Planilhas será adicionada preservando o fluxo existente, usando o código/URL reais do Apps Script.