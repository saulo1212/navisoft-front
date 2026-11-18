'use client'
import DataTable from '@/components/table/DataTable'
import TablePagination from '@/components/table/TablePagination'
import { basePath } from '@/helpers'
import {
  createColumnHelper,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Col, FormControl, Row } from 'react-bootstrap'
import { responsiveData, ResponsiveType } from './data'

const columnHelper = createColumnHelper<ResponsiveType>()

const ResponsiveTable = () => {
  const [data] = useState<ResponsiveType[]>(() => [...responsiveData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const columns = [
    columnHelper.accessor('id', {
      header: 'TradeID',
    }),
    columnHelper.accessor('symbol', {
      header: 'Symbol',
    }),
    columnHelper.accessor('qty', {
      header: 'Qty',
    }),
    columnHelper.accessor('buyPrice', {
      header: 'BuyPrice',
    }),
    columnHelper.accessor('sellPrice', {
      header: 'SellPrice',
    }),
    columnHelper.accessor('buyDate', {
      header: 'BuyDate',
    }),
    columnHelper.accessor('sellDate', {
      header: 'SellDate',
    }),
    columnHelper.accessor('profit', {
      header: 'Profit',
      cell: ({ row }) => {
        const profit = row.original.profit
        const isNegative = profit.startsWith('-')
        return <span className={isNegative ? 'text-danger' : 'text-success'}>{profit}</span>
      },
    }),
    columnHelper.accessor('fee', {
      header: 'Fee',
    }),
    columnHelper.accessor('net', {
      header: 'Net',
      cell: ({ row }) => {
        const net = row.original.net
        const isNegative = net.startsWith('-')
        return <span className={isNegative ? 'text-danger fw-500' : 'text-success fw-500'}>{net}</span>
      },
    }),
    columnHelper.accessor('broker', {
      header: 'Broker',
    }),
    columnHelper.accessor('type', {
      header: 'Type',
    }),
    columnHelper.accessor('sector', {
      header: 'Sector',
      cell: ({ row }) => <span>{row.original.sector === 'null' ? '—' : row.original.sector}</span>,
    }),
    columnHelper.accessor('industry', {
      header: 'Industry',
      cell: ({ row }) => <span>{row.original.industry === 'null' ? '—' : row.original.industry}</span>,
    }),
    columnHelper.accessor('marketCap', {
      header: 'MktCap',
    }),
    columnHelper.accessor('divYield', {
      header: 'DivYield',
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination, expanded },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
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

        <div
          className="w-100 custom-scrollbar"
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            display: 'block',
            marginBottom: '1rem',
          }}>
          <DataTable<ResponsiveType>
            table={table}
            emptyMessage="No records found"
            renderRowDetails={({ row }) => (
              <div className="p-3 text-start bg-dark border border-secondary text-light custom-subrow-box">
                <div className="mb-1">
                  <strong>DivYield:</strong> {row.original.divYield}
                </div>
                <div className="mb-1">
                  <strong>MktCap:</strong> {row.original.marketCap}
                </div>
                <div className="mb-1">
                  <strong>Industry:</strong> {row.original.industry}
                </div>
                <div className="mb-1">
                  <strong>Sector:</strong> {row.original.sector}
                </div>
              </div>
            )}
          />
        </div>

        <TablePagination
          totalItems={totalItems}
          start={start}
          end={end}
          itemsName="trades"
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

export default ResponsiveTable
