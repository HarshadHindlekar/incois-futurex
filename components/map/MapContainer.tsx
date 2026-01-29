"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [is3D, setIs3D] = useState(true);
  const [pitch, setPitch] = useState(50);
  const [showPFZ, setShowPFZ] = useState(true);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
        },
        layers: [
          {
            id: "base-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
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
      setMapReady(true);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add/update PFZ markers
  useEffect(() => {
    if (!map.current || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!showPFZ) return;

    pfzData.forEach((advisory) => {
      advisory.zones.forEach((zone) => {
        // Create custom marker element
        const el = document.createElement("div");
        el.style.cssText = `
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #0066cc 0%, #00a3ff 100%);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,102,204,0.4);
          cursor: pointer;
          transition: transform 0.2s ease;
        `;
        el.onmouseenter = () => (el.style.transform = "scale(1.2)");
        el.onmouseleave = () => (el.style.transform = "scale(1)");

        // Create popup
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: true,
          className: "pfz-popup",
        }).setHTML(`
          <div style="padding: 12px; min-width: 180px; font-family: system-ui;">
            <h3 style="font-weight: 600; margin: 0 0 8px 0; color: #0066cc; font-size: 14px;">
              🐟 PFZ Zone
            </h3>
            <div style="font-size: 12px; color: #374151;">
              <p style="margin: 4px 0;"><strong>Sector:</strong> ${advisory.sector.replace(/_/g, " ")}</p>
              <p style="margin: 4px 0;"><strong>SST:</strong> ${(zone.sst ?? 0).toFixed(1)}°C</p>
              <p style="margin: 4px 0;"><strong>Depth:</strong> ${zone.depth ?? 0}m</p>
              <p style="margin: 4px 0;"><strong>Species:</strong> ${advisory.fishSpecies
                .slice(0, 3)
                .map((s) => s.name)
                .join(", ")}</p>
            </div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([zone.coordinates.longitude, zone.coordinates.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    });
  }, [mapReady, pfzData, showPFZ]);

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
            Layers
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="pfz-toggle" className="text-xs">PFZ Zones</Label>
            <Switch id="pfz-toggle" checked={showPFZ} onCheckedChange={setShowPFZ} />
          </div>
        </Card>

        {/* 3D Controls */}
        <Card className="p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Mountain className="h-4 w-4" />
            3D View
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="3d-toggle" className="text-xs">Enable 3D</Label>
              <Switch id="3d-toggle" checked={is3D} onCheckedChange={setIs3D} />
            </div>
            {is3D && (
              <div>
                <Label className="text-xs text-muted-foreground">Tilt: {pitch}°</Label>
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
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleRotate} title="Rotate">
          <Compass className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleResetView}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleFullscreen}>
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Nav */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="max-h-48 overflow-auto p-2">
          <div className="mb-1 text-xs font-medium text-muted-foreground">Quick Nav</div>
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
