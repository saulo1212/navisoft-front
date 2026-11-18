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
import { Button, Col, FormControl, Row } from 'react-bootstrap'
import { sampleData, SampleType } from './data'
import RecordEditModal from './RecordEditModal'

const columnHelper = createColumnHelper<SampleType>()

const ManageRecords = () => {
  const [data, setData] = useState<SampleType[]>(() => [...sampleData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<SampleType | null>(null)

  const handleCreateOpen = () => {
    setEditingRecord(null)
    setModalOpen(true)
  }

  const handleEditOpen = (rowRecord: SampleType) => {
    setEditingRecord(rowRecord)
    setModalOpen(true)
  }

  const handleDeleteRow = (id: number) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setData((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleModalFormSubmit = (formData: any) => {
    if (formData.rowId === 'new') {
      const newRecord: SampleType = {
        id: Math.floor(100000 + Math.random() * 900000),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        salary: Number(formData.salary) || 0,
        department: formData.department,
        position: 'Developer',
        joinDate: formData.joinDate,
        active: formData.active,
        status: formData.status,
      }
      setData((prev) => [newRecord, ...prev])
    } else {
      setData((prev) =>
        prev.map((item) =>
          item.id === formData.rowId
            ? {
                ...item,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                salary: Number(formData.salary) || 0,
                department: formData.department,
                joinDate: formData.joinDate,
                active: formData.active,
                status: formData.status,
              }
            : item,
        ),
      )
    }
  }

  const columns = [
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('name', { header: 'Name' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('phone', { header: 'Phone' }),
    columnHelper.accessor('salary', {
      header: 'Salary',
      cell: ({ row }) => <span>${row.original.salary.toLocaleString()}</span>,
    }),
    columnHelper.accessor('department', { header: 'Department' }),
    columnHelper.accessor('joinDate', {
      header: 'Join Date',
      cell: ({ row }) => {
        const dateStr = row.original.joinDate
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return <span>{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`}</span>
      },
    }),
    columnHelper.accessor('active', {
      header: 'Active',
      cell: ({ row }) => {
        const isActive = row.original.active
        const badgeClass = isActive ? 'bg-success' : 'bg-danger'
        return <span className={`badge ${badgeClass}`}>{isActive ? 'Yes' : 'No'}</span>
      },
    }),
    columnHelper.accessor('status', { header: 'Status' }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="d-flex gap-1 justify-content-start align-items-center">
          <button type="button" className="btn btn-primary btn-xs edit-btn" onClick={() => handleEditOpen(row.original)}>
            Edit
          </button>
          <button type="button" className="btn btn-danger btn-xs delete-btn" onClick={() => handleDeleteRow(row.original.id)}>
            Del
          </button>
        </div>
      ),
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
        <Row className="st-toolbar mb-4 align-items-center justify-content-between">
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
          <Col className="d-flex justify-content-end gap-2">
            <Button variant="outline-success" className="btn-sm d-flex align-items-center gap-1" onClick={handleCreateOpen}>
              Add Record
            </Button>
          </Col>
        </Row>

        <DataTable<SampleType> table={table} emptyMessage="No records found" />

        <TablePagination
          totalItems={totalItems}
          start={start}
          end={end}
          itemsName="entries"
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

      <RecordEditModal
        modalId="recordModal"
        title={editingRecord ? 'Edit Record' : 'Add New Record'}
        submitButtonText={editingRecord ? 'Save Changes' : 'Add Record'}
        cancelButtonText="Cancel"
        rowId={editingRecord ? editingRecord.id : 'new'}
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        initialData={editingRecord || undefined}
        onSubmit={handleModalFormSubmit}
      />
    </div>
  )
}

export default ManageRecords
