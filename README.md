# INCOIS Marine Fisheries Platform

A modern Next.js 16 web application for displaying real-time ocean observations, Potential Fishing Zone (PFZ) advisories, and marine weather alerts for India's fishing community.

## Features

- **PFZ Advisories** - Real-time Potential Fishing Zone advisories for 12 coastal sectors
- **Interactive Maps** - Mapbox GL-based visualization of fishing zones, SST, and chlorophyll data
- **Alert System** - Tsunami, storm surge, cyclone, and marine weather warnings
- **Ocean Data** - Sea surface temperature, currents, and climate indices
- **Multi-language Support** - Available in 10 Indian languages (English, Hindi, Telugu, Tamil, Kannada, Marathi, Odia, Bengali, Malayalam, Gujarati)
- **Analytics Dashboard** - Historical trends and regional statistics

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 with custom INCOIS design tokens
- **UI Components**: Shadcn/UI with Radix primitives
- **Charts**: Recharts
- **Maps**: Mapbox GL JS
- **Data Fetching**: SWR
- **i18n**: next-intl
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# Mapbox (required for map functionality)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# INCOIS API (optional - uses mock data if not set)
NEXT_PUBLIC_INCOIS_API_URL=https://incois.gov.in
NEXT_PUBLIC_ARCGIS_API_URL=https://incois.gov.in/gisserver/rest/services
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/                 # API route handlers
│   │   ├── alerts/
│   │   ├── observations/
│   │   └── pfz/
│   ├── advisories/          # PFZ advisories page
│   ├── alerts/              # Alerts & warnings page
│   ├── dashboard/           # Main dashboard
│   ├── map/                 # Interactive map
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── advisories/          # Advisory & alert cards
│   ├── common/              # Header, navigation
│   ├── dashboard/           # Metrics cards, charts
│   ├── map/                 # Map container & controls
│   └── ui/                  # Shadcn/UI components
├── lib/
│   ├── api/                 # API services
│   ├── hooks/               # Custom SWR hooks
│   ├── types/               # TypeScript interfaces
│   └── utils.ts             # Utility functions
├── messages/                # i18n translation files
│   ├── en.json
│   ├── hi.json
│   └── ...
└── i18n/
    └── request.ts           # next-intl configuration
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, and CTAs |
| `/dashboard` | Main dashboard with metrics, charts, and recent advisories |
| `/advisories` | PFZ advisory listing with sector filters |
| `/map` | Interactive map with layer controls |
| `/alerts` | Active alerts and climate indices |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/pfz` | Fetch PFZ advisories (params: sector, date, lang) |
| `GET /api/observations` | Fetch ocean observations (params: type, sector, bounds) |
| `GET /api/alerts` | Fetch alerts (params: type, severity, sector) |

## Customization

### Design Tokens

Custom colors are defined in `app/globals.css`:

- **Ocean Blue** (`ocean-*`): Primary brand color
- **Coral Orange** (`coral-*`): Accent color
- **Sea Teal** (`sea-*`): Secondary accent

### Adding Languages

1. Create a new JSON file in `messages/` (e.g., `messages/new-lang.json`)
2. Add the locale code to `i18n/request.ts`

## Deployment

```bash
npm run build
npm start
```

Or deploy to Vercel, Netlify, or any Node.js hosting platform.

## License

MIT License - See LICENSE file for details.

## Credits

Built for the Indian National Centre for Ocean Information Services (INCOIS).
