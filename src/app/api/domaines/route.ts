import { NextResponse } from "next/server";

const BACKEND_URL = "http://127.0.0.1:8000/api/domaines/";

function mapFromBackend(d: any) {
  return { IdDom: d.id_dom, LibDom: d.lib_dom };
}

export async function GET() {
  try {
    const res = await fetch(BACKEND_URL, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: res.status });
    }
    const data = await res.json();
    const mapped = Array.isArray(data) ? data.map(mapFromBackend) : [];
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch domaines" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Expect { LibDom }
    const payload = { lib_dom: body.LibDom };
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Upstream error" }, { status: res.status });
    }
    const created = await res.json();
    return NextResponse.json(mapFromBackend(created), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create domaine" }, { status: 500 });
  }
}
