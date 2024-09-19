"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useGraphicsQuality } from "@/components/providers/GraphicsQualityContext";
import { useCommandMenu } from "@/components/providers/CommandMenuContext";
import { getCountryData } from "countries-list";

const FPSCounter = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const updateFPS = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime > 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(updateFPS);
    };

    const animationId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const getFPSColor = (fps) => {
    if (fps >= 60) return "text-green-400";
    if (fps >= 30) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="absolute top-2 right-2 flex items-center justify-center z-50">
      <div className="rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 shadow flex items-center gap-1 p-1">
        <div className="py-1 px-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 rounded-full outline-none text-sm text-zinc-200">
          FPS: <span className={getFPSColor(fps)}>{fps}</span>
        </div>
      </div>
    </div>
  );
};

export default function WorldMap({ geoData, min, max }) {
  const [hoverCountry, setHoverCountry] = useState(null);
  const { isHighQuality } = useGraphicsQuality();
  const { setSelectedCountry } = useCommandMenu();

  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1.2 });

  const handleReset = useCallback(() => {
    setPosition({ coordinates: [0, 0], zoom: 1.2 });
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "r") {
        handleReset();
      } else if (event.key === "Enter" && hoverCountry) {
        setSelectedCountry(hoverCountry);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleReset, hoverCountry]);

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
          onClick={() =>
            geo.properties.Alpha2 && setSelectedCountry(geo.properties.Alpha2)
          }
          className="outline-none select-none stroke-0.5 stroke-zinc-800 hover:fill-emerald-500"
          tabIndex={-1}
          onMouseEnter={() => setHoverCountry(geo.properties.Alpha2 || null)}
          onMouseLeave={() => setHoverCountry(null)}
        />
      ));
  }, [getColor, setHoverCountry]);

  return (
    <div className="relative w-screen h-screen">
      {hoverCountry !== null && (
        <div className="absolute top-5 left-0 right-0 flex items-center justify-center z-50">
          <div className="rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 shadow flex items-center gap-1 p-1">
            <div className="py-1 px-2 rounded-full outline-none flex items-center gap-1.5">
              <img
                className="w-5 h-auto rounded-sm"
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${hoverCountry}.svg`}
                loading="lazy"
              />
              <span className="text-zinc-200 text-sm">
                {getCountryData(hoverCountry)?.name}
              </span>
            </div>
          </div>
        </div>
      )}

      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 150,
        }}
        className="w-full h-full outline-none"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          minZoom={1}
          maxZoom={5}
          onMoveEnd={(position) => setPosition(position)}
        >
          <Geographies
            geography={
              isHighQuality
                ? "/countries/countries-high.json"
                : "/countries/countries-low.json"
            }
          >
            {memoizedGeographies}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {isHighQuality && <FPSCounter />}
    </div>
  );
}
