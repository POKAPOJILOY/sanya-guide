"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import {
  AttributionControl,
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { IconPin } from "@/components/icons";
import { MAPTILER_ATTRIBUTION, mapTilerUrl } from "@/lib/tiles";

const HOT_URL = "https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png";

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="color:#d63d7c;filter:drop-shadow(0 1px 2px rgb(0 0 0 / 0.3))">${renderToStaticMarkup(
    <IconPin size={32} />
  )}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const parseNum = (v?: string) => Number(String(v ?? "").replace(",", "."));

function readInputs(): [number, number] | null {
  const lat = parseNum(
    document.querySelector<HTMLInputElement>('input[name="lat"]')?.value
  );
  const lng = parseNum(
    document.querySelector<HTMLInputElement>('input[name="lng"]')?.value
  );
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return [lat, lng];
}

function writeInputs(lat: number, lng: number) {
  const latInput = document.querySelector<HTMLInputElement>('input[name="lat"]');
  const lngInput = document.querySelector<HTMLInputElement>('input[name="lng"]');
  if (latInput) latInput.value = String(lat.toFixed(6));
  if (lngInput) lngInput.value = String(lng.toFixed(6));
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => onPick(e.latlng.lat, e.latlng.lng),
  });
  return null;
}

export default function CoordsMapInner({
  lat,
  lng,
}: {
  lat?: number;
  lng?: number;
}) {
  const valid =
    typeof lat === "number" &&
    typeof lng === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng);
  const [pos, setPos] = useState<[number, number] | null>(
    valid ? [lat, lng] : null
  );
  const [tiles, setTiles] = useState<"maptiler" | "hot">(
    mapTilerUrl() ? "maptiler" : "hot"
  );

  const pick = (la: number, ln: number) => {
    setPos([la, ln]);
    writeInputs(la, ln);
  };

  // ручной ввод координат двигает маркер
  useEffect(() => {
    const sync = () => {
      const next = readInputs();
      if (next) setPos(next);
    };
    const latInput = document.querySelector('input[name="lat"]');
    const lngInput = document.querySelector('input[name="lng"]');
    latInput?.addEventListener("input", sync);
    lngInput?.addEventListener("input", sync);
    return () => {
      latInput?.removeEventListener("input", sync);
      lngInput?.removeEventListener("input", sync);
    };
  }, []);

  return (
    <MapContainer
      center={pos ?? [18.26, 109.49]}
      zoom={11}
      scrollWheelZoom
      attributionControl={false}
      className="h-full w-full"
    >
      <AttributionControl prefix={false} position="bottomright" />
      <TileLayer
        key={tiles}
        attribution={
          tiles === "maptiler"
            ? MAPTILER_ATTRIBUTION
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · стиль HOT'
        }
        url={tiles === "maptiler" ? (mapTilerUrl() ?? HOT_URL) : HOT_URL}
        subdomains={tiles === "maptiler" ? [] : ["a", "b", "c"]}
        maxZoom={19}
        eventHandlers={{
          tileerror: () => {
            if (tiles === "maptiler") setTiles("hot");
          },
        }}
      />
      <ClickHandler onPick={pick} />
      {pos && (
        <Marker
          position={pos}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const ll = (e.target as L.Marker).getLatLng();
              pick(ll.lat, ll.lng);
            },
          }}
        />
      )}
    </MapContainer>
  );
}
