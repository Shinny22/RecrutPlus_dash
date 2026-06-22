import { NextResponse } from "next/server";

type Diplome = {
  IdDiplome: number;
  Designation: string;
  IdDom: number;
};

const fakeDiplomes: Diplome[] = [
  { IdDiplome: 1, Designation: "Licence Informatique", IdDom: 1 },
  { IdDiplome: 2, Designation: "Master Droit", IdDom: 2 },
];

// GET → liste des diplômes
export async function GET() {
  return NextResponse.json(fakeDiplomes);
}

// POST → ajouter un diplôme
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.Designation || !body.IdDom) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const newDiplome: Diplome = {
    IdDiplome: Date.now(),
    Designation: body.Designation,
    IdDom: body.IdDom,
  };

  fakeDiplomes.push(newDiplome);

  return NextResponse.json({ success: true, data: newDiplome }, { status: 201 });
}
