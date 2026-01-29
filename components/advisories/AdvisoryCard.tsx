"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Fish, Download, Map } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PFZAdvisory } from "@/lib/types";

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
            onClick={() => onViewOnMap?.(advisory.id)}
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
            onClick={() => onViewDetails?.(advisory.id)}
          >
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
