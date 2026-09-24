-- Arquivamento, exclusão controlada e preparação para sincronização com a planilha
-- Execute no Supabase > SQL Editor.

alter table public.solicitacoes add column if not exists excluida boolean not null default false;
alter table public.solicitacoes add column if not exists excluida_em timestamptz;
alter table public.solicitacoes add column if not exists excluir_da_planilha boolean not null default false;

-- Garante que registros antigos continuem visíveis.
update public.solicitacoes
set excluida = false
where excluida is null;

-- O site interno só consegue marcar/remover registros como usuário autenticado.
drop policy if exists "authenticated can update solicitacoes" on public.solicitacoes;
create policy "authenticated can update solicitacoes"
on public.solicitacoes
for update
to authenticated
using (true)
with check (true);

-- Se no futuro houver exclusão física, esta política pode ser usada.
drop policy if exists "authenticated can delete solicitacoes" on public.solicitacoes;
create policy "authenticated can delete solicitacoes"
on public.solicitacoes
for delete
to authenticated
using (true);

notify pgrst, 'reload schema';
