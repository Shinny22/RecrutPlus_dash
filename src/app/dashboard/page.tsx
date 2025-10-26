
// }



"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableRow, TableHead, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { Calendar, Users as UsersIcon, Briefcase, Award, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardSymphos() {
  const [query, setQuery] = useState("");

  const stats = [
    { title: "Domaines", value: 8, icon: <Briefcase className="w-6 h-6 text-green-600" /> },
    { title: "Diplômes", value: 12, icon: <Award className="w-6 h-6 text-green-600" /> },
    { title: "Candidats", value: 250, icon: <Users className="w-6 h-6 text-green-600" /> },
    { title: "Demandes", value: 35, icon: <FileText className="w-6 h-6 text-green-600" /> },
  ];

  const candidates = [
    { id: 1, name: "Ivick BATCHIMBA", email: "ivick@example.com" },
    { id: 2, name: "Nissi OYERE", email: "shinny@example.com" },
    { id: 3, name: "Jean M.", email: "jean@example.com" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Tableau de bord <span className="text-green-600">CFI-CIRAS</span>
          </h1>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <Input
              placeholder="Rechercher un candidat"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-[250px] border-green-300 focus:border-green-500 focus:ring focus:ring-green-200"
            />
            <Avatar className="border border-gray-300">
              <AvatarImage src="/avatar.jpg" alt="avatar" />
              <AvatarFallback>Ad</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="flex flex-col justify-between p-5 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl bg-white border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-green-600">{stat.icon}</span>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-gray-700 font-medium">{stat.title}</p>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="overflow-visible shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Candidats</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="rounded-lg border border-gray-200">
              <TableHeader>
                <TableRow className="bg-green-50">
                  <TableHead>ID</TableHead>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => (
                  <TableRow
                    key={c.id}
                    className="hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Separator />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50 transition"
          >
            <Calendar className="w-5 h-5" /> Calendrier
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50 transition"
          >
            <UsersIcon className="w-5 h-5" /> Utilisateurs
          </Button>
        </div>
      </main>
    </div>
  );
}
