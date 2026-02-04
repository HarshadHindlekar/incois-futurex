"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import maplibregl from "maplibre-gl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Layers, ZoomIn, ZoomOut, Maximize, RotateCcw, Mountain, Compass } from "lucide-react";
import { SECTOR_COORDINATES } from "@/lib/api/config";
import type { PFZAdvisory, Sector } from "@/lib/types";

interface MapContainerProps {
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  pfzData?: PFZAdvisory[];
  onSectorSelect?: (sector: Sector) => void;
  className?: string;
}

const DEFAULT_CENTER = { lat: 15.0, lng: 78.0 };
const DEFAULT_ZOOM = 5;

export function MapContainer({
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM,
  pfzData = [],
  onSectorSelect,
  className,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const t = useTranslations();
  const [mapReady, setMapReady] = useState(false);
  const [is3D, setIs3D] = useState(true);
  const [pitch, setPitch] = useState(50);
  const [showPFZ, setShowPFZ] = useState(true);

  const PFZ_SOURCE_ID = "pfz-zones";
  const PFZ_LAYER_ID = "pfz-zones-layer";

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [initialCenter.lng, initialCenter.lat],
      zoom: initialZoom,
      pitch: is3D ? pitch : 0,
      bearing: 0,
      maxPitch: 85,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      "bottom-right"
    );

    map.current.on("load", () => {
      popupRef.current = new maplibregl.Popup({
        offset: 18,
        closeButton: true,
        closeOnClick: true,
        className: "pfz-popup",
      });

      // Native (3D-friendly) PFZ source + layer
      map.current?.addSource(PFZ_SOURCE_ID, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.current?.addLayer({
        id: PFZ_LAYER_ID,
        type: "circle",
        source: PFZ_SOURCE_ID,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 5, 8, 8, 12, 11],
          "circle-color": "#00a3ff",
          "circle-opacity": 0.95,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-blur": 0.15,
        },
      });

      map.current?.on("mouseenter", PFZ_LAYER_ID, () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current?.on("mouseleave", PFZ_LAYER_ID, () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "";
        popupRef.current?.remove();
      });

      map.current?.on("mousemove", PFZ_LAYER_ID, (e) => {
        const popup = popupRef.current;
        if (!popup || !map.current) return;
        const f = e.features?.[0];
        if (!f) return;

        const p = (f.properties ?? {}) as Record<string, unknown>;
        const html = `
          <div style="padding: 12px; min-width: 180px; font-family: system-ui;">
            <h3 style="font-weight: 600; margin: 0 0 8px 0; color: #0066cc; font-size: 14px;">
              🐟 PFZ Zone
            </h3>
            <div style="font-size: 12px; color: #374151;">
              <p style="margin: 4px 0;"><strong>Sector:</strong> ${String(p.sector ?? "")}</p>
              <p style="margin: 4px 0;"><strong>SST:</strong> ${Number(p.sst ?? 0).toFixed(1)}°C</p>
              <p style="margin: 4px 0;"><strong>Depth:</strong> ${Number(p.depth ?? 0)}m</p>
              <p style="margin: 4px 0;"><strong>Species:</strong> ${String(p.species ?? "")}</p>
            </div>
          </div>
        `;

        if (e.lngLat) {
          popup.remove();
          popup.setLngLat(e.lngLat).setHTML(html).addTo(map.current);
        }
      });

      map.current?.on("click", PFZ_LAYER_ID, (e) => {
        // Same as hover but click keeps popup visible (no map movement)
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();

        const popup = popupRef.current;
        if (!popup || !map.current) return;
        const f = e.features?.[0];
        if (!f) return;

        const p = (f.properties ?? {}) as Record<string, unknown>;
        const html = `
          <div style="padding: 12px; min-width: 180px; font-family: system-ui;">
            <h3 style="font-weight: 600; margin: 0 0 8px 0; color: #0066cc; font-size: 14px;">
              🐟 PFZ Zone
            </h3>
            <div style="font-size: 12px; color: #374151;">
              <p style="margin: 4px 0;"><strong>Sector:</strong> ${String(p.sector ?? "")}</p>
              <p style="margin: 4px 0;"><strong>SST:</strong> ${Number(p.sst ?? 0).toFixed(1)}°C</p>
              <p style="margin: 4px 0;"><strong>Depth:</strong> ${Number(p.depth ?? 0)}m</p>
              <p style="margin: 4px 0;"><strong>Species:</strong> ${String(p.species ?? "")}</p>
            </div>
          </div>
        `;

        if (e.lngLat) {
          popup.remove();
          popup.setLngLat(e.lngLat).setHTML(html).addTo(map.current);
        }
      });

      setMapReady(true);
    });

    return () => {
      popupRef.current?.remove();
      popupRef.current = null;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add/update PFZ source data
  useEffect(() => {
    if (!map.current || !mapReady) return;

    const src = map.current.getSource(PFZ_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!src) return;

    const features: GeoJSON.Feature<GeoJSON.Point, Record<string, unknown>>[] = [];
    if (showPFZ) {
      pfzData.forEach((advisory) => {
        advisory.zones.forEach((zone) => {
          features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [zone.coordinates.longitude, zone.coordinates.latitude],
            },
            properties: {
              sector: advisory.sector.replace(/_/g, " "),
              sst: zone.sst ?? 0,
              depth: zone.depth ?? 0,
              species: advisory.fishSpecies
                .slice(0, 3)
                .map((s) => s.name)
                .join(", "),
            },
          });
        });
      });
    }

    src.setData({
      type: "FeatureCollection",
      features,
    });

    map.current.setLayoutProperty(PFZ_LAYER_ID, "visibility", showPFZ ? "visible" : "none");
    if (!showPFZ) popupRef.current?.remove();
  }, [PFZ_LAYER_ID, PFZ_SOURCE_ID, mapReady, pfzData, showPFZ]);

  // Update pitch/3D mode
  useEffect(() => {
    if (!map.current) return;
    map.current.easeTo({ pitch: is3D ? pitch : 0, duration: 300 });
  }, [is3D, pitch]);

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();

  const handleResetView = () => {
    map.current?.easeTo({
      center: [initialCenter.lng, initialCenter.lat],
      zoom: initialZoom,
      pitch: is3D ? 50 : 0,
      bearing: 0,
      duration: 800,
    });
  };

  const handleRotate = () => {
    if (!map.current) return;
    map.current.easeTo({ bearing: map.current.getBearing() + 45, duration: 300 });
  };

  const handleFullscreen = () => {
    if (mapContainer.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapContainer.current.requestFullscreen();
      }
    }
  };

  const goToSector = (sector: Sector) => {
    const coords = SECTOR_COORDINATES[sector];
    if (coords && map.current) {
      map.current.easeTo({
        center: [coords.lng, coords.lat],
        zoom: coords.zoom,
        duration: 800,
      });
      onSectorSelect?.(sector);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: "100%", height: "100%" }}>
      {/* MapLibre GL Container */}
      <div
        ref={mapContainer}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Controls */}
      <div className="absolute left-4 top-4 z-10 space-y-2">
        {/* Layers */}
        <Card className="p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Layers className="h-4 w-4" />
            {t("map.layers")}
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="pfz-toggle" className="text-xs">{t("map.pfzLayer")}</Label>
            <Switch id="pfz-toggle" checked={showPFZ} onCheckedChange={setShowPFZ} />
          </div>
        </Card>

        {/* 3D Controls */}
        <Card className="p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Mountain className="h-4 w-4" />
            {t("map.threeDView")}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="3d-toggle" className="text-xs">{t("map.enable3D")}</Label>
              <Switch id="3d-toggle" checked={is3D} onCheckedChange={setIs3D} />
            </div>
            {is3D && (
              <div>
                <Label className="text-xs text-muted-foreground">
                  {t("map.tilt")}: {pitch}°
                </Label>
                <input
                  type="range"
                  min="0"
                  max="85"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Zoom/View Controls */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1">
        <Button variant="secondary" size="icon" onClick={handleZoomIn} title={t("map.zoomIn")}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut} title={t("map.zoomOut")}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleRotate} title={t("map.rotate")}>
          <Compass className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleResetView} title={t("map.resetView")}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleFullscreen} title={t("map.fullscreen")}>
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Nav */}
      <div className="absolute right-4 top-4 z-10">
        <Card className="max-h-48 overflow-auto p-2">
          <div className="mb-1 text-xs font-medium text-muted-foreground">{t("map.quickNav")}</div>
          <div className="grid grid-cols-2 gap-1">
            {Object.keys(SECTOR_COORDINATES).slice(0, 8).map((sector) => (
              <Button
                key={sector}
                variant="ghost"
                size="sm"
                className="h-7 justify-start px-2 text-xs"
                onClick={() => goToSector(sector as Sector)}
              >
                {sector.slice(0, 3)}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
