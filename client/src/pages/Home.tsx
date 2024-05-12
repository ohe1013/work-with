import BaseMap from "../components/map/BaseMap";

export default function Home(): JSX.Element {
  return (
    <section className=" w-full" id="osm">
      <article className="relative w-full h-[calc(100vh_-_10px)]">
        <BaseMap></BaseMap>
      </article>
    </section>
  );
}
