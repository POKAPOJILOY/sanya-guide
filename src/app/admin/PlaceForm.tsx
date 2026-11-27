import Button from "@/components/ui/Button";
import { categories, FOOD_SUBCATEGORIES } from "@/data/places";
import { addPlace, updatePlace } from "./actions";
import CoordsMap from "./CoordsMap";
import PhotoUrlInput from "./PhotoUrlInput";

type PlaceRow = {
  id: string;
  category: string;
  name: string;
  name_zh?: string;
  lat: number;
  lng: number;
  is_free: boolean;
  subcategory?: string | null;
  short_description: string;
  full_description: string;
  getting_there?: string;
  prices?: string;
  photo_url?: string;
  sort: number;
};

const inputClass =
  "w-full rounded-2xl border-2 border-pastel bg-card px-4 py-2.5 text-sm font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-muted focus:border-accent";

export default function PlaceForm({
  cityId,
  place,
}: {
  cityId?: string;
  place?: PlaceRow;
}) {
  const action = place ? updatePlace : addPlace;

  return (
    <form
      action={action}
      className="space-y-3 rounded-card border border-blush bg-card p-6 shadow-soft"
    >
      {place && <input type="hidden" name="id" value={place.id} />}
      {cityId && <input type="hidden" name="city_id" value={cityId} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold">Название</label>
          <input
            name="name"
            required
            defaultValue={place?.name}
            placeholder="Пляж Дадунхай"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Название на китайском (для карточки таксисту)
          </label>
          <input
            name="name_zh"
            defaultValue={place?.name_zh}
            placeholder="大东海"
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-semibold">Категория</label>
          <select
            name="category"
            defaultValue={place?.category ?? categories[0].id}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">lat</label>
          <input
            name="lat"
            required
            defaultValue={place?.lat ?? 18.2528}
            placeholder="18.2528"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">lng</label>
          <input
            name="lng"
            required
            defaultValue={place?.lng ?? 109.5119}
            placeholder="109.5119"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">
          Подкатегория (для еды)
        </label>
        <select
          name="subcategory"
          defaultValue={place?.subcategory ?? ""}
          className={`${inputClass} sm:max-w-xs`}
        >
          <option value="">—</option>
          {FOOD_SUBCATEGORIES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="mb-1 text-sm font-semibold">
          Или ткни в карту / перетащи пин — координаты подставятся сами
        </p>
        <div className="h-[220px] overflow-hidden rounded-2xl border border-blush">
          <CoordsMap lat={place?.lat ?? 18.2528} lng={place?.lng ?? 109.5119} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">
          Короткое описание (видно всем)
        </label>
        <input
          name="short_description"
          defaultValue={place?.short_description}
          placeholder="Пара фраз-тизер для карточки"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">
          Полное описание (только платникам)
        </label>
        <textarea
          name="full_description"
          rows={4}
          defaultValue={place?.full_description}
          placeholder="Все секреты места — как подруге"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">
          Как добраться (только платникам)
        </label>
        <textarea
          name="getting_there"
          rows={3}
          defaultValue={place?.getting_there}
          placeholder="На такси 20 минут от Дадунхая, автобус 25 до остановки…"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">
          Цены (только платникам)
        </label>
        <textarea
          name="prices"
          rows={3}
          defaultValue={place?.prices}
          placeholder="Вход 129 юаней, онлайн со скидкой 98…"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">
          Фото (обложка страницы места)
        </label>
        <PhotoUrlInput defaultValue={place?.photo_url} className={inputClass} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="is_free"
            defaultChecked={place?.is_free}
            className="h-5 w-5 accent-accent"
          />
          Бесплатное место
        </label>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">Сортировка</label>
          <input
            name="sort"
            type="number"
            defaultValue={place?.sort ?? 0}
            className={`${inputClass} w-24`}
          />
        </div>
        <div className="ml-auto">
          <Button type="submit" size="sm">
            {place ? "Сохранить" : "Добавить место"}
          </Button>
        </div>
      </div>
    </form>
  );
}
