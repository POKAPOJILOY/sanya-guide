-- 003_place_slug: человекочитаемые slug для страниц мест.
-- Пока миграция не применена, приложение генерирует slug на лету
-- (транслит имени, см. src/lib/slug.ts) — после применения колонка
-- становится источником slug, а имена можно будет править свободно.

alter table public.places add column if not exists slug text;

-- имена на русском, автогенерация из name даёт мусор — используем id
update public.places set slug = id::text where slug is null;

create unique index if not exists places_slug_uidx on public.places(slug);

-- slug в публичную витрину (поле не секретное)
drop view public.public_places;
create view public.public_places as
  select id, city_id, slug, category, name, lat, lng, is_free, emoji,
         short_description, sort, created_at
  from public.places;

grant select on public.public_places to anon, authenticated;
