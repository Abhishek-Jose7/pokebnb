"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { HpBar } from "@/components/pokemon/HpBar";

export function AnalyticsDashboard({
  stats,
  domainData,
  scoreData,
}: {
  stats: Array<{ label: string; value: string | number; max?: number }>;
  domainData: Array<{ name: string; value: number }>;
  scoreData: Array<{ name: string; score: number }>;
}) {
  const colors = ["#FFCB05", "#3B4CCA", "#CC0000", "#3D7D3F", "#FF6B6B"];

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <PokemonCard key={stat.label} eyebrow="Pokedex Entry">
            <p className="text-sm text-slate-300">{stat.label}</p>
            <p className="mt-2 font-mono text-3xl text-poke-yellow">{stat.value}</p>
            {stat.max ? <div className="mt-3"><HpBar value={Number(stat.value)} max={stat.max} /></div> : null}
          </PokemonCard>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <PokemonCard title="Score Timeline" className="xl:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={scoreData}>
                <CartesianGrid stroke="#2A4A6A" />
                <XAxis dataKey="name" stroke="#A8A8A8" />
                <YAxis stroke="#A8A8A8" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#FFCB05" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PokemonCard>
        <PokemonCard title="Domain Types">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={domainData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {domainData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </PokemonCard>
      </div>
      <PokemonCard title="Team Power Comparison">
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={scoreData}>
              <CartesianGrid stroke="#2A4A6A" />
              <XAxis dataKey="name" stroke="#A8A8A8" />
              <YAxis stroke="#A8A8A8" />
              <Tooltip />
              <Bar dataKey="score" fill="#3B4CCA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </PokemonCard>
    </div>
  );
}
