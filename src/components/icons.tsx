import type { SVGProps } from "react";
import type { CategoryId } from "@/data/places";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const make = (children: React.ReactNode) => {
  function Icon({ size = 24, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {children}
      </svg>
    );
  }
  return Icon;
};

/* Категории мест */
export const IconBeach = make(
  <>
    <path d="M12 3a8 8 0 0 1 8 8H4a8 8 0 0 1 8-8Z" />
    <path d="M12 11v7" />
    <path d="M12 3c-2 2-2.5 5-1.5 8" />
    <path d="M12 3c2 2 2.5 5 1.5 8" />
    <path d="M4 21c2-1.5 4-1.5 6 0s4 1.5 6 0 3-1.2 4 0" />
  </>
);

export const IconIsland = make(
  <>
    <path d="M17 11c0-2-1.5-3.5-3.5-3.5S10 9 10 11" />
    <path d="M13.5 7.5 15 4c1.5 0 2.5.5 3 1.5-.8.5-1.6.7-2.5.5" />
    <path d="M13.5 7.5C13 5 12 4 10.5 4c-.5 1.5 0 2.5 1 3.5" />
    <path d="M13.5 7.5C14 9 14.5 10.5 15 13" />
    <path d="M4 17c2-2.5 5-4 8-4s6 1.5 8 4" />
    <path d="M3 20c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
  </>
);

export const IconTemple = make(
  <>
    <path d="M3 9c3-2 6-3 9-3s6 1 9 3" />
    <path d="M5 9v3h14V9" />
    <path d="M6 15c2-1.5 4-2 6-2s4 .5 6 2" />
    <path d="M8 15v5h8v-5" />
    <path d="M12 13v7" />
  </>
);

export const IconLeaf = make(
  <>
    <path d="M5 19C5 9 12 4 20 4c0 8-5 15-15 15Z" />
    <path d="M5 19c3-6 7-10 12-12" />
  </>
);

export const IconShopping = make(
  <>
    <path d="M6 8h12l-1 12H7L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </>
);

export const IconFood = make(
  <>
    <path d="M4 12h16a8 8 0 0 1-16 0Z" />
    <path d="M8 12 6 4" />
    <path d="M12 12 12 3" />
    <path d="M8 20h8" />
  </>
);

export const IconWave = make(
  <>
    <path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M3 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  </>
);

export const IconSpa = make(
  <>
    <path d="M4 14h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z" />
    <path d="M8 10c0-1.5 1.5-1.5 1.5-3S8 5.5 8 4" />
    <path d="M12.5 10c0-1.5 1.5-1.5 1.5-3s-1.5-1.5-1.5-3" />
    <path d="M17 10c0-1.5 1.5-1.5 1.5-3S17 5.5 17 4" />
  </>
);

export const IconHotel = make(
  <>
    <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    <path d="M16 9h4v12" />
    <path d="M2 21h20" />
    <path d="M8 7h2M8 11h2M8 15h2M12 7h1M12 11h1M12 15h1" />
  </>
);

/* UI */
export const IconLock = make(
  <>
    <rect x="5" y="11" width="14" height="9" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    <path d="M12 14.5v2" />
  </>
);

export const IconGift = make(
  <>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M4 14h16" />
    <path d="M12 10v10" />
    <path d="M12 10c-4 0-5-1.5-5-3s2-2.5 3-1 2 4 2 4Z" />
    <path d="M12 10c4 0 5-1.5 5-3s-2-2.5-3-1-2 4-2 4Z" />
  </>
);

export const IconMap = make(
  <>
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
    <path d="M9 4v14" />
    <path d="M15 6v14" />
  </>
);

export const IconPhone = make(
  <>
    <rect x="7" y="3" width="10" height="18" rx="2.5" />
    <path d="M11 17.5h2" />
  </>
);

export const IconPin = make(
  <>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </>
);

export const IconChecklist = make(
  <>
    <rect x="5" y="4" width="14" height="17" rx="2.5" />
    <path d="M9 4a3 3 0 0 1 6 0" />
    <path d="m8.5 12 2.3 2.3L15.5 9.5" />
    <path d="M9 17h6" />
  </>
);

