"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import Link from "next/link";
import {
  AttributionControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { CategoryIcon, IconArrowRight, IconLock } from "@/components/icons";
import { placeSlug } from "@/lib/slug";
import { MAPTILER_ATTRIBUTION, mapTilerUrl } from "@/lib/tiles";
import type { Place } from "@/data/places";

const pinIcon = (place: Place) =>
  L.divIcon({
    className: "",
    html: `<div class="place-pin place-pin-locked">${renderToStaticMarkup(
      <CategoryIcon id={place.category} size={20} />
    )}<span class="place-pin-lock">${renderToStaticMarkup(
      <IconLock size={10} />
    )}</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

function FocusPlace({ place }: { place: Place | null }) {
  const map = useMap();
  useEffect(() => {
    if (!place) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    map.flyTo([place.lat, place.lng], 13, { duration: reduced ? 0 : 0.8 });
  }, [place, map]);
  return null;
}

const providers = {
  maptiler: {
    url: mapTilerUrl() ?? "",
    attribution: MAPTILER_ATTRIBUTION,
    subdomains: [] as string[],
    maxZoom: 19,
  },
  hot: {
    url: "https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · стиль HOT',
    subdomains: ["a", "b", "c"],
    maxZoom: 19,
  },
  esri: {
    // порядок в URL именно {z}/{y}/{x}
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution:
      'Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: [] as string[],
    maxZoom: 16,
  },
};

// приоритет: maptiler (если есть ключ) → hot → esri
const fallbackOrder: Record<keyof typeof providers, keyof typeof providers> = {
  maptiler: "hot",
  hot: "esri",
  esri: "esri",
};

export default function SanyaMap({
  places,
  focus,
}: {
  places: Place[];
  focus: Place | null;
}) {
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const [provider, setProvider] = useState<keyof typeof providers>(
    mapTilerUrl() ? "maptiler" : "hot"
  );
  const tiles = providers[provider];

  useEffect(() => {
    if (!focus) return;
    const timer = setTimeout(
      () => markerRefs.current[focus.id]?.openPopup(),
      900
    );
    return () => clearTimeout(timer);
  }, [focus]);

  return (
    <MapContainer
      center={[18.26, 109.49]}
      zoom={12}
      scrollWheelZoom
      attributionControl={false}
      className="h-full w-full"
    >
      <AttributionControl prefix={false} position="bottomright" />
      <TileLayer
        key={provider}
        attribution={tiles.attribution}
        url={tiles.url}
        subdomains={tiles.subdomains}
        maxZoom={tiles.maxZoom}
        eventHandlers={{
          tileerror: () => {
            const next = fallbackOrder[provider];
            if (next !== provider) setProvider(next);
          },
        }}
      />
      {provider === "esri" && (
        <TileLayer
          attribution=""
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />
      )}
      <FocusPlace place={focus} />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={pinIcon(place)}
          ref={(m) => {
            if (m) markerRefs.current[place.id] = m;
          }}
        >
          <Popup>
            <div style={{ textAlign: "center", minWidth: 140 }}>
              <strong style={{ fontSize: 15 }}>{place.name}</strong>
              <div style={{ marginTop: 6 }}>
                <Link
                  href={`/place/${placeSlug(place)}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    minHeight: 44,
                    color: "#d63d7c",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  Подробнее
                  {renderToStaticMarkup(<IconArrowRight size={16} />)}
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
