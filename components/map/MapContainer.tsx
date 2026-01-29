"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Layers, ZoomIn, ZoomOut, Maximize, RotateCcw } from "lucide-react";
import { SECTOR_COORDINATES } from "@/lib/api/config";
import type { PFZAdvisory, Sector } from "@/lib/types";
import dynamic from "next/dynamic";

interface MapContainerProps {
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  pfzData?: PFZAdvisory[];
  onSectorSelect?: (sector: Sector) => void;
  className?: string;
}

const DEFAULT_CENTER = { lat: 15.0, lng: 78.0 };
const DEFAULT_ZOOM = 5;

function MapContainerInner({
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM,
  pfzData = [],
  onSectorSelect,
  className,
}: MapContainerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const [layers, setLayers] = useState({
    pfz: true,
    sst: false,
    chlorophyll: false,
    boundaries: true,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`relative h-full w-full bg-muted ${className}`}>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const L = require("leaflet");
  const { MapContainer: LeafletMap, TileLayer, Marker, Popup, useMap } = require("react-leaflet");

  // Fix Leaflet marker icons
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });

  // Custom PFZ marker icon
  const pfzIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const toggleLayer = (layerName: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  function MapController() {
    const map = useMap();
    mapRef.current = map;
    return null;
  }

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetView = () => {
    mapRef.current?.setView([initialCenter.lat, initialCenter.lng], initialZoom);
  };

  const handleFullscreen = () => {
    const container = document.querySelector(".leaflet-container");
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }
  };

  const goToSector = (sector: Sector) => {
    const coords = SECTOR_COORDINATES[sector];
    if (coords && mapRef.current) {
      mapRef.current.setView([coords.lat, coords.lng], coords.zoom);
      onSectorSelect?.(sector);
    }
  };

  // Collect all PFZ zone markers
  const markers: { lat: number; lng: number; sector: string; sst: number; depth: number }[] = [];
  if (layers.pfz) {
    pfzData.forEach((advisory) => {
      advisory.zones.forEach((zone) => {
        markers.push({
          lat: zone.coordinates.latitude,
          lng: zone.coordinates.longitude,
          sector: advisory.sector.replace(/_/g, " "),
          sst: zone.sst ?? 0,
          depth: zone.depth ?? 0,
        });
      });
    });
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={{ minHeight: "400px" }}>
      {/* Leaflet Map */}
      <LeafletMap
        center={[initialCenter.lat, initialCenter.lng]}
        zoom={initialZoom}
        className="h-full w-full rounded-lg"
        minZoom={4}
        maxZoom={12}
      >
        <MapController />
        
        {/* OpenStreetMap tiles - FREE, no API key needed */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* PFZ Zone Markers */}
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={pfzIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm mb-1">PFZ Zone</h3>
                <p className="text-xs">Sector: {marker.sector}</p>
                <p className="text-xs">SST: {marker.sst.toFixed(1)}°C</p>
                <p className="text-xs">Depth: {marker.depth}m</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </LeafletMap>

      {/* Map Controls Overlay */}
      <div className="absolute left-4 top-4 z-[1000] space-y-2">
        <Card className="p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Layers className="h-4 w-4" />
            Layers
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pfz-layer" className="text-xs">
                PFZ Zones
              </Label>
              <Switch
                id="pfz-layer"
                checked={layers.pfz}
                onCheckedChange={() => toggleLayer("pfz")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sst-layer" className="text-xs">
                SST
              </Label>
              <Switch
                id="sst-layer"
                checked={layers.sst}
                onCheckedChange={() => toggleLayer("sst")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="chlorophyll-layer" className="text-xs">
                Chlorophyll
              </Label>
              <Switch
                id="chlorophyll-layer"
                checked={layers.chlorophyll}
                onCheckedChange={() => toggleLayer("chlorophyll")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="boundaries-layer" className="text-xs">
                Boundaries
              </Label>
              <Switch
                id="boundaries-layer"
                checked={layers.boundaries}
                onCheckedChange={() => toggleLayer("boundaries")}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-1">
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleResetView}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleFullscreen}>
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Sector Navigation */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <Card className="max-h-48 overflow-auto p-2">
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            Quick Nav
          </div>
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

// Dynamic import to avoid SSR issues with Leaflet
export const MapContainer = dynamic(() => Promise.resolve(MapContainerInner), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});
