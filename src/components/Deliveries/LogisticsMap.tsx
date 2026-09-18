import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import Box from "@mui/material/Box";
import "leaflet/dist/leaflet.css";

import { COLORS, LIGHT_COLORS } from "../../theme/COLORS";

export type MapStop = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  color?: string;
};

type MapPath = {
  id: string;
  points: Array<[number, number]>;
  color?: string;
};

type LogisticsMapProps = {
  depot?: { lat: number; lng: number; label: string };
  stops: MapStop[];
  paths?: MapPath[];
};

export const LogisticsMap = ({ depot, stops, paths = [] }: LogisticsMapProps) => {
  const points = [
    ...(depot ? [{ lat: depot.lat, lng: depot.lng }] : []),
    ...stops,
  ];
  const center: [number, number] = points[0]
    ? [points[0].lat, points[0].lng]
    : [47.5, 19.05];

  if (points.length === 0) {
    return (
      <Box
        sx={{
          height: 360,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.text.muted,
          borderRadius: "16px",
          border: `1px solid ${COLORS.border.default}`,
          backgroundColor: COLORS.background.subtle,
        }}
      >
        No mapped stops yet
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 360,
        overflow: "hidden",
        borderRadius: "16px",
        border: `1px solid ${COLORS.border.default}`,
        "& .leaflet-container": {
          height: "100%",
          width: "100%",
          zIndex: 0,
        },
        "& .leaflet-pane": { zIndex: 0 },
        "& .leaflet-control": { zIndex: 1 },
        "& .leaflet-top, & .leaflet-bottom": { zIndex: 1 },
      }}
    >
      <MapContainer
        key={`${center[0]},${center[1]}`}
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {depot ? (
          <CircleMarker
            center={[depot.lat, depot.lng]}
            radius={11}
            pathOptions={{
              color: LIGHT_COLORS.primary[700],
              fillColor: LIGHT_COLORS.primary[500],
              fillOpacity: 0.9,
            }}
          >
            <Tooltip>{depot.label}</Tooltip>
          </CircleMarker>
        ) : null}
        {paths.map((item) =>
          item.points.length > 1 ? (
            <Polyline
              key={item.id}
              positions={item.points}
              pathOptions={{ color: item.color ?? LIGHT_COLORS.primary[500], weight: 3 }}
            />
          ) : null,
        )}
        {stops.map((stop, index) => (
          <CircleMarker
            key={stop.id}
            center={[stop.lat, stop.lng]}
            radius={9}
            pathOptions={{
              color: stop.color ?? LIGHT_COLORS.status.inTransit,
              fillColor: stop.color ?? LIGHT_COLORS.status.inTransit,
              fillOpacity: 0.85,
            }}
          >
            <Tooltip>
              {index + 1}. {stop.label}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </Box>
  );
};
