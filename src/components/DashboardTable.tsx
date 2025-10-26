import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rows = [
  { id: "#001", candidat: "Jean Dupont", poste: "Dev", status: "En attente" },
  { id: "#002", candidat: "Marie Curie", poste: "Data", status: "Acceptée" },
  { id: "#003", candidat: "Paul Simon", poste: "Ops", status: "Refusée" },
];

export default function DashboardTable() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Dernières demandes</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Candidat</th>
              <th className="p-2 text-left">Poste</th>
              <th className="p-2 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.candidat}</td>
                <td className="p-2">{r.poste}</td>
                <td className="p-2">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
