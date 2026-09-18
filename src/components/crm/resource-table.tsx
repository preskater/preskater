"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type ResourceColumn<T> = {
  key: string
  header: string
  cell: (row: T) => React.ReactNode
  sortValue?: (row: T) => string | number
  headerClassName?: string
  cellClassName?: string
}

type ResourceTableProps<T extends { id: string }> = {
  rows: T[]
  columns: ResourceColumn<T>[]
  searchPlaceholder?: string
  emptyMessage?: string
  pageSize?: number
  getSearchText?: (row: T) => string
  toolbar?: React.ReactNode
  rowHref?: (row: T) => string
}

export function ResourceTable<T extends { id: string }>({
  rows,
  columns,
  searchPlaceholder = "Rechercher…",
  emptyMessage = "Aucun résultat.",
  pageSize = 10,
  getSearchText,
  toolbar,
  rowHref,
}: ResourceTableProps<T>) {
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)

  const filtered = React.useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return rows
    return rows.filter((row) => {
      if (getSearchText) return getSearchText(row).toLowerCase().includes(text)
      return Object.values(row as Record<string, unknown>).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(text)
      )
    })
  }, [rows, query, getSearchText])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const pageRows = filtered.slice(start, start + pageSize)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 lg:px-6">
        <div className="relative w-full max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder={searchPlaceholder}
            className="pl-8"
          />
        </div>
        {toolbar}
      </div>

      <div className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.headerClassName}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column, index) => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          column.cellClassName,
                          index === 0 && rowHref && "font-medium"
                        )}
                      >
                        {rowHref && index === 0 ? (
                          <Link
                            href={rowHref(row)}
                            className="underline-offset-4 hover:underline"
                          >
                            {column.cell(row)}
                          </Link>
                        ) : (
                          column.cell(row)
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between gap-2 px-4 lg:px-6">
          <p className="text-sm text-muted-foreground">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""} · page{" "}
            {currentPage} sur {pageCount}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeftIcon />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
              disabled={currentPage >= pageCount}
            >
              Suivant
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
