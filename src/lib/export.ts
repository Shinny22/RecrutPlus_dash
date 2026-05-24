/**
 * Export / import — les libs lourdes (xlsx, jspdf) sont chargées
 * uniquement au clic pour éviter les crashs mémoire au chargement des pages.
 */

export type ExportColumn = {
  key: string;
  label: string;
};

export function rowsForExport<T extends Record<string, unknown>>(
  items: T[],
  columns: ExportColumn[]
): Record<string, unknown>[] {
  return items.map((item) => {
    const row: Record<string, unknown> = {};
    for (const col of columns) {
      row[col.key] = item[col.key];
    }
    return row;
  });
}

export async function exportToExcel(
  rows: Record<string, unknown>[],
  filename: string,
  sheetName = "Données"
): Promise<void> {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export async function exportToPdf(
  rows: Record<string, unknown>[],
  columns: ExportColumn[],
  title: string,
  filename: string
): Promise<void> {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({
    orientation: columns.length > 5 ? "landscape" : "portrait",
  });
  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.text(`Généré le ${new Date().toLocaleString("fr-FR")}`, 14, 22);

  autoTable(doc, {
    head: [columns.map((c) => c.label)],
    body: rows.map((row) =>
      columns.map((c) => {
        const val = row[c.key];
        return val == null ? "" : String(val);
      })
    ),
    startY: 28,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [10, 92, 54] },
  });

  doc.save(`${filename}.pdf`);
}

export async function importFromExcel(
  file: File
): Promise<Record<string, unknown>[]> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];
}
