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
    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded">
      FPS: <span className={getFPSColor(fps)}>{fps}</span>
    </div>
  );
};

export default function WorldMap({ geoData, min, max }) {
  const { isHighQuality } = useGraphicsQuality();
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1.2 });

  const handleReset = useCallback(() => {
    setPosition({ coordinates: [0, 0], zoom: 1.2 });
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "r") {
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleReset]);

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
    <div className="relative w-screen h-screen">
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
              isHighQuality ? "/countries-high.json" : "/countries-low.json"
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
