'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Navigation,
  Star,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PartnerMap = dynamic(
  () => import('@/components/partner-map').then((m) => m.PartnerMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

type PartnerStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';

interface Partner {
  branchId: string;
  partnerName: string;
  partnerType: string;
  branchName: string;
  distanceMeters: number;
  serviceQualityScore: number;
  status: PartnerStatus;
  statusVerifiedAt: string;
  rankScore: number;
  whyRanked: string[];
  lat: number;
  lon: number;
}

const CENTER_LAT = 28.67;
const CENTER_LON = 77.45;

const mockPartners: Partner[] = [
  {
    branchId: 'b2',
    partnerName: 'Demo RRB — Meerut Road Branch',
    partnerType: 'RRB',
    branchName: 'Meerut Road, Ghaziabad Branch',
    distanceMeters: 7388.06,
    serviceQualityScore: 4.0,
    status: 'AVAILABLE',
    statusVerifiedAt: '2026-08-29T10:00:00Z',
    rankScore: 0.881,
    whyRanked: [
      'authorized and currently available',
      'moderate distance',
      'highly rated branch',
    ],
    lat: CENTER_LAT + 0.05,
    lon: CENTER_LON + 0.04,
  },
  {
    branchId: 'b1',
    partnerName: 'Demo NBFC-MFI — Ghaziabad',
    partnerType: 'NBFC_MFI',
    branchName: 'Ghaziabad NBFC Office',
    distanceMeters: 1477.79,
    serviceQualityScore: 3.5,
    status: 'UNAVAILABLE',
    statusVerifiedAt: '2026-08-29T10:00:00Z',
    rankScore: 0.48,
    whyRanked: ['currently unavailable', 'nearby'],
    lat: CENTER_LAT - 0.01,
    lon: CENTER_LON + 0.01,
  },
];

const schemeName = 'Micro Finance Scheme (MFS)';

const STATUS_CONFIG: Record<
  PartnerStatus,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: 'Available',
    className: 'bg-success/15 text-success',
  },
  UNAVAILABLE: {
    label: 'Unavailable',
    className: 'bg-destructive/15 text-destructive',
  },
  UNKNOWN: {
    label: 'Status Unknown',
    className: 'bg-muted text-muted-foreground',
  },
};

const PARTNER_TYPE_LABELS: Record<string, string> = {
  RRB: 'Regional Rural Bank',
  NBFC_MFI: 'NBFC-MFI',
  PUBLIC_SECTOR_BANK: 'Public Sector Bank',
  PRIVATE_BANK: 'Private Bank',
};

function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toLocaleString('en-IN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km away`;
}

function formatVerifiedAt(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function renderStars(score: number): React.ReactNode {
  const full = Math.floor(score);
  const hasHalf = score - full >= 0.5;
  return (
    <span className="flex items-center gap-1">
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFull = i < full;
          const isHalf = i === full && hasHalf;
          return (
            <Star
              key={i}
              className={cn(
                'h-3.5 w-3.5',
                isFull
                  ? 'fill-warning text-warning'
                  : isHalf
                    ? 'fill-warning/50 text-warning'
                    : 'fill-muted text-muted-foreground/40'
              )}
            />
          );
        })}
      </span>
      <span className="text-sm font-medium text-foreground">
        {score.toLocaleString('en-IN', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
      </span>
    </span>
  );
}

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-muted/60">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 animate-pulse" />
        Loading map…
      </div>
    </div>
  );
}

export default function PartnerLocatorPage() {
  const [highlightedId, setHighlightedId] = React.useState<string | null>(null);
  const cardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const highlightTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const handleMarkerClick = (branchId: string) => {
    const card = cardRefs.current[branchId];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setHighlightedId(branchId);
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = setTimeout(
      () => setHighlightedId(null),
      2500
    );
  };

  React.useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    };
  }, []);

  const handleDirections = (branchName: string) => {
    console.log(branchName);
  };

  const handleBack = () => {
    console.log('back-to-results');
  };

  const mapPartners = mockPartners.map((p) => ({
    branchId: p.branchId,
    partnerName: p.partnerName,
    branchName: p.branchName,
    status: p.status,
    lat: p.lat,
    lon: p.lon,
  }));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Map */}
        <Card className="mb-6 overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <div className="h-[350px] w-full">
              <PartnerMap
                partners={mapPartners}
                onMarkerClick={handleMarkerClick}
              />
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <div className="mb-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to results
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Nearby Partners for {schemeName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Lending partners authorized for this scheme, ranked by proximity,
            availability, and service quality.
          </p>
        </div>

        {/* Location banner */}
        <div className="mb-6 flex items-center gap-2.5 rounded-md bg-muted/60 p-3">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Showing partners near your registered location
          </p>
        </div>

        {/* Partner cards */}
        <div className="space-y-4">
          {mockPartners.map((partner, index) => {
            const status = STATUS_CONFIG[partner.status];
            const isUnavailable = partner.status === 'UNAVAILABLE';
            const isHighlighted = highlightedId === partner.branchId;
            return (
              <div
                key={partner.branchId}
                ref={(el) => {
                  cardRefs.current[partner.branchId] = el;
                }}
              >
                <Card
                  className={cn(
                    'relative overflow-hidden shadow-sm transition-all duration-300',
                    isUnavailable && 'border-muted bg-muted/30 opacity-75',
                    isHighlighted &&
                      'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                            {index + 1}
                          </span>
                          <CardTitle className="text-lg leading-tight sm:text-xl">
                            {partner.partnerName}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1.5 pl-9 text-sm text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5" />
                          {partner.branchName}
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          'px-3 py-1 text-sm font-semibold',
                          status.className
                        )}
                      >
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Key details */}
                    <div className="grid grid-cols-2 gap-4 rounded-md bg-muted/60 p-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Distance
                        </p>
                        <p className="mt-1 text-base font-semibold text-foreground">
                          {formatDistance(partner.distanceMeters)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Service rating
                        </p>
                        <div className="mt-1">
                          {renderStars(partner.serviceQualityScore)}
                        </div>
                      </div>
                    </div>

                    {/* Partner type + verified date */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        Type:{' '}
                        <span className="font-medium text-foreground">
                          {PARTNER_TYPE_LABELS[partner.partnerType] ??
                            partner.partnerType}
                        </span>
                      </span>
                      <span>
                        Status verified:{' '}
                        <span className="font-medium text-foreground">
                          {formatVerifiedAt(partner.statusVerifiedAt)}
                        </span>
                      </span>
                    </div>

                    {/* Why ranked chips */}
                    <div>
                      <Separator className="mb-3" />
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Why this ranking
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {partner.whyRanked.map((reason, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Get directions button */}
                    <div className="flex justify-end pt-1">
                      <Button
                        type="button"
                        variant={isUnavailable ? 'outline' : 'default'}
                        onClick={() => handleDirections(partner.branchName)}
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          NSFDC Scheme Finder — a platform for Scheduled Caste entrepreneurs
        </p>
      </main>
    </div>
  );
}
