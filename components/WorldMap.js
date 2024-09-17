"use client";

import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

export default function WorldMap({ geoData, min, max }) {
  const colorScale = scaleLinear()
    .domain([min, max])
    .range(["#a1a1aa", "#fafafa"]);

  return (
    <ComposableMap style={{ width: "100%", height: "100vh" }}>
      <ZoomableGroup
        zoom={1.25}
        minZoom={1.25}
        maxZoom={5}
        center={["10", "0"]}
      >
        <Geographies geography="countries.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              const d = geoData.find((s) => s._id === geo.properties.Alpha2);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="stroke-zinc-800 stroke-0.5 outline-none"
                  fill={d ? colorScale(d["count"]) : "#71717a"}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
