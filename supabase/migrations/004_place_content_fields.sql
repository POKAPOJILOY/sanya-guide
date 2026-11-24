-- 004_place_content_fields: контентные поля места для страницы /place/[slug]
-- name_zh — фраза для таксиста, photo_url — обложка галереи (не секретные,
-- поэтому в публичную витрину). getting_there/prices — платный контент,
-- читаются из places под тем же RLS, что и full_description.

alter table public.places
  add column if not exists name_zh text not null default '',
  add column if not exists getting_there text not null default '',
  add column if not exists prices text not null default '',
  add column if not exists photo_url text not null default '';

-- форма view наследует 003 (с slug) + новые публичные поля
drop view public.public_places;
create view public.public_places as
  select id, city_id, slug, category, name, name_zh, photo_url, lat, lng,
         is_free, emoji, short_description, sort, created_at
  from public.places;

grant select on public.public_places to anon, authenticated;
