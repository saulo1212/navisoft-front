'use client'
import DataTable from '@/components/table/DataTable'
import TablePagination from '@/components/table/TablePagination'
import { basePath } from '@/helpers'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Col, FormControl, Row } from 'react-bootstrap'
import { minimalData, MinimalType } from './data'

const columnHelper = createColumnHelper<MinimalType>()

const MinimalTable = () => {
  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        const badgeClass = status === 'Active' ? 'bg-success' : status === 'Inactive' ? 'bg-secondary' : 'bg-warning text-dark'

        return <span className={`badge ${badgeClass}`}>{status}</span>
      },
    }),
    columnHelper.accessor('due', {
      header: 'Due',
    }),
  ]

  const [data] = useState<MinimalType[]>(() => [...minimalData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    enableColumnFilters: true,
    enableRowSelection: true,
  })

  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const totalItems = table.getFilteredRowModel().rows.length

  const start = totalItems === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min(start + pageSize - 1, totalItems)

  return (
    <div className="panel-content">
      <div className="st-wrapper">
        <Row className="st-toolbar mb-4">
          <Col xs={12} sm={6} lg={6} xl={5} xxl={4} className="order-1 order-sm-0 mt-4 mt-sm-0">
            <div className="st-search-wrapper">
              <div className="input-group flex-nowrap" role="search">
                <span className="input-group-text px-2" id="search-icon">
                  <svg className="sa-icon sa-bold">
                    <use href={`${basePath}/icons/sprite.svg#search`}></use>
                  </svg>
                </span>
                <FormControl
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  aria-label="Search input"
                  autoComplete="off"
                />
              </div>
            </div>
          </Col>
        </Row>

        <DataTable<MinimalType> table={table} emptyMessage="No records found" />

        <TablePagination
          totalItems={totalItems}
          start={start}
          end={end}
          itemsName="records"
          showInfo
          previousPage={table.previousPage}
          canPreviousPage={table.getCanPreviousPage()}
          pageCount={table.getPageCount()}
          pageIndex={table.getState().pagination.pageIndex}
          setPageIndex={table.setPageIndex}
          nextPage={table.nextPage}
          canNextPage={table.getCanNextPage()}
          pageSize={table.getState().pagination.pageSize}
          onPageSizeChange={table.setPageSize}
          showPageLimit
        />
      </div>
    </div>
  )
}

export default MinimalTable
