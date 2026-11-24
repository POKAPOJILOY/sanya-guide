-- 007_food_subcategories_and_category_rename
-- Новый набор категорий: удалены islands/nature/activities,
-- добавлены entertainment/parks; у food появились подкатегории.

alter table public.places
  add column if not exists subcategory text;

-- ремап убранных категорий в новые
update public.places set category = 'beaches' where category = 'islands';
update public.places set category = 'parks' where category = 'nature';
update public.places set category = 'entertainment' where category = 'activities';

-- первая подкатегория: Первый рынок (Дицы) → Рынки
update public.places set subcategory = 'markets'
  where category = 'food' and (name ilike '%Дицы%' or name ilike '%рынок%');

-- витрина с подкатегорией (форма наследует 004)
drop view public.public_places;
create view public.public_places as
  select id, city_id, slug, category, subcategory, name, name_zh, photo_url,
         lat, lng, is_free, emoji, short_description, sort, created_at
  from public.places;

grant select on public.public_places to anon, authenticated;
grant all on public.places to service_role;
