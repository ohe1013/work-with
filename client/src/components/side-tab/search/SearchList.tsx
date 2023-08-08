import { useRecoilState } from "recoil";
import { MarkerWithId } from "../../../types/map";
import { MapInfoAtom, MapUserAtom } from "../../../recoil/MapStatus";

export default function SearchList({ markers }: { markers: MarkerWithId[] }) {
  const [, setInfo] = useRecoilState<MarkerWithId>(MapInfoAtom);
  const [, setMapInfo] = useRecoilState(MapUserAtom);
  const clickHandler = (marker: MarkerWithId) => {
    setInfo(marker);
    setMapInfo({ zoom: 3, center: { ...marker.position } });
  };

  return (
    <div className={"block"}>
      <ul>
        {markers.map((marker, idx) => (
          <li key={marker.id + idx}>
            <button
              onClick={() => clickHandler(marker)}
              className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none"
            >
              <div className="text-left rtl:text-right">
                <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">
                  {marker.content} <span className="text-sm text-gray-400"> {marker.category_name}</span>
                </h1>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{marker.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{marker.phone}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