export const IconPalm = make(
  <>
    <path d="M12 21c0-6 .5-10 2-13" />
    <path d="M14 8c-3-1-6 0-8 3 3 .5 6 0 8-3Z" />
    <path d="M14 8c1-3 4-4.5 7-4-.5 3-3 4.5-7 4Z" />
    <path d="M14 8c-1.5-2.5-4-3.5-6.5-3 .5 2.5 3 3.5 6.5 3Z" />
    <path d="M14 8c2.5-1.5 5-1 6.5 1-2 1.5-4.5 1-6.5-1Z" />
    <path d="M8 21h8" />
  </>
);

export const IconPlane = make(
  <>
    <path d="M10.5 13.5 3 11l1.5-1.5L10 10l4-6c.8-1 2-1.3 2.8-.6.7.7.5 1.9-.3 2.7l-4 5.4.7 5.5-1.7 1.5-2.5-6Z" />
    <path d="m10.5 13.5 6-6" />
  </>
);

export const IconSun = make(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19" />
  </>
);

export const IconShell = make(
  <>
    <path d="M12 20c-5 0-8-3-8-7a8 8 0 0 1 16 0c0 4-3 7-8 7Z" />
    <path d="M12 20V5" />
    <path d="M12 20 6.5 6.5M12 20l5.5-13.5" />
    <path d="M8 20h8" />
  </>
);

export const IconFlower = make(
  <>
    <circle cx="12" cy="8" r="2.5" />
    <circle cx="16.2" cy="12.5" r="2.5" />
    <circle cx="14" cy="17.5" r="2.5" />
    <circle cx="10" cy="17.5" r="2.5" />
    <circle cx="7.8" cy="12.5" r="2.5" />
    <circle cx="12" cy="12.7" r="1.6" />
  </>
);

export const IconCamera = make(
  <>
    <path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="14" r="3.2" />
  </>
);

export const IconCity = make(
  <>
    <path d="M3 21V9l5-3v15" />
    <path d="M8 21V4l7 3v14" />
    <path d="M15 21V10l6 2v9" />
    <path d="M2 21h20" />
    <path d="M11 9h1.5M11 13h1.5M11 17h1.5M5 12h1M5 16h1" />
  </>
);

export const IconCrown = make(
  <>
    <path d="m4 17-1.5-8L8 12l4-7 4 7 5.5-3L20 17H4Z" />
    <path d="M5 20h14" />
  </>
);

export const IconPencil = make(
  <>
    <path d="m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z" />
    <path d="m12.5 7.5 4 4" />
  </>
);

export const IconTrash = make(
  <>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    <path d="M10 11v6M14 11v6" />
  </>
);

export const IconSparkles = make(
  <>
    <path d="M12 3c.7 3.5 2 5.5 5 6-3 .5-4.3 2.5-5 6-.7-3.5-2-5.5-5-6 3-.5 4.3-2.5 5-6Z" />
    <path d="M19 13c.4 2 1.2 3 3 3.5-1.8.5-2.6 1.5-3 3.5-.4-2-1.2-3-3-3.5 1.8-.5 2.6-1.5 3-3.5Z" />
  </>
);

export const IconMail = make(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </>
);

export const IconHeart = make(
  <>
    <path d="M12 20s-7.5-4.7-9-9.5C2 7 4 4.5 7 4.5c2 0 3.7 1.2 5 3 1.3-1.8 3-3 5-3 3 0 5 2.5 4 6-1.5 4.8-9 9.5-9 9.5Z" />
  </>
);

export const IconCopy = make(
  <>
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>
);

export const IconCheck = make(<path d="m5 12.5 4.5 4.5L19 7.5" />);

export const IconArrowRight = make(
  <>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </>
);

export const IconArrowLeft = make(
  <>
    <path d="M20 12H5" />
    <path d="m11 6-6 6 6 6" />
  </>
);

export const IconClose = make(<path d="m6 6 12 12M18 6 6 18" />);

export const IconTicket = make(
  <>
    <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
    <path d="M14 6v2.5" />
    <path d="M14 11v2.5" />
    <path d="M14 16v2" />
  </>
);

/* Иконка категории по id */
const categoryIcons: Record<CategoryId, (props: IconProps) => React.ReactNode> =
  {
    beaches: IconBeach,
    sights: IconTemple,
    food: IconFood,
    shopping: IconShopping,
    spa: IconSpa,
    entertainment: IconTicket,
    parks: IconLeaf,
  };

export function CategoryIcon({
  id,
  ...props
}: IconProps & { id: CategoryId }) {
  const Icon = categoryIcons[id] ?? IconPin;
  return <Icon {...props} />;
}
