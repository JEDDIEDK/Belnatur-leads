"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function VolumeChart({ data }: { data: { day: string; leads: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leadflow denne uge</CardTitle>
        <CardDescription>Diskret overblik over indkomne leads dag for dag.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="leadGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.55} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(120,95,75,0.12)" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip />
            <Area type="monotone" dataKey="leads" stroke="hsl(var(--chart-1))" fill="url(#leadGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CampaignChart({
  data
}: {
  data: { name: string; leads: number; booked: number; conversion: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kampagneperformance</CardTitle>
        <CardDescription>Hvilke kampagner driver flest bookinger og den bedste konvertering.</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="rgba(120,95,75,0.12)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="leads" radius={[10, 10, 0, 0]} fill="hsl(var(--chart-2))" />
            <Bar dataKey="booked" radius={[10, 10, 0, 0]} fill="hsl(var(--chart-3))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
