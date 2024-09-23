"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  YAxis,
} from "recharts";

export const FPSCounter = () => {
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
function FPSChart({ data }) {
  const fpsData = data.map((d) => d.fps);
  const minFPS = Math.min(...fpsData);
  const maxFPS = Math.max(...fpsData);

  return (
    <div className="w-full h-16">
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
            stroke="rgb(228 228 231 / 0.5)"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={60}
            stroke="rgb(228 228 231 / 0.5)"
            strokeDasharray="3 3"
          />

          {maxFPS > 60 && (
            <ReferenceLine
              y={maxFPS}
              stroke="rgb(228 228 231 / 0.5)"
              strokeDasharray="3 3"
            />
          )}
          <Line
            type="monotone"
            dataKey="fps"
            stroke="#e4e4e7"
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
