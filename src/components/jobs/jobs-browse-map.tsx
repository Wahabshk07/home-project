"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

import type { JobMapMarker } from "@/lib/api/public-api";
import { US_STATE_CENTER } from "@/lib/us-states";

import "leaflet/dist/leaflet.css";

type Props = {
  markers: JobMapMarker[];
};

export default function JobsBrowseMap({ markers }: Props) {
  const positioned = useMemo(() => {
    const out: Array<JobMapMarker & { lat: number; lng: number }> = [];
    let i = 0;
    for (const m of markers) {
      const code = m.stateCode?.trim().toUpperCase();
      const center = code ? US_STATE_CENTER[code] : undefined;
      if (!center) continue;
      const jitter = ((i++ % 7) - 3) * 0.04;
      out.push({
        ...m,
        lat: center[0] + jitter,
        lng: center[1] + jitter * 1.2,
      });
    }
    return out;
  }, [markers]);

  if (positioned.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-2xl border border-gray-100 bg-slate-50 px-4 text-center text-sm text-slate-500">
        Job pins appear when postings include a US state. Employers pick state when posting.
      </div>
    );
  }

  return (
    <div className="h-[min(52vh,420px)] w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm [&_.leaflet-container]:z-0 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        scrollWheelZoom={false}
        className="h-full min-h-[280px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positioned.map((m) => (
          <CircleMarker
            key={m.slug}
            center={[m.lat, m.lng]}
            radius={8}
            pathOptions={{
              color: "#dc2626",
              fillColor: "#fecaca",
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <div className="max-w-[220px]">
                <p className="font-bold text-slate-900">{m.title}</p>
                <p className="text-xs text-slate-500">
                  {m.location ?? m.stateCode ?? ""}
                </p>
                <Link
                  href={`/jobs/${encodeURIComponent(m.slug)}`}
                  className="mt-2 inline-block text-xs font-bold text-red-600"
                >
                  View job
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
