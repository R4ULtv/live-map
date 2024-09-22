"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { getCountryData } from "countries-list";
import { MapPinIcon } from "@heroicons/react/16/solid";

import { useGraphicsQuality } from "@/components/providers/GraphicsQualityContext";
import { useCommandMenu } from "@/components/providers/CommandMenuContext";
import FPSChart from "@/components/ui/FPSChart";

const FPSCounter = () => {
  const [fps, setFps] = useState(0);
  const [avgFps, setAvgFps] = useState(0);
  const [historyFps, setHistoryFps] = useState([]);

  const updateFPS = useCallback(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let totalFps = 0;
    let fpsUpdateCount = 0;

    const animate = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime > 1000) {
        const currentFps = Math.round((frameCount * 1000) / (now - lastTime));
        setFps(currentFps);
        setHistoryFps((prevData) => {
          const newData = [...prevData, { time: Date.now(), fps: currentFps }];
          return newData.filter((d) => Date.now() - d.time <= 30000);
        });
        totalFps += currentFps;
        fpsUpdateCount++;
        setAvgFps(Math.round(totalFps / fpsUpdateCount));
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const cleanup = updateFPS();
    return cleanup;
  }, [updateFPS]);

  const getFPSColor = (fps) => {
    if (fps >= 60) return "text-emerald-400";
    if (fps >= 30) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="absolute top-3 right-3 flex flex-col items-center justify-center gap-1 z-50">
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 text-zinc-200 shadow p-1 select-none">
        <div className="flex items-center justify-center gap-1 w-full">
          <div className="py-1 px-2 hover:bg-zinc-800 rounded-xl outline-none text-xs text-zinc-200">
            Fps:{" "}
            <span className={"font-semibold " + getFPSColor(fps)}>{fps}</span>
          </div>
          <div className="w-px h-5 bg-zinc-700"></div>
          <div className="py-1 px-2 hover:bg-zinc-800 rounded-xl outline-none text-xs text-zinc-200">
            Avg Fps:{" "}
            <span className={"font-semibold " + getFPSColor(avgFps)}>
              {avgFps}
            </span>
          </div>
        </div>
        <div className="w-full h-px bg-zinc-700 mt-1 mb-2"></div>
        <FPSChart data={historyFps} />
      </div>
    </div>
  );
};

export default function WorldMap({ geoData, min, max, requestInfo }) {
  const [hoverCountry, setHoverCountry] = useState(null);
  const [hoverPing, setHoverPing] = useState(null);

  const { isHighQuality } = useGraphicsQuality();
  const { setSelectedCountry, setIsRequestInfoOpen, isShowFps } =
    useCommandMenu();

  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1.2 });

  const handleReset = useCallback(() => {
    setPosition({ coordinates: [0, 0], zoom: 1.2 });
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        handleReset();
      } else if (e.key === "Enter" && hoverCountry) {
        e.preventDefault();
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
          className="outline-none select-none stroke-0.5 stroke-zinc-800 hover:fill-emerald-500 hover:cursor-pointer"
          tabIndex={-1}
          onMouseEnter={() => setHoverCountry(geo.properties.Alpha2 || null)}
          onMouseLeave={() => setHoverCountry(null)}
        />
      ));
  }, [getColor, setHoverCountry]);

  return (
    <div className="relative w-screen h-screen">
      {hoverCountry !== null && (
        <div className="absolute top-3 left-0 right-0 flex items-center justify-center z-50">
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
      {hoverPing !== null && (
        <div className="absolute top-5 left-0 right-0 flex items-center justify-center z-50">
          <div className="rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 shadow flex items-center p-1">
            <div className="py-1 px-2 rounded-full outline-none flex items-center gap-1">
              <MapPinIcon className="size-5 text-rose-500" />
              <span className="text-zinc-200 text-sm">
                {requestInfo.city || requestInfo.country} ({requestInfo.country}
                )
              </span>
            </div>
          </div>
        </div>
      )}

      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 270,
        }}
        className="w-full h-full outline-none"
        width={1920}
        height={1080}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          minZoom={1.2}
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
          {requestInfo && (
            <Marker
              coordinates={[requestInfo.longitude, requestInfo.latitude]}
              onClick={() => setIsRequestInfoOpen(true)}
              onMouseEnter={() => setHoverPing(requestInfo.country)}
              onMouseLeave={() => setHoverPing(null)}
            >
              <path
                className="-translate-y-5 -translate-x-2.5 fill-rose-500 stroke-0.5 stroke-zinc-800 hover:cursor-pointer"
                viewBox="0 0 20 20"
                fillRule="evenodd"
                clipRule="evenodd"
                d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
              />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
      {isShowFps && <FPSCounter />}
    </div>
  );
}
