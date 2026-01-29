import Link from "next/link";
import { Header } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Waves,
  Fish,
  Map,
  Bell,
  Thermometer,
  Globe,
  ArrowRight,
  BarChart3,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Fish,
    title: "PFZ Advisories",
    description: "Real-time Potential Fishing Zone advisories for 12 coastal sectors",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description: "Visualize fishing zones, SST, and chlorophyll data on interactive maps",
  },
  {
    icon: Bell,
    title: "Alert System",
    description: "Tsunami, storm surge, and marine weather warnings",
  },
  {
    icon: Thermometer,
    title: "Ocean Data",
    description: "Sea surface temperature, currents, and climate indices",
  },
  {
    icon: Globe,
    title: "Multi-language",
    description: "Available in Hindi, Telugu, Tamil, and 7 more Indian languages",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Historical trends and regional statistics dashboard",
  },
];

const sectors = [
  "Gujarat",
  "Maharashtra",
  "Goa",
  "Karnataka",
  "Kerala",
  "Tamil Nadu",
  "Andhra Pradesh",
  "Odisha",
  "West Bengal",
  "Andaman",
  "Nicobar",
  "Lakshadweep",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-ocean-600 via-ocean-700 to-ocean-900 py-20 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              <Waves className="mr-1 h-3 w-3" />
              INCOIS Marine Fisheries Platform
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Empowering India&apos;s Fishing Community
            </h1>
            <p className="mb-8 text-lg text-ocean-100 md:text-xl">
              Real-time ocean observations, Potential Fishing Zone advisories, and
              marine weather alerts for sustainable and safe fishing operations.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-white text-ocean-700 hover:bg-ocean-50" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/map">View Map</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="currentColor"
              className="text-background"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Comprehensive Marine Data Platform
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Access real-time ocean data, fishing advisories, and weather alerts
              designed for fishermen, researchers, and maritime professionals.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ocean-100 text-ocean-600 dark:bg-ocean-900/30">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="border-y bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Complete Coastal Coverage
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Serving all major fishing sectors across India&apos;s coastline
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {sectors.map((sector) => (
              <Badge
                key={sector}
                variant="secondary"
                className="px-4 py-2 text-sm"
              >
                {sector}
              </Badge>
            ))}
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-ocean-600">12+</div>
              <div className="text-sm text-muted-foreground">Coastal Sectors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-ocean-600">10</div>
              <div className="text-sm text-muted-foreground">Indian Languages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-ocean-600">24/7</div>
              <div className="text-sm text-muted-foreground">Real-time Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-0 bg-gradient-to-r from-ocean-600 to-ocean-800 text-white shadow-2xl">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    <span className="font-semibold">Safe Fishing Operations</span>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold md:text-3xl">
                    Start Using INCOIS Marine Platform
                  </h3>
                  <p className="text-ocean-100">
                    Access PFZ advisories, weather alerts, and ocean data today.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="shrink-0 bg-white text-ocean-700 hover:bg-ocean-50"
                  asChild
                >
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-600 text-white">
                <Waves className="h-4 w-4" />
              </div>
              <span className="font-semibold">INCOIS Marine Fisheries</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Indian National Centre for Ocean Information Services
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
