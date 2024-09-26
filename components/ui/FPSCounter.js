"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { useCommandMenu } from "@/components/providers/CommandMenuContext";
import { Transition } from "@headlessui/react";

export const FPSCounter = () => {
  const { isShowFps, fpsPosition } = useCommandMenu();
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
    if (fps >= 60) return "text-emerald-500";
    if (fps >= 30) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <Transition show={!!isShowFps}>
      <div
        className={`absolute transform transition duration-150 ease-in-out data-[closed]:opacity-0 data-[closed]:scale-50
          ${
            fpsPosition === "bottom-right"
              ? "bottom-3 right-3"
              : fpsPosition === "bottom-left"
              ? "bottom-3 left-3"
              : fpsPosition === "top-left"
              ? "top-3 left-3"
              : "top-3 right-3"
          }`}
      >
        <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 shadow p-1 select-none">
          <div className="flex items-center justify-center gap-1 w-full">
            <div className="py-1 px-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg outline-none text-xs">
              Fps:{" "}
              <span className={"font-semibold " + getFPSColor(fps)}>{fps}</span>
            </div>
            <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700" />
            <div className="py-1 px-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg outline-none text-xs">
              Avg Fps:{" "}
              <span className={"font-semibold " + getFPSColor(avgFps)}>
                {avgFps}
              </span>
            </div>
          </div>
          <div className="w-full h-px bg-zinc-300 dark:bg-zinc-700 my-1" />
          <FPSChart data={historyFps} />
        </div>
      </div>
    </Transition>
  );
};

function FPSChart({ data }) {
  const { theme } = useTheme();
  const fpsData = data.map((d) => d.fps);
  const minFPS = Math.min(...fpsData);
  const maxFPS = Math.max(...fpsData);

  return (
    <div className="w-full h-16 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg p-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis
            orientation="left"
            width={18}
            domain={[minFPS, maxFPS]}
            ticks={[0, 30, 60, maxFPS > 60 && maxFPS]}
            tickSize={5}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => `${value}`}
          />
          <ReferenceLine
            y={30}
            stroke={
              theme === "dark"
                ? "rgb(228 228 231 / 0.5)"
                : "rgb(39 39 42 / 0.5)"
            }
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={60}
            stroke={
              theme === "dark"
                ? "rgb(228 228 231 / 0.5)"
                : "rgb(39 39 42 / 0.5)"
            }
            strokeDasharray="3 3"
          />

          {maxFPS > 60 && (
            <ReferenceLine
              y={maxFPS}
              stroke={
                theme === "dark"
                  ? "rgb(228 228 231 / 0.5)"
                  : "rgb(39 39 42 / 0.5)"
              }
              strokeDasharray="3 3"
            />
          )}
          <Line
            type="monotone"
            dataKey="fps"
            stroke={theme === "dark" ? "#e4e4e7" : "#27272a"}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            animateNewValues={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
