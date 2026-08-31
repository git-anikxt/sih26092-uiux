'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type PartnerStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';

interface PartnerLocation {
  branchId: string;
  partnerName: string;
  branchName: string;
  status: PartnerStatus;
  lat: number;
  lon: number;
}

const CENTER: [number, number] = [28.67, 77.45];

const STATUS_MARKER_COLORS: Record<PartnerStatus, string> = {
  AVAILABLE: '#16a34a',
  UNAVAILABLE: '#9ca3af',
  UNKNOWN: '#9ca3af',
};

function createMarkerIcon(status: PartnerStatus): L.DivIcon {
  const color = STATUS_MARKER_COLORS[status];
  const isUnavailable = status === 'UNAVAILABLE';
  const opacity = isUnavailable ? 'opacity:0.55;' : '';
  const ringColor = isUnavailable ? '#6b7280' : color;

  const html = `
    <div style="${opacity} position: relative;">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="${ringColor}" stroke-width="1.5" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'nsfdc-partner-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

interface PartnerMapProps {
  partners: PartnerLocation[];
  onMarkerClick: (branchId: string) => void;
}

export function PartnerMap({ partners, onMarkerClick }: PartnerMapProps) {
  const handleMarkerClick = (branchId: string) => {
    onMarkerClick(branchId);
  };

  return (
    <MapContainer
      center={CENTER}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ borderRadius: 'calc(var(--radius) - 4px)' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {partners.map((partner) => (
        <Marker
          key={partner.branchId}
          position={[partner.lat, partner.lon]}
          icon={createMarkerIcon(partner.status)}
          eventHandlers={{
            click: () => handleMarkerClick(partner.branchId),
          }}
        >
          <Popup>
            <div className="space-y-0.5">
              <p className="font-semibold text-sm">{partner.partnerName}</p>
              <p className="text-xs text-muted-foreground">
                {partner.branchName}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
