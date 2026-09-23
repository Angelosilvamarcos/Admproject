-- Conecta Mais 4.1 - identificação de solicitações duplicadas/semelhantes
-- Execute este arquivo no SQL Editor do mesmo projeto Supabase usado pelo app.

create schema if not exists extensions;
create extension if not exists pg_trgm with schema extensions;

alter table public.solicitacoes
  add column if not exists duplicada boolean not null default false,
  add column if not exists duplicada_de_id bigint,
  add column if not exists duplicada_de_protocolo text,
  add column if not exists similaridade numeric(5,4),
  add column if not exists criterio_duplicidade text;

create index if not exists solicitacoes_assunto_trgm_idx
  on public.solicitacoes using gin (assunto extensions.gin_trgm_ops);

create index if not exists solicitacoes_mensagem_trgm_idx
  on public.solicitacoes using gin (mensagem extensions.gin_trgm_ops);

create or replace function public.detectar_duplicidade_solicitacao()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidato record;
  score real;
begin
  select
    s.id,
    s.protocolo,
    extensions.similarity(lower(coalesce(s.assunto, '')), lower(coalesce(new.assunto, ''))) as sim_assunto,
    extensions.similarity(lower(coalesce(s.mensagem, '')), lower(coalesce(new.mensagem, ''))) as sim_mensagem,
    case
      when coalesce(lower(trim(s.categoria)), '') <> ''
       and lower(trim(s.categoria)) = lower(trim(coalesce(new.categoria, ''))) then 0.05
      else 0
    end as bonus_categoria
  into candidato
  from public.solicitacoes s
  where s.id is not null
    and s.created_at >= now() - interval '180 days'
  order by
    (
      extensions.similarity(lower(coalesce(s.assunto, '')), lower(coalesce(new.assunto, ''))) * 0.45
      + extensions.similarity(lower(coalesce(s.mensagem, '')), lower(coalesce(new.mensagem, ''))) * 0.55
      + case
          when coalesce(lower(trim(s.categoria)), '') <> ''
           and lower(trim(s.categoria)) = lower(trim(coalesce(new.categoria, ''))) then 0.05
          else 0
        end
    ) desc,
    s.created_at desc
  limit 1;

  if candidato.id is null then
    return new;
  end if;

  score := least(
    1,
    candidato.sim_assunto * 0.45
    + candidato.sim_mensagem * 0.55
    + candidato.bonus_categoria
  );

  if (
      candidato.sim_assunto >= 0.82 and candidato.sim_mensagem >= 0.65
    ) or (
      candidato.sim_assunto >= 0.65 and candidato.sim_mensagem >= 0.78
    ) or (
      candidato.sim_assunto >= 0.90 and candidato.sim_mensagem >= 0.55
    ) then
    new.duplicada := true;
    new.duplicada_de_id := candidato.id;
    new.duplicada_de_protocolo := candidato.protocolo;
    new.similaridade := round(score::numeric, 4);
    new.criterio_duplicidade := 'Assunto e mensagem semelhantes' ||
      case when candidato.bonus_categoria > 0 then ' + mesma categoria' else '' end;
  else
    new.duplicada := false;
    new.duplicada_de_id := null;
    new.duplicada_de_protocolo := null;
    new.similaridade := round(score::numeric, 4);
    new.criterio_duplicidade := null;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_detectar_duplicidade_solicitacao on public.solicitacoes;
create trigger trg_detectar_duplicidade_solicitacao
before insert on public.solicitacoes
for each row
execute function public.detectar_duplicidade_solicitacao();

revoke execute on function public.detectar_duplicidade_solicitacao() from public, anon, authenticated;
