"use client";

import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  YAxis,
} from "recharts";

export default function FPSChart({ data }) {
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
