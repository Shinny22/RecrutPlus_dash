"use client";
// FIX: To resolve "Cannot find module 'recharts' or its corresponding type declarations.",
// please ensure 'recharts' and '@types/recharts' are installed in your project:
// npm install recharts @types/recharts
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  month: string;
  recruits: number;
}

const data: ChartData[] = [
  { month: "Jan", recruits: 10 },
  { month: "Fév", recruits: 35 },
  { month: "Mar", recruits: 45 },
  { month: "Avr", recruits: 30 },
  { month: "Mai", recruits: 55 },
];

export default function DashboardChart() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Recrutements (6 mois)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="recruits" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
