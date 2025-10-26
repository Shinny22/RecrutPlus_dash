import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardCards() {
  const stats = [
    { title: "Candidats", value: "250" },
    { title: "Demandes", value: "89" },
    { title: "Campagnes", value: "12" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((s) => (
        <Card key={s.title} className="shadow-md">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">{s.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
