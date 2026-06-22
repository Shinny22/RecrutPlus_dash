"use client";

import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileDown, FileUp, FileSpreadsheet, Search } from "lucide-react";

type DataTableToolbarProps = {
  title?: string;
  searchPlaceholder?: string;
  query: string;
  onQueryChange: (value: string) => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onImportExcel?: (file: File) => void;
  filteredCount: number;
  totalCount: number;
  children?: React.ReactNode;
};

export default function DataTableToolbar({
  title,
  searchPlaceholder = "Rechercher…",
  query,
  onQueryChange,
  onExportExcel,
  onExportPdf,
  onImportExcel,
  filteredCount,
  totalCount,
  children,
}: DataTableToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportExcel) {
      onImportExcel(file);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {title && (
        <h2 className="text-xl md:text-2xl font-bold text-[#0A5C36]">{title}</h2>
      )}

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="pl-9 border-[#E6F4ED] focus:border-[#0A5C36]"
            />
          </div>
          {children}
        </div>

        <div className="flex flex-wrap gap-2">
          {onImportExcel && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-[#0A5C36] text-[#0A5C36] hover:bg-[#E9F7F0]"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="w-4 h-4 mr-1" />
                Importer Excel
              </Button>
            </>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
            onClick={onExportExcel}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1" />
            Excel
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-red-600 text-red-700 hover:bg-red-50"
            onClick={onExportPdf}
          >
            <FileDown className="w-4 h-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        {filteredCount} résultat{filteredCount !== 1 ? "s" : ""} sur {totalCount}
      </p>
    </div>
  );
}
