-- 005_grants: явные гранты PostgREST-ролям на таблицы.
-- Без них anon/authenticated получают 42501 permission denied даже при
-- правильных RLS-политиках (RLS фильтрует строки ПОВЕРХ грантов).
-- Грант ≠ доступ к данным: платные строки по-прежнему отрезает RLS.

grant select on public.places to anon, authenticated;
grant select on public.cities to anon, authenticated;
grant select on public.lessons to anon, authenticated;
grant select on public.checklists to anon, authenticated;
grant select on public.purchases to anon, authenticated;

-- пользователь читает/обновляет СВОЙ профиль (session_id для одной сессии);
-- строки режет RLS profiles_select/profiles_update
grant select, update on public.profiles to authenticated;
