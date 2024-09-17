"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

export default function WorldMap({ geoData }) {
    console.log(geoData);
  return (
    <ComposableMap style={{ width: "100%", height: "100vh" }}>
      <ZoomableGroup zoom={1.25} minZoom={1} maxZoom={5} center={["10", "0"]}>
        <Geographies geography="countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="stroke-zinc-800 stroke-0.5 fill-zinc-500 outline-none"
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
