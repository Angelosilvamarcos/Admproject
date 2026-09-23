-- Correção do registro de resposta/solução dos atendimentos
-- Execute este arquivo no Supabase > SQL Editor.

alter table public.solicitacoes
  add column if not exists resposta text;

alter table public.solicitacoes
  add column if not exists respondido_em timestamptz;

-- Garante que a equipe autenticada possa atualizar o atendimento.
alter table public.solicitacoes enable row level security;

drop policy if exists "authenticated can update solicitacoes" on public.solicitacoes;
create policy "authenticated can update solicitacoes"
on public.solicitacoes
for update
to authenticated
using (true)
with check (true);

-- Solicita ao PostgREST que recarregue o schema.
notify pgrst, 'reload schema';
