"use client";

import dynamic from "next/dynamic";

const CoordsMapInner = dynamic(() => import("./CoordsMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-blush/40 text-sm text-muted">
      Загружаю карту…
    </div>
  ),
});

export default function CoordsMap({ lat, lng }: { lat?: number; lng?: number }) {
  return <CoordsMapInner lat={lat} lng={lng} />;
}
