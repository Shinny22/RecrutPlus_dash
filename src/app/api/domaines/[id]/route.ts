import { NextResponse } from "next/server";
import { API_ENDPOINTS, apiUrl } from "@/lib/api";

const BASE_URL = apiUrl(API_ENDPOINTS.domaines);

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`${BASE_URL}${id}/`, { method: "DELETE" });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Upstream error" }, { status: res.status });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete domaine" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const payload = { lib_dom: body.LibDom };
    const res = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Upstream error" }, { status: res.status });
    }
    const updated = await res.json();
    return NextResponse.json({ IdDom: updated.id_dom, LibDom: updated.lib_dom });
  } catch {
    return NextResponse.json({ error: "Failed to update domaine" }, { status: 500 });
  }
}

