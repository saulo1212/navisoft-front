'use client';

import DataTable from '@/components/table/DataTable';
import TablePagination from '@/components/table/TablePagination';
import { basePath } from '@/helpers';
import { createColumnHelper, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormControl, OverlayTrigger, Popover, PopoverBody, Row, Spinner } from 'react-bootstrap';
import ImportModal from './ImportModal';
const columnHelper = createColumnHelper();
const JsonSource = ({
  importedData,
  onDataLoaded,
  onResetImport
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [defaultData, setDefaultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [expanded, setExpanded] = useState({});
  const activeData = useMemo(() => {
    return importedData !== null ? importedData : defaultData;
  }, [importedData, defaultData]);
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const res = await fetch(`${baseUrl}/json/smarttable-data.json`);
        if (!res.ok) {
          throw new Error('Failed to fetch smarttable source data');
        }
        const jsonData = await res.json();
        setDefaultData(jsonData);
      } catch (error) {
        console.error('Error fetching smarttable data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTableData();
  }, []);
  const formatHeaderLabel = key => {
    return key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
  };
  const columns = useMemo(() => {
    if (importedData && importedData.length > 0) {
      return Object.keys(importedData[0]).map(key => {
        return columnHelper.accessor(key, {
          id: key,
          header: formatHeaderLabel(key),
          cell: ({
            row
          }) => {
            const val = row.original[key];
            if (typeof val === 'object' && val !== null) {
              return <span>{JSON.stringify(val)}</span>;
            }
            return <span>{String(val ?? '—')}</span>;
          }
        });
      });
    }
    return [columnHelper.accessor('ID', {
      id: 'ID',
      header: 'ID',
      cell: ({
        row
      }) => <span className="fw-bold text-secondary">{row.original.ID}</span>
    }), columnHelper.accessor('FirstName', {
      id: 'FirstName',
      header: 'First Name'
    }), columnHelper.accessor('LastName', {
      id: 'LastName',
      header: 'Last Name'
    }), columnHelper.accessor('Gender', {
      id: 'Gender',
      header: 'Gender'
    }), columnHelper.accessor('Phone', {
      id: 'Phone',
      header: 'Phone'
    }), columnHelper.accessor('Status', {
      id: 'Status',
      header: 'Payment',
      cell: ({
        row
      }) => {
        const status = row.original.Status;
        let badgeClass = 'bg-secondary bg-opacity-20 text-secondary';
        if (status === 'Success' || status === 'Active') badgeClass = 'bg-success text-white';else if (status === 'Cash') badgeClass = 'bg-secondary text-white';else if (status === 'Pending') badgeClass = 'bg-warning text-dark';else if (status === 'Rejected') badgeClass = 'bg-danger text-white';
        return <span className={`badge ${badgeClass}`}>{status}</span>;
      }
    }), columnHelper.accessor('Due', {
      id: 'Due',
      header: 'Sales',
      cell: ({
        row
      }) => {
        const due = row.original.Due;
        const formattedValue = typeof due === 'number' ? due.toFixed(2) : due;
        return <span className="fw-medium">${formattedValue}</span>;
      }
    }), columnHelper.accessor('Product', {
      id: 'Product',
      header: 'Product',
      cell: ({
        row
      }) => {
        const product = row.original.Product || '—';
        const productImage = row.original.ProductImage || '';
        const productPopover = <Popover id={`popover-product-${row.original.ID || Math.random()}`}>
              <PopoverBody className="p-2 text-center" style={{
            maxWidth: '220px'
          }}>
                {productImage ? <img src={productImage} alt={product} style={{
              maxWidth: '200px',
              maxHeight: '200px'
            }} /> : <div className="text-muted small py-3">No Image Available</div>}
              </PopoverBody>
            </Popover>;
        return <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={productPopover}>
              <a href="" onClick={e => e.preventDefault()} className="product-name text-decoration-underline text-primary">
                {product}
              </a>
            </OverlayTrigger>;
      }
    }), columnHelper.accessor('City', {
      id: 'City',
      header: 'POS'
    }), columnHelper.accessor('Email', {
      id: 'Email',
      header: 'Email',
      cell: ({
        row
      }) => {
        const email = row.original.Email || '';
        const getDomain = value => value.toLowerCase().split('@')[1]?.split('.')[0];
        const getIconClass = domain => {
          switch (domain) {
            case 'hotmail':
            case 'outlook':
              return 'fab fa-microsoft';
            case 'gmail':
              return 'fab fa-google';
            case 'yahoo':
              return 'fab fa-yahoo';
            default:
              return 'fas fa-envelope';
          }
        };
        return <div className="d-flex align-items-center bg-secondary bg-opacity-10 border border-success border-opacity-50 py-1 px-2 fs-sm rounded" style={{
          maxWidth: 'max-content'
        }}>
              <i className={`${getIconClass(getDomain(email))} me-2 text-success`}></i>
              <span>{email}</span>
            </div>;
      }
    }), columnHelper.accessor('Department', {
      id: 'Department',
      header: 'Area'
    }), columnHelper.accessor('Address', {
      id: 'Address',
      header: 'Address'
    }), columnHelper.accessor('Company', {
      id: 'Company',
      header: 'Company'
    }), columnHelper.accessor('CreatedDate', {
      id: 'CreatedDate',
      header: 'CreatedDate'
    })];
  }, [importedData]);
  const table = useReactTable({
    data: activeData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
      expanded
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: value => {
      setGlobalFilter(value);
      setPagination(prev => ({
        ...prev,
        pageIndex: 0
      }));
    },
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: 'includesString',
    enableColumnFilters: true,
    enableRowSelection: true
  });
  const handleExport = format => {
    const filteredRows = table.getFilteredRowModel().rows.map(row => row.original);
    if (filteredRows.length === 0) return;
    const activeHeaders = table.getVisibleLeafColumns().map(col => String(col.columnDef.header || col.id));
    const activeKeys = table.getVisibleLeafColumns().map(col => col.id);
    const triggerDownload = (content, type, filename) => {
      const blob = new Blob([content], {
        type: `${type};charset=utf-8;`
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.click();
      URL.revokeObjectURL(url);
    };
    if (format === 'CSV' || format === 'EXCEL') {
      const delimiter = format === 'CSV' ? ',' : '\t';
      const headers = activeHeaders.map(h => `"${h}"`).join(delimiter);
      const rows = filteredRows.map(row => activeKeys.map(k => {
        const val = row[k] === null || row[k] === undefined ? '' : String(row[k]);
        return `"${val.replace(/"/g, '""')}"`;
      }).join(delimiter)).join('\n');
      const mimeType = format === 'CSV' ? 'text/csv' : 'application/vnd.ms-excel';
      const extension = format === 'CSV' ? 'csv' : 'xls';
      triggerDownload(`${headers}\n${rows}`, mimeType, `exported_data_${Date.now()}.${extension}`);
    }
    if (format === 'JSON') {
      triggerDownload(JSON.stringify(filteredRows, null, 2), 'application/json', `exported_data_${Date.now()}.json`);
    }
    if (format === 'COPY') {
      const headers = activeHeaders.join('\t');
      const rows = filteredRows.map(row => activeKeys.map(k => row[k] ?? '').join('\t')).join('\n');
      navigator.clipboard.writeText(`${headers}\n${rows}`);
      alert('Data successfully copied to your system clipboard!');
    }
    if (format === 'PDF') {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      const tableHtml = document.querySelector('.table-responsive')?.innerHTML || '';
      printWindow.document.write(`
      <html>
        <head>
          <title>Data Export PDF View</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>body { padding: 20px; } table { font-size: 12px; }</style>
        </head>
        <body>
          <h3 class="mb-4">Exported System Records Data</h3>
          ${tableHtml}
          <script>
            window.onload = function() { 
              window.print(); 
              setTimeout(function() { window.close(); }, 500); 
            }
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();
    }
  };
  const handlePrint = () => {
    const tableHtml = document.querySelector('.table-responsive')?.innerHTML || '';
    if (!tableHtml) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Table Records</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <style>
          body { padding: 20px; } 
          table { font-size: 12px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <h3 class="mb-4">System Records Data</h3>
        ${tableHtml}
        <script>
          window.onload = function() { 
            window.print(); 
            setTimeout(function() { window.close(); }, 500); 
          }
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = table.getFilteredRowModel().rows.length;
  const start = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalItems);
  return <>
      <div className="panel-content">
        <div className="st-wrapper card border-0 shadow-sm p-3">
          <Row className="st-toolbar mb-3 align-items-center justify-content-between g-2">
            <Col xs={12} sm={6} md={4}>
              <div className="st-search-wrapper">
                <div className="input-group input-group-sm flex-nowrap" role="search">
                  <span className="input-group-text border-end-0 px-2" id="search-icon">
                    <svg className="sa-icon sa-bold text-muted" style={{
                    width: '14px',
                    height: '14px'
                  }}>
                      <use href={`${basePath}/icons/sprite.svg#search`}></use>
                    </svg>
                  </span>
                  <FormControl type="text" className="border-start-0 ps-1" placeholder="Search..." value={globalFilter} onChange={e => table.setGlobalFilter(e.target.value)} aria-label="Search input" autoComplete="off" />
                </div>
              </div>
            </Col>
            <Col className="d-flex justify-content-end gap-2">
              {importedData && <button onClick={onResetImport} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" type="button">
                  Clear Import
                </button>}
              <button onClick={handlePrint} className="btn btn-outline-secondary btn-icon order-1 px-3 fs-xl" type="button" aria-label="Print table">
                <i className="sa sa-printer" />
              </button>

              <button onClick={handleShow} className="btn btn-sm btn-outline-success d-flex align-items-center gap-1" type="button">
                <i className="sa sa-cloud-upload"></i>
                Import
              </button>
              <Dropdown className="btn-group">
                <DropdownToggle as={'button'} className="btn btn-sm btn-outline-primary" type="button">
                  Export
                </DropdownToggle>
                <DropdownMenu align="end">
                  <DropdownItem onClick={() => handleExport('EXCEL')}>Excel</DropdownItem>
                  <DropdownItem onClick={() => handleExport('CSV')}>CSV</DropdownItem>
                  <DropdownItem onClick={() => handleExport('COPY')}>Copy</DropdownItem>
                  <DropdownItem onClick={() => handleExport('PDF')}>PDF</DropdownItem>
                  <DropdownItem onClick={() => handleExport('JSON')}>JSON</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>

          {loading ? <div className="d-flex justify-content-center align-items-center py-5">
              <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div> : <div>
              <div className="table-responsive border rounded">
                <div className="w-100 custom-scrollbar" style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              display: 'block',
              marginBottom: '1rem'
            }}>
                  <DataTable table={table} emptyMessage="No records found" renderRowDetails={({
                row
              }) => <div className="p-3 text-start bg-light border-top border-bottom custom-subrow-box small text-muted">
                        <div className="mb-1">
                          <strong>Company:</strong> {row.original.Company || 'N/A'}
                        </div>
                        <div className="mb-1">
                          <strong>Address:</strong> {row.original.Address || 'N/A'}
                        </div>
                        <div className="mb-1">
                          <strong>City:</strong> {row.original.City || 'N/A'}
                        </div>
                      </div>} />
                </div>
              </div>

              <div className="mt-3">
                <TablePagination totalItems={totalItems} start={start} end={end} itemsName="records" showInfo previousPage={table.previousPage} canPreviousPage={table.getCanPreviousPage()} pageCount={table.getPageCount()} pageIndex={table.getState().pagination.pageIndex} setPageIndex={table.setPageIndex} nextPage={table.nextPage} canNextPage={table.getCanNextPage()} pageSize={table.getState().pagination.pageSize} onPageSizeChange={table.setPageSize} showPageLimit />
              </div>
            </div>}
        </div>
      </div>
      <ImportModal show={show} handleClose={handleClose} onImportSuccess={onDataLoaded} />
    </>;
};
export default JsonSource;