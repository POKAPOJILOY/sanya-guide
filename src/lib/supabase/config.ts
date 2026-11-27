// Публичные параметры подключения к Supabase.
// URL и anon key не являются секретом: они всё равно уходят в браузер,
// а доступ к данным ограничен Row Level Security на стороне Supabase.
// При желании их можно переопределить переменными окружения
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://pkervhbuflbupkaxshzj.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZXJ2aGJ1ZmxidXBrYXhzaHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzNjE2NDgsImV4cCI6MjExMDkzNzY0OH0.dexhhFbdykzSiZy8Aj0HXSQ7oEggoUf96ij3nflPan4";
