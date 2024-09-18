"use client";

import { useMemo, useCallback } from "react";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

export default function WorldMap({ geoData, min, max }) {
  const colorScale = useMemo(
    () => scaleLinear().domain([min, max]).range(["#a1a1aa", "#fafafa"]),
    [min, max]
  );

  const getColor = useCallback(
    (geo) => {
      const d = geoData.find((s) => s._id === geo.properties.Alpha2);
      return d ? colorScale(d["count"]) : "#71717a";
    },
    [geoData, colorScale]
  );

  const memoizedGeographies = useMemo(() => {
    return ({ geographies }) =>
      geographies.map((geo) => (
        <Geography
          key={geo.rsmKey}
          geography={geo}
          fill={getColor(geo)}
          className="outline-none stroke-0.5 stroke-zinc-800 hover:fill-emerald-500"
        />
      ));
  }, [getColor]);

  return (
    <ComposableMap
      projection="geoEquirectangular"
      projectionConfig={{
        scale: 147,
      }}
      style={{ width: "100%", height: "100vh" }}
    >
      <ZoomableGroup zoom={1.2} minZoom={1.2} maxZoom={5} center={[0, 0]}>
        <Geographies geography="countries.json">
          {memoizedGeographies}
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
