-- 006_service_role_grants: таблицы созданы через SQL Editor (роль postgres),
-- поэтому service_role не получил дефолтные привилегии Supabase — INSERT падал с 42501.
-- Явно выдаём service_role полные права (RLS он байпасит по умолчанию).
grant all on public.places to service_role;
grant all on public.cities to service_role;
grant all on public.lessons to service_role;
grant all on public.checklists to service_role;
grant all on public.purchases to service_role;
grant all on public.profiles to service_role;
