"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Calendar, Fish, Download, Map } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PFZAdvisory } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

interface AdvisoryCardProps {
  advisory: PFZAdvisory;
  onViewDetails?: (id: string) => void;
  onViewOnMap?: (id: string) => void;
  compact?: boolean;
}

const sectorDisplayNames: Record<string, string> = {
  GUJARAT: "Gujarat",
  MAHARASHTRA: "Maharashtra",
  GOA: "Goa",
  KARNATAKA: "Karnataka",
  KERALA: "Kerala",
  TAMIL_NADU: "Tamil Nadu",
  ANDHRA_PRADESH: "Andhra Pradesh",
  ODISHA: "Odisha",
  WEST_BENGAL: "West Bengal",
  ANDAMAN: "Andaman",
  NICOBAR: "Nicobar",
  LAKSHADWEEP: "Lakshadweep",
};

export function AdvisoryCard({
  advisory,
  onViewDetails,
  onViewOnMap,
  compact = false,
}: AdvisoryCardProps) {
  const isValid = new Date(advisory.validUpto) > new Date();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapOpen || !mapContainerRef.current) return;

    let rafId = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const initMap = () => {
      if (!mapContainerRef.current) return;
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      if (width === 0 || height === 0) {
        rafId = window.requestAnimationFrame(initMap);
        return;
      }

      const center: [number, number] = advisory.zones[0]
        ? [advisory.zones[0].coordinates.longitude, advisory.zones[0].coordinates.latitude]
        : [78, 15];

      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center,
        zoom: advisory.zones.length > 0 ? 6 : 4,
        pitch: 0,
      });

      advisory.zones.forEach((zone) => {
        new maplibregl.Marker({ color: "#0066cc" })
          .setLngLat([zone.coordinates.longitude, zone.coordinates.latitude])
          .addTo(mapRef.current!);
      });

      resizeTimer = setTimeout(() => mapRef.current?.resize(), 200);
      mapRef.current.on("load", () => mapRef.current?.resize());
    };

    rafId = window.requestAnimationFrame(initMap);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (resizeTimer) clearTimeout(resizeTimer);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mapOpen, advisory.id]);

  return (
    <Card className={compact ? "p-4" : ""}>
      <CardHeader className={compact ? "p-0 pb-3" : ""}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isValid ? "ocean" : "secondary"}>
              {isValid ? "Active" : "Expired"}
            </Badge>
            <Badge variant="outline">
              {sectorDisplayNames[advisory.sector] || advisory.sector}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(advisory.lastUpdated)}
          </span>
        </div>
        <CardTitle className="mt-2 text-lg">
          PFZ Advisory - {sectorDisplayNames[advisory.sector]}
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "p-0" : ""}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Valid: {formatDate(advisory.validFrom)} - {formatDate(advisory.validUpto)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{advisory.zones.length} fishing zone(s) identified</span>
          </div>

          {!compact && (
            <>
              <div className="flex items-start gap-2 text-sm">
                <Fish className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {advisory.fishSpecies.slice(0, 4).map((species, idx) => (
                    <Badge
                      key={idx}
                      variant={
                        species.expectedCatch === "high"
                          ? "success"
                          : species.expectedCatch === "medium"
                          ? "ocean"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {species.name}
                    </Badge>
                  ))}
                  {advisory.fishSpecies.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{advisory.fishSpecies.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {advisory.remarks && (
                <p className="text-sm text-muted-foreground">{advisory.remarks}</p>
              )}
            </>
          )}
        </div>
      </CardContent>
      {!compact && (
        <CardFooter className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMapOpen(true);
              onViewOnMap?.(advisory.id);
            }}
          >
            <Map className="mr-1 h-4 w-4" />
            View on Map
          </Button>
          {advisory.pdfUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={advisory.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-1 h-4 w-4" />
                PDF
              </a>
            </Button>
          )}
          <Button
            variant="ocean"
            size="sm"
            className="ml-auto"
            onClick={() => {
              setDetailsOpen(true);
              onViewDetails?.(advisory.id);
            }}
          >
            View Details
          </Button>
        </CardFooter>
      )}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>PFZ Advisory Details</DialogTitle>
            <DialogDescription>
              {sectorDisplayNames[advisory.sector] || advisory.sector} •{" "}
              {isValid ? "Active" : "Expired"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Valid Period</div>
                <div className="font-medium">
                  {formatDate(advisory.validFrom)} - {formatDate(advisory.validUpto)}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Last Updated</div>
                <div className="font-medium">{formatDate(advisory.lastUpdated)}</div>
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="mb-2 text-xs text-muted-foreground">Fish Species</div>
              <div className="flex flex-wrap gap-1">
                {advisory.fishSpecies.map((species, idx) => (
                  <Badge
                    key={idx}
                    variant={
                      species.expectedCatch === "high"
                        ? "success"
                        : species.expectedCatch === "medium"
                        ? "ocean"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {species.name}
                  </Badge>
                ))}
              </div>
            </div>

            {advisory.remarks && (
              <div className="rounded-lg border p-3">
                <div className="mb-2 text-xs text-muted-foreground">Remarks</div>
                <p>{advisory.remarks}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            {advisory.pdfUrl && (
              <Button variant="outline" asChild>
                <a href={advisory.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            )}
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mapOpen} onOpenChange={setMapOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>PFZ Zones (Map View)</DialogTitle>
            <DialogDescription>
              {advisory.zones.length} zone(s) •{" "}
              {sectorDisplayNames[advisory.sector] || advisory.sector}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border bg-muted">
              <div ref={mapContainerRef} className="h-64 w-full" />
            </div>
            <div className="max-h-[200px] space-y-2 overflow-auto pr-2 text-sm">
              {advisory.zones.map((zone, idx) => (
                <div key={idx} className="rounded-lg border p-3">
                  <div className="font-medium">Zone {idx + 1}</div>
                  <div className="mt-1 text-muted-foreground">
                    Lat {zone.coordinates.latitude.toFixed(3)}, Lng{" "}
                    {zone.coordinates.longitude.toFixed(3)}
                  </div>
                  <div className="mt-1 text-muted-foreground">
                    SST {Number(zone.sst ?? 0).toFixed(1)}°C • Depth{" "}
                    {Number(zone.depth ?? 0)}m
                  </div>
                </div>
              ))}
              {advisory.zones.length === 0 && (
                <div className="rounded-lg border p-3 text-muted-foreground">
                  No zones available for this advisory.
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setMapOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
