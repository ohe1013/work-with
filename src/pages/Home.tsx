import { useEffect, useState } from "react";
import BaseMap from "../components/map/BaseMap";
import SearchBar from "../components/map/SearchBar";

export default function Home(): JSX.Element {
  const [searchedList, setSearhcedList] = useState([]);

  useEffect(() => {}, []);
  // const { loading, error } = useInjectKakaoMapApi({
  //   appkey: import.meta.env.VITE_KAKAO_API_KEY,
  // });
  return (
    <section className="pt-10 w-full" id="osm">
      <article className="relative w-full h-[calc(100vh_-_10px)]">
        <SearchBar /> <BaseMap></BaseMap>
      </article>
    </section>
  );
}
