"use client";

import { useState } from "react";
import { MapContainer } from "@/components/map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePFZAdvisories } from "@/lib/hooks/usePFZData";
import { MapPin, Thermometer, Fish, Waves, X } from "lucide-react";
import type { Sector, PFZAdvisory } from "@/lib/types";

const sectors: { value: Sector | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Sectors" },
  { value: "KERALA", label: "Kerala" },
  { value: "TAMIL_NADU", label: "Tamil Nadu" },
  { value: "ANDHRA_PRADESH", label: "Andhra Pradesh" },
  { value: "GUJARAT", label: "Gujarat" },
  { value: "MAHARASHTRA", label: "Maharashtra" },
  { value: "ODISHA", label: "Odisha" },
  { value: "WEST_BENGAL", label: "West Bengal" },
  { value: "KARNATAKA", label: "Karnataka" },
];

export default function MapPage() {
  const [selectedSector, setSelectedSector] = useState<Sector | "ALL">("ALL");
  const [selectedAdvisory, setSelectedAdvisory] = useState<PFZAdvisory | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { advisories, isLoading } = usePFZAdvisories(
    selectedSector !== "ALL" ? { sector: selectedSector } : undefined
  );

  const handleSectorSelect = (sector: Sector) => {
    setSelectedSector(sector);
    const advisory = advisories.find((a) => a.sector === sector);
    if (advisory) {
      setSelectedAdvisory(advisory);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-80 shrink-0 border-r bg-background">
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="border-b p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">PFZ Zones</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Select
                value={selectedSector}
                onValueChange={(v) => setSelectedSector(v as Sector | "ALL")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advisory List */}
            <ScrollArea className="flex-1 p-4">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2 rounded-lg border p-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    </div>
                  ))}
                </div>
              ) : advisories.length > 0 ? (
                <div className="space-y-3">
                  {advisories.map((advisory) => (
                    <Card
                      key={advisory.id}
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedAdvisory?.id === advisory.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedAdvisory(advisory)}
                    >
                      <CardContent className="p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge variant="ocean" className="text-xs">
                            {advisory.sector.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {advisory.zones.length} zones
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            <span>
                              SST: {advisory.zones[0]?.sst?.toFixed(1) || "N/A"}°C
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Fish className="h-3 w-3" />
                            <span>{advisory.fishSpecies.length} species</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No PFZ zones available
                  </p>
                </div>
              )}
            </ScrollArea>

            {/* Selected Advisory Details */}
            {selectedAdvisory && (
              <div className="border-t p-4">
                <h3 className="mb-2 text-sm font-semibold">Selected Zone Details</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sector</span>
                    <span>{selectedAdvisory.sector.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zones</span>
                    <span>{selectedAdvisory.zones.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg SST</span>
                    <span>
                      {(
                        selectedAdvisory.zones.reduce((s, z) => s + (z.sst || 0), 0) /
                        selectedAdvisory.zones.length
                      ).toFixed(1)}
                      °C
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div>
                    <span className="text-muted-foreground">Fish Species:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedAdvisory.fishSpecies.slice(0, 4).map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Area */}
      <div className="relative flex-1">
        {!sidebarOpen && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute left-4 top-4 z-10"
            onClick={() => setSidebarOpen(true)}
          >
            <Waves className="mr-2 h-4 w-4" />
            Show Zones
          </Button>
        )}
        <MapContainer
          pfzData={advisories}
          onSectorSelect={handleSectorSelect}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
