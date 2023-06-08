/**
 * OSM 페이지 컴포넌트
 *
 * @author RWB
 * @since 2022.02.17 Thu 01:04:47
 */

import { Map, View } from "ol";
import React, { useEffect } from "react";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import proj4 from "proj4";
/**
 * OSM 페이지 JSX 반환 메서드
 *
 * @returns {JSX.Element} JSX
 */
export default function Home(): JSX.Element {
    useEffect(() => {
        document.querySelector("#map > .ol-viewport")?.remove();

        const seoulPosition = [126.97836930289438, 37.56664507000858];
        const osmLayer = new TileLayer({
            preload: Infinity,
            properties: { name: "base-osm" },
            source: new OSM({
                attributions: '<p>Developed by <a href="https://itcode.dev" target="_blank">RWB</a></p>',
                cacheSize: 0,
            }),
            zIndex: 1,
        });

        new Map({
            layers: [osmLayer],
            target: "map",
            view: new View({
                center: proj4("EPSG:4326", "EPSG:3857", seoulPosition),
                projection: "EPSG:3857",
                zoom: 17,
            }),
        });
    }, []);

    return (
        <section className="page" id="osm">
            <article className="map-wrapper">
                <div className="w-100 h-100" id="map" />
            </article>
        </section>
    );
}
