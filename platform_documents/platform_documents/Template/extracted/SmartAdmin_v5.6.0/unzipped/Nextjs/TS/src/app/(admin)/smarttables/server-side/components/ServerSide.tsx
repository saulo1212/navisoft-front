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
import { Col, FormControl, ProgressBar, Row } from 'react-bootstrap'
import { sampleData, SampleType } from './data'

const columnHelper = createColumnHelper<SampleType>()

const ServerSide = () => {
  const [data] = useState<SampleType[]>(() => [...sampleData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('age', {
      header: 'Age',
    }),
    columnHelper.accessor('salary', {
      header: 'Salary',
      cell: ({ row }) => {
        const salary = Number(row.original.salary)
        if (isNaN(salary)) return <span>$0.00</span>
        return (
          <span>
            {salary.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        )
      },
    }),
    columnHelper.accessor('bonus', {
      header: 'Bonus',
      cell: ({ row }) => {
        const bonus = Number(row.original.bonus) || 0
        const formattedBonus = bonus.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })

        return bonus < 3000 ? <span className="text-danger fw-bold">{formattedBonus}</span> : <span>{formattedBonus}</span>
      },
    }),
    columnHelper.accessor('performance', {
      header: 'Performance',
      cell: ({ row }) => {
        const performance = Math.min(Math.max(parseInt(row.original.performance as any), 1), 100)

        let variant: 'danger' | 'warning' | 'success' | string = 'success'
        let customClass = ''

        if (performance < 30) {
          variant = 'danger'
        } else if (performance > 70) {
          customClass = 'bg-success-700'
        } else if (performance >= 50 && performance <= 70) {
          customClass = 'bg-success-500'
        } else {
          variant = 'warning'
          customClass = 'text-dark'
        }

        return (
          <div style={{ width: '100%' }}>
            <ProgressBar now={performance} label={`${performance}%`} variant={variant as any} className={customClass} style={{ height: '20px' }} />
          </div>
        )
      },
    }),
    columnHelper.accessor('department', {
      header: 'Department',
    }),
    columnHelper.accessor('hire_date', {
      header: 'Hired',
    }),
    columnHelper.accessor('overtime_hours', {
      header: 'Overtime Hrs',
      cell: ({ row }) => {
        const hours = Number(row.original.overtime_hours) || 0
        const maxHours = 50

        let variant: 'success' | 'warning' | 'danger' = 'success'
        let textClass = ''

        if (hours > 40) {
          variant = 'danger'
        } else if (hours > 20) {
          variant = 'warning'
          textClass = 'text-dark'
        }

        return (
          <div style={{ width: '100%' }}>
            <ProgressBar now={(hours / maxHours) * 100} label={`${hours} hrs`} variant={variant} className={textClass} style={{ height: '20px' }} />
          </div>
        )
      },
    }),
    columnHelper.accessor('projects_completed', {
      header: 'Completed',
    }),
    columnHelper.accessor('satisfaction_score', {
      header: 'Score',
      cell: ({ row }) => {
        let score = Number(row.original.satisfaction_score) || 0
        score = Math.min(Math.max(score, 0), 10)

        let badgeClass = ''
        let label = ''

        if (score <= 2) {
          badgeClass = 'bg-danger-300 bg-danger'
          label = 'Poor'
        } else if (score <= 4) {
          badgeClass = 'bg-warning-300 bg-warning text-dark'
          label = 'Fair'
        } else if (score <= 6) {
          badgeClass = 'bg-success-400 bg-info'
          label = 'Average'
        } else if (score <= 8) {
          badgeClass = 'bg-success-500 bg-success'
          label = 'Good'
        } else {
          badgeClass = 'bg-success-700 bg-success fw-bold'
          label = 'Excellent'
        }

        return <span className={`badge ${badgeClass}`}>{`${label} (${score})`}</span>
      },
    }),
    columnHelper.accessor('remote_work_days', {
      header: 'Remote Work Days',
    }),
    columnHelper.accessor('training_hours', {
      header: 'Training Hrs',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
  ]

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

 <div
          className="w-100 custom-scrollbar"
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            display: 'block',
            marginBottom: '1rem',
          }}>

        <DataTable<SampleType> table={table} emptyMessage="No records found" />
          </div>

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

export default ServerSide
