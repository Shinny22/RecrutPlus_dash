"use client";

import { useEffect, useMemo, useState } from "react";

type UseDataTableOptions<T> = {
  pageSize?: number;
  searchKeys?: (keyof T)[];
  filterFn?: (item: T) => boolean;
};

export function useDataTable<T extends object>(
  data: T[],
  options: UseDataTableOptions<T> = {}
) {
  const { pageSize: initialPageSize = 10, searchKeys = [], filterFn } = options;

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filtered = useMemo(() => {
    let result = [...data];

    if (query.trim() && searchKeys.length > 0) {
      const q = query.toLowerCase().trim();
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const val = (item as Record<string, unknown>)[key as string];
          return val != null && String(val).toLowerCase().includes(q);
        })
      );
    }

    if (filterFn) {
      result = result.filter(filterFn);
    }

    return result;
  }, [data, query, searchKeys, filterFn]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, pageSize, filterFn]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return {
    query,
    setQuery,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize,
    filtered,
    paginated,
    totalPages,
    total: data.length,
    filteredCount: filtered.length,
  };
}
