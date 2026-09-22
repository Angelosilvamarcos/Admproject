# CONECTA MAIS 4.1 — Vercel + Supabase

## 1. Variáveis na Vercel
Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` para Development, Preview e Production.

## 2. Criar tabela no Supabase
No SQL Editor, execute o arquivo `supabase.sql`.

## 3. Fluxo
A área pública grava novas solicitações na tabela `solicitacoes`. A equipe autenticada consegue visualizar os registros em `/atendimentos` e os totais no Dashboard.

A integração Google Apps Script/Planilhas permanece separada para não substituir uma integração existente sem o código real do Apps Script.
