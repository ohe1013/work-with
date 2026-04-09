import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useMapStatus } from "../../hooks/map/useMapStatus";
import { useMarkerSelection } from "../../hooks/map/useMarkerSelection";

export default function BaseMap() {
  const { markers, mapInfo } = useMapStatus();
  const { selectedMarker, focusMarker, clearSelectedMarker } =
    useMarkerSelection();

  return (
    <Map
      center={mapInfo.center}
      style={{
        width: "100%",
        height: "100%",
      }}
      level={mapInfo.zoom}
      onClick={clearSelectedMarker}
    >
      {selectedMarker ? (
        <CustomOverlayMap
          position={selectedMarker.position}
          yAnchor={1.35}
          xAnchor={0.5}
        >
          <div className="pointer-events-none inline-flex items-center gap-2 rounded-full bg-slate-950/84 px-3 py-2 text-xs font-semibold text-white shadow-[0_14px_34px_rgba(15,23,42,0.24)] backdrop-blur-sm">
            <span
              className="h-2 w-2 rounded-full bg-[rgb(var(--color-accent))]"
              aria-hidden="true"
            />
            <span className="max-w-[180px] truncate">
              {selectedMarker.content}
            </span>
          </div>
        </CustomOverlayMap>
      ) : null}

      {markers.map((marker) => (
        <MapMarker
          key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
          position={marker.position}
          onClick={() => focusMarker(marker)}
        />
      ))}
    </Map>
  );
}
