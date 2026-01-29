"use client";

import { useState } from "react";
import { AdvisoryCard } from "@/components/advisories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePFZAdvisories } from "@/lib/hooks/usePFZData";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import type { Sector } from "@/lib/types";

const sectors: { value: Sector | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Sectors" },
  { value: "GUJARAT", label: "Gujarat" },
  { value: "MAHARASHTRA", label: "Maharashtra" },
  { value: "GOA", label: "Goa" },
  { value: "KARNATAKA", label: "Karnataka" },
  { value: "KERALA", label: "Kerala" },
  { value: "TAMIL_NADU", label: "Tamil Nadu" },
  { value: "ANDHRA_PRADESH", label: "Andhra Pradesh" },
  { value: "ODISHA", label: "Odisha" },
  { value: "WEST_BENGAL", label: "West Bengal" },
  { value: "ANDAMAN", label: "Andaman" },
  { value: "NICOBAR", label: "Nicobar" },
  { value: "LAKSHADWEEP", label: "Lakshadweep" },
];

export default function AdvisoriesPage() {
  const [selectedSector, setSelectedSector] = useState<Sector | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { advisories, isLoading, mutate } = usePFZAdvisories(
    selectedSector !== "ALL" ? { sector: selectedSector } : undefined
  );

  const filteredAdvisories = advisories.filter((advisory) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      advisory.sector.toLowerCase().includes(query) ||
      advisory.fishSpecies.some((s) => s.name.toLowerCase().includes(query)) ||
      advisory.remarks?.toLowerCase().includes(query)
    );
  });

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
  };

  const handleViewOnMap = (id: string) => {
    console.log("View on map:", id);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PFZ Advisories</h1>
          <p className="text-muted-foreground">
            Potential Fishing Zone advisories for Indian coastal waters
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => mutate()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search advisories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedSector}
                onValueChange={(value) => setSelectedSector(value as Sector | "ALL")}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({filteredAdvisories.length})</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="space-y-3">
                    <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="h-20 w-full animate-pulse rounded bg-muted" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredAdvisories.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAdvisories.map((advisory) => (
                <AdvisoryCard
                  key={advisory.id}
                  advisory={advisory}
                  onViewDetails={handleViewDetails}
                  onViewOnMap={handleViewOnMap}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium">No advisories found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || selectedSector !== "ALL"
                    ? "Try adjusting your filters"
                    : "Check back later for new advisories"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="archive" className="mt-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium">Archive</p>
              <p className="text-sm text-muted-foreground">
                Historical advisories will be available here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
