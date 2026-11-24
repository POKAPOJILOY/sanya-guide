-- 001_init: profiles, cities, places, lessons, checklists, purchases + RLS

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  role text not null default 'user' check (role in ('user', 'admin')),
  session_id text,
  created_at timestamptz default now()
);

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  emoji text default '🏙️',
  status text not null default 'coming_soon' check (status in ('active', 'coming_soon', 'draft')),
  sort int default 0,
  created_at timestamptz default now()
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  category text not null,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  is_free boolean not null default false,
  emoji text not null default '📍',
  short_description text not null default '',
  full_description text not null default '',
  sort int default 0,
  created_at timestamptz default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  title text not null,
  content text not null default '',
  is_free boolean not null default false,
  sort int default 0,
  created_at timestamptz default now()
);

create table public.checklists (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  title text not null,
  items jsonb not null default '[]',
  is_free boolean not null default false,
  sort int default 0,
  created_at timestamptz default now()
);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  city_id uuid references public.cities(id),
  amount int not null,
  currency text not null default 'RUB',
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'canceled', 'refunded')),
  yookassa_payment_id text unique,
  created_at timestamptz default now()
);

-- новый пользователь → профиль (ник из метаданных регистрации)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, new.raw_user_meta_data ->> 'nickname');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- security definer, чтобы не было рекурсии RLS по profiles
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- есть ли у пользователя оплаченный доступ к городу (city_id null = все города)
create or replace function public.has_city_access(cid uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.purchases
    where user_id = auth.uid()
      and status = 'succeeded'
      and (city_id is null or city_id = cid)
  );
$$;

-- нельзя самому себе поменять роль
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.is_admin() and new.role is distinct from old.role then
    raise exception 'role change is not allowed';
  end if;
  return new;
end;
$$;

create trigger protect_profile_role_trigger
  before update on public.profiles
  for each row execute function public.protect_profile_role();

alter table public.profiles enable row level security;
alter table public.cities enable row level security;
alter table public.places enable row level security;
alter table public.lessons enable row level security;
alter table public.checklists enable row level security;
alter table public.purchases enable row level security;

-- profiles: своя строка, админу — всё
create policy profiles_select on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy profiles_update on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- cities: публично видны все, кроме draft
create policy cities_select on public.cities
  for select using (status != 'draft' or public.is_admin());

-- places/lessons/checklists: бесплатные строки всем, платные — админу и покупателям.
-- Аноним работает через VIEW ниже (без full_description/content).
create policy places_select on public.places
  for select using (
    is_free or public.is_admin() or public.has_city_access(city_id)
  );

create policy lessons_select on public.lessons
  for select using (
    is_free or public.is_admin() or public.has_city_access(city_id)
  );

create policy checklists_select on public.checklists
  for select using (
    is_free or public.is_admin() or public.has_city_access(city_id)
  );

-- purchases: пользователь видит свои; запись — только service role (байпасит RLS)
create policy purchases_select on public.purchases
  for select using (auth.uid() = user_id or public.is_admin());

-- Публичные витрины без платного контента.
-- Вьюхи выполняются от владельца (postgres, байпасит RLS) и отдают
-- тизерные поля всех строк — именно это нужно анониму для LockedCard.
create view public.public_places as
  select id, city_id, category, name, lat, lng, is_free, emoji,
         short_description, sort, created_at
  from public.places;

create view public.public_lessons as
  select id, city_id, title, is_free, sort, created_at
  from public.lessons;

grant select on public.public_places to anon, authenticated;
grant select on public.public_lessons to anon, authenticated;

-- grants для анонимного чтения витрин и городов
grant select on public.cities to anon, authenticated;
grant select on public.profiles to authenticated;
