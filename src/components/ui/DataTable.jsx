import { useMemo, useState, useEffect, useRef } from 'react'
import { Button } from './Button.jsx'
import { Input } from './Input.jsx'
import { Select } from './Input.jsx'
import { PAGE_SIZE_OPTIONS } from '../../utils/constants.js'
import { useDebounce } from '../../hooks/useDebounce.js'

function compare(a, b, key, dir) {
  const va = a[key]
  const vb = b[key]
  if (va == null && vb == null) return 0
  if (va == null) return 1
  if (vb == null) return -1
  if (typeof va === 'number' && typeof vb === 'number') {
    return dir === 'asc' ? va - vb : vb - va
  }
  const sa = String(va).toLowerCase()
  const sb = String(vb).toLowerCase()
  if (sa < sb) return dir === 'asc' ? -1 : 1
  if (sa > sb) return dir === 'asc' ? 1 : -1
  return 0
}

export function DataTable({
  columns,
  data,
  searchable = true,
  searchKeys,
  searchPlaceholder = 'Search…',
  searchAriaLabel,
  filterKey,
  filterOptions,
  emptyMessage = 'No rows match your filters.',
  initialSort = null,
  debounceMs = 300,
  entityLabelPlural = 'rows',
  selection = null,
  bulkActions = null,
}) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, debounceMs)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState(initialSort)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const rowIdKey = selection?.rowIdKey ?? 'id'
  const selectedIds = selection?.selectedIds ?? []
  const onSelectionChange = selection?.onChange

  useEffect(() => {
    queueMicrotask(() => setPage(1))
  }, [debouncedSearch, filter])

  const keys = searchKeys || columns.map((c) => c.key).filter(Boolean)

  const processed = useMemo(() => {
    let rows = [...data]
    const q = debouncedSearch.trim().toLowerCase()
    if (q && searchable) {
      rows = rows.filter((row) =>
        keys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)),
      )
    }
    if (filterKey && filter !== 'all') {
      rows = rows.filter((row) => String(row[filterKey]) === filter)
    }
    if (sort?.key) {
      rows.sort((a, b) => compare(a, b, sort.key, sort.dir))
    }
    return rows
  }, [data, debouncedSearch, filter, sort, keys, searchable, filterKey])

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const pageRows = processed.slice(start, start + pageSize)

  const pageIds = pageRows.map((r) => String(r[rowIdKey]))
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id))
  const somePageSelected = pageIds.some((id) => selectedIds.includes(id))

  const toggleSort = (key) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' }
      if (prev.dir === 'asc') return { key, dir: 'desc' }
      return null
    })
    setPage(1)
  }

  const toggleRow = (id) => {
    if (!onSelectionChange) return
    const sid = String(id)
    if (selectedIds.includes(sid)) {
      onSelectionChange(selectedIds.filter((x) => x !== sid))
    } else {
      onSelectionChange([...selectedIds, sid])
    }
  }

  const toggleAllPage = () => {
    if (!onSelectionChange) return
    if (allPageSelected) {
      onSelectionChange(selectedIds.filter((id) => !pageIds.includes(id)))
    } else {
      onSelectionChange([...new Set([...selectedIds, ...pageIds])])
    }
  }

  const colCount = columns.length + (selection ? 1 : 0)
  const end = processed.length === 0 ? 0 : Math.min(start + pageSize, processed.length)

  const selectAllRef = useRef(null)
  useEffect(() => {
    const el = selectAllRef.current
    if (el) el.indeterminate = somePageSelected && !allPageSelected
  }, [somePageSelected, allPageSelected])

  return (
    <div>
      <div className="data-table-toolbar">
        {searchable && (
          <div className="data-table-toolbar__search">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={searchAriaLabel || searchPlaceholder}
            />
          </div>
        )}
        {filterOptions && filterKey && (
          <div className="data-table-toolbar__filter">
            <Select
              aria-label="Filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
                setPage(1)
              }}
            >
              <option value="all">All</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        )}
        {selection && bulkActions && selectedIds.length > 0 && (
          <div className="data-table-toolbar__bulk">{bulkActions}</div>
        )}
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {selection && (
                <th className="data-table__th-check">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="data-table__checkbox"
                    checked={allPageSelected}
                    onChange={toggleAllPage}
                    aria-label="Select all on this page"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key || col.id}
                  className={col.sortable ? 'th--sortable' : undefined}
                  onClick={() => col.sortable && col.key && toggleSort(col.key)}
                >
                  <span className="th-sort-inner">
                    {col.header}
                    {col.sortable && sort?.key === col.key && (
                      <span aria-hidden>{sort.dir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="data-table__empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row, ri) => {
                const rid = String(row[rowIdKey] ?? ri)
                return (
                  <tr key={rid}>
                    {selection && (
                      <td>
                        <input
                          type="checkbox"
                          className="data-table__checkbox"
                          checked={selectedIds.includes(rid)}
                          onChange={() => toggleRow(rid)}
                          aria-label={`Select row ${rid}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key || col.id}>{col.render ? col.render(row) : row[col.key]}</td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="data-table-footer">
        <span>
          Showing {processed.length === 0 ? 0 : start + 1}–{end} of {processed.length} {entityLabelPlural}
        </span>
        <div className="data-table-footer__controls">
          <label className="data-table-footer__pagesize">
            Rows
            <select
              className="data-table-footer__select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="data-table-footer__nav">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
