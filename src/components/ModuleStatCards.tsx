"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export type StatItem = {
  label: string;
  value: number | string;
  icon: LucideIcon;
};

type ModuleStatCardsProps = {
  items: StatItem[];
  loading?: boolean;
};

export default function ModuleStatCards({ items, loading }: ModuleStatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(({ label, value, icon: Icon }) => (
        <Card
          key={label}
          className="p-3 bg-white border border-[#E6F4ED] shadow-sm"
        >
          <CardContent className="flex justify-between items-center p-0">
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-[#0A5C36]">
                {loading ? "…" : value}
              </p>
            </div>
            <Icon className="w-5 h-5 text-[#0A5C36] opacity-80" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
