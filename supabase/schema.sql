-- Jalankan SEKALI di Supabase Dashboard > SQL Editor > New query > Run
-- Proyek: https://pwozdanmbcfslefkdlpa.supabase.co

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  institution text default '',
  city text default '',
  provider text default 'email',
  created_at timestamptz not null default now()
);

create table if not exists public.login_events (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text, email text, provider text,
  is_register boolean default false,
  at timestamptz not null default now()
);

create table if not exists public.results (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text, email text,
  type text not null check (type in ('pretest','posttest')),
  score int not null, total int not null default 40,
  answers jsonb default '{}'::jsonb,
  at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.login_events enable row level security;
alter table public.results enable row level security;

drop policy if exists "profil sendiri" on public.profiles;
create policy "profil sendiri" on public.profiles for select using (auth.uid() = id);
drop policy if exists "login sendiri" on public.login_events;
create policy "login sendiri" on public.login_events for insert with check (auth.uid() = user_id);
drop policy if exists "hasil sendiri baca" on public.results;
create policy "hasil sendiri baca" on public.results for select using (auth.uid() = user_id);
drop policy if exists "hasil sendiri tulis" on public.results;
create policy "hasil sendiri tulis" on public.results for insert with check (auth.uid() = user_id);

-- Profil otomatis dibuat saat akun baru (email maupun Google)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, institution, city, provider)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(new.email,''),
    coalesce(new.raw_user_meta_data->>'institution',''),
    coalesce(new.raw_user_meta_data->>'city',''),
    coalesce(new.raw_app_meta_data->>'provider','email')
  ) on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Laporan untuk peneliti (dilindungi password admin).
-- GANTI 'karanggigi2025' jika ingin password lain.
create or replace function public.admin_report(p_password text) returns json
language plpgsql security definer set search_path = public as $$
begin
  if p_password is distinct from 'karanggigi2025' then
    raise exception 'Password admin salah.';
  end if;
  return json_build_object(
    'rows', coalesce((
      select json_agg(x order by x."lastLogin" desc nulls last) from (
        select p.id, p.name, p.email, p.institution, p.city, p.provider,
          p.created_at as "registeredAt",
          (select count(*) from login_events l where l.user_id = p.id) as "loginCount",
          (select max(at) from login_events l where l.user_id = p.id) as "lastLogin",
          (select json_build_object('score', r.score, 'total', r.total, 'at', r.at) from results r
             where r.user_id = p.id and r.type = 'pretest' order by r.at asc limit 1) as pretest,
          (select json_build_object('score', r.score, 'total', r.total, 'at', r.at) from results r
             where r.user_id = p.id and r.type = 'posttest' order by r.at desc limit 1) as posttest,
          (select count(*) from results r where r.user_id = p.id and r.type = 'posttest') as "posttestAttempts"
        from profiles p
      ) x), '[]'::json),
    'loginLog', coalesce((
      select json_agg(y) from (
        select name, email, at, provider, is_register as "isRegister"
        from login_events order by at desc limit 300
      ) y), '[]'::json)
  );
end $$;

grant execute on function public.admin_report(text) to anon, authenticated;

-- ─── KOMENTAR (terlihat oleh semua pengunjung) ──────────────────────────────
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar text default '😊',
  message text not null,
  category text default 'Pengalaman',
  likes int not null default 0,
  replies jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.comments enable row level security;
drop policy if exists "komentar dibaca semua" on public.comments;
create policy "komentar dibaca semua" on public.comments for select using (true);
drop policy if exists "komentar ditulis semua" on public.comments;
create policy "komentar ditulis semua" on public.comments for insert
  with check (length(trim(name)) > 0 and length(trim(message)) > 0 and likes = 0);

create or replace function public.like_comment(p_id uuid, p_delta int) returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update comments set likes = greatest(0, likes + (case when p_delta < 0 then -1 else 1 end))
  where id = p_id returning likes into n;
  return n;
end $$;

create or replace function public.reply_comment(p_id uuid, p_name text, p_message text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare r jsonb;
begin
  if length(trim(coalesce(p_name,''))) = 0 or length(trim(coalesce(p_message,''))) = 0 then
    raise exception 'Nama dan balasan wajib diisi.';
  end if;
  r := jsonb_build_object('id', gen_random_uuid()::text, 'name', trim(p_name), 'message', trim(p_message), 'createdAt', now());
  update comments set replies = replies || jsonb_build_array(r) where id = p_id;
  return r;
end $$;

create or replace function public.delete_comment(p_id uuid, p_password text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_password is distinct from 'karanggigi2025' then raise exception 'Password admin salah.'; end if;
  delete from comments where id = p_id;
end $$;

grant execute on function public.like_comment(uuid,int), public.reply_comment(uuid,text,text), public.delete_comment(uuid,text) to anon, authenticated;
