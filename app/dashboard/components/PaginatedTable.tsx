"use client";
import { useState } from "react";

type PaginatedTableProps<T> = {
  data: T[];
  totalItems?: number;
  currentPage?: number;
  defaultRows?: number;
  rowsPerPageOptions?: number[];
  onPageChange?: (page: number) => void;
  onRowsChange?: (rows: number) => void;
  renderRow: (item: T) => JSX.Element;
};

export default function PaginatedTable<T>({
  data,
  totalItems,
  currentPage: externalPage,
  defaultRows = 10,
  rowsPerPageOptions = [10, 20, 50],
  onPageChange,
  onRowsChange,
  renderRow,
}: PaginatedTableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRows);

  const currentPage = externalPage ?? internalPage;
  const total = totalItems ?? data.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData =
    totalItems && totalItems > data.length
      ? data
      : data.slice(startIdx, startIdx + rowsPerPage);

  const handlePageChange = (num: number) => {
    if (num < 1 || num > totalPages) return;
    if (onPageChange) onPageChange(num);
    else setInternalPage(num);
  };

  const handleRowsChange = (value: number) => {
    setRowsPerPage(value);
    if (onRowsChange) onRowsChange(value);
    handlePageChange(1);
  };

  const visiblePages = (() => {
    const pages: (number | string)[] = [];
    const delta = 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(2, currentPage - delta);
      const right = Math.min(totalPages - 1, currentPage + delta);

      pages.push(1);
      if (left > 2) pages.push("…");
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  })();

  return (
    <>
      {/* Rows */}
      {paginatedData.map(renderRow)}

      {/* Pagination bar inside table (right-aligned) */}
      {total > rowsPerPage && (
        <tr>
          <td colSpan={999} className="p-2">
            <div className="flex justify-end items-center gap-3">
              {/* Rows per page */}
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <span>Rows:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => handleRowsChange(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {rowsPerPageOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Range */}
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {startIdx + 1}-{Math.min(startIdx + rowsPerPage, total)} of {total}
              </span>

              {/* Buttons */}
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                  ‹
                </button>
                {visiblePages.map((num, i) =>
                  num === "…" ? (
                    <span key={i} className="px-2 text-gray-500">
                      …
                    </span>
                  ) : (
                    <button
                      key={num}
                      onClick={() => handlePageChange(num as number)}
                      className={`px-3 py-1 border rounded-md text-sm font-medium ${
                        currentPage === num
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                  ›
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
