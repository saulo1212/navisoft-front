'use client';

import DataTable from '@/components/table/DataTable';
import TablePagination from '@/components/table/TablePagination';
import { basePath } from '@/helpers';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Button, Col, FormControl, FormLabel, Row, Spinner } from 'react-bootstrap';
const columnHelper = createColumnHelper();
const FuzzySearchTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTableBuilt, setIsTableBuilt] = useState(false);
  const [threshold, setThreshold] = useState(0);
  const [minMatchLength, setMinMatchLength] = useState(1);
  const [multiWordThreshold, setMultiWordThreshold] = useState(1);
  const [maxDistance, setMaxDistance] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 6
  });
  const [description, setDescription] = useState('');
  const [searchExample, setSearchExample] = useState('');
  useEffect(() => {
    let desc = '';
    if (threshold === 0) desc += '• <strong>Exact matching only</strong> - No partial matches<br>';else if (threshold < 0.3) desc += '• <strong>Minor fuzzy matching</strong> - Requires high similarity<br>';else if (threshold < 0.6) desc += '• <strong>Moderate fuzzy matching</strong> - Allows reasonable variations<br>';else if (threshold < 1) desc += '• <strong>High fuzzy matching</strong> - Will find loosely related terms<br>';else desc += '• <strong>Maximum fuzzy matching</strong> - Will track down distant relatives like an overenthusiastic family reunion<br>';
    if (minMatchLength === 1) desc += '• Will match even with a <strong>single character</strong><br>';else desc += `• Requires at least <strong>${minMatchLength} characters</strong> to match<br>`;
    if (multiWordThreshold === 1) desc += '• <strong>All words</strong> in a multi-word search must match<br>';else if (multiWordThreshold > 0.5) desc += '• <strong>Most words</strong> in a multi-word search must match<br>';else if (multiWordThreshold > 0) desc += '• <strong>Some words</strong> in a multi-word search must match<br>';else desc += '• <strong>Any word</strong> in a multi-word search can match<br>';
    if (maxDistance === 0) desc += '• <strong>No typo tolerance</strong> - Characters must match exactly<br>';else if (maxDistance === 1) desc += '• <strong>Single typo tolerance</strong> - Allows 1 character mismatch<br>';else if (maxDistance < 5) desc += `• <strong>Moderate typo tolerance</strong> - Allows ${maxDistance} character mismatches<br>`;else desc += '• <strong>High typo tolerance</strong> - Allows many character mismatches<br>';
    let example = '';
    if (threshold === 0 && maxDistance === 0) {
      example = "Try searching for exact terms like 'John' or 'Do'";
    } else {
      if (maxDistance > 0) {
        example = "Try searches with typos like 'Jhon' instead of 'John' or 'Subrey' instead of 'Surgery'";
      } else {
        example = "Try partial searches like 'Jo' for 'John' or 'Surg' for 'Surgery'";
      }
    }
    setDescription(desc);
    setSearchExample(example);
  }, [threshold, minMatchLength, multiWordThreshold, maxDistance]);
  const handleResetSettings = () => {
    setThreshold(0.7);
    setMinMatchLength(2);
    setMultiWordThreshold(0.5);
    setMaxDistance(2);
  };
  const handleBuildTable = async () => {
    setLoading(true);
    setIsTableBuilt(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const res = await fetch(`${baseUrl}/json/MOCK_DATA_HOSPITAL.json`);
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      }
    } catch (err) {
      console.error('Error fetching data source:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleDestroyTable = () => {
    setData([]);
    setIsTableBuilt(false);
    setGlobalFilter('');
  };
  const columns = [columnHelper.accessor('PatientID', {
    header: 'ID'
  }), columnHelper.accessor('PatientName', {
    header: 'First Name'
  }), columnHelper.accessor('Phone', {
    header: 'Phone'
  }), columnHelper.accessor('DOB', {
    header: 'DOB'
  }), columnHelper.accessor('Service', {
    header: 'Service'
  }), columnHelper.accessor('ServiceDate', {
    header: 'Service Date'
  }), columnHelper.accessor('Severity', {
    header: 'Severity',
    cell: ({
      row
    }) => {
      const value = row.original.Severity;
      let badgeClass = 'bg-dark';
      if (value === 'Mild') badgeClass = 'bg-success';
      if (value === 'Moderate') badgeClass = 'bg-warning text-dark';
      if (value === 'Severe') badgeClass = 'bg-danger';
      return <span className={`badge ${badgeClass}`}>{value}</span>;
    }
  }), columnHelper.accessor('BillPaid', {
    header: 'Bill Paid'
  }), columnHelper.accessor('BillDue', {
    header: 'Bill Due'
  }), columnHelper.accessor('Department', {
    header: 'Department'
  }), columnHelper.accessor('Staff', {
    header: 'Doctor'
  }), columnHelper.accessor('Nurse', {
    header: 'Nurse'
  })];
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    enableColumnFilters: true
  });
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = table.getFilteredRowModel().rows.length;
  const start = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalItems);
  return <>
      <Row className="row-grid g-0 border-faded mb-g">
        <Col sm={6} className="p-3">
          <div className="mb-1">
            <FormLabel>
              <span>
                <strong>Threshold:</strong> <span>{threshold}</span>
              </span>
              <small className="d-block text-muted">0 = Exact match only | 1 = Maximum fuzziness</small>
            </FormLabel>
            <input type="range" className="form-range" id="threshold" min="0" max="1" step="0.1" disabled={isTableBuilt} value={threshold} onChange={e => setThreshold(parseFloat(e.target.value))} />
          </div>
        </Col>
        <Col sm={6} className="p-3">
          <div className="mb-1">
            <FormLabel>
              <span>
                <strong>Minimum Match Length:</strong> <span>{minMatchLength}</span>
              </span>
              <small className="d-block text-muted">Minimum characters required for a match</small>
            </FormLabel>
            <input type="range" className="form-range" id="minMatchLength" min="1" max="5" step="1" disabled={isTableBuilt} value={minMatchLength} onChange={e => setMinMatchLength(parseInt(e.target.value))} />
          </div>
        </Col>
        <Col sm={6} className="p-3">
          <div className="mb-1">
            <FormLabel>
              <span>
                <strong>Multi-Word Threshold:</strong> <span>{multiWordThreshold}</span>
              </span>
              <small className="d-block text-muted">0 = Match any word | 1 = Match all words</small>
            </FormLabel>
            <input type="range" className="form-range" id="multiWordThreshold" min="0" max="1" step="0.1" disabled={isTableBuilt} value={multiWordThreshold} onChange={e => setMultiWordThreshold(parseFloat(e.target.value))} />
          </div>
        </Col>
        <Col sm={6} className="p-3">
          <div className="mb-1">
            <FormLabel>
              <span>
                <strong>Max Distance:</strong> <span>{maxDistance}</span>
              </span>
              <small className="d-block text-muted">Maximum character mismatches allowed (typo tolerance)</small>
            </FormLabel>
            <input type="range" className="form-range" id="maxDistance" min="0" max="10" step="1" disabled={isTableBuilt} value={maxDistance} onChange={e => setMaxDistance(parseInt(e.target.value))} />
          </div>
        </Col>
      </Row>

      <div className="mb-4 p-3 bg-secondary bg-opacity-25 border border-secondary rounded">
        <div className="mb-3" dangerouslySetInnerHTML={{
        __html: description
      }} />
        {searchExample && <div className="text-muted fst-italic small">{searchExample}</div>}
      </div>
      <div className="d-flex align-items-center justify-content-end gap-2">
        <Button className="me-auto waves-effect waves-themed" variant="secondary" onClick={handleBuildTable} disabled={isTableBuilt}>
          Balanced <span className="d-none d-sm-inline">Settings</span>
        </Button>
        <Button className="waves-effect waves-themed" variant="danger" onClick={handleDestroyTable} disabled={!isTableBuilt}>
          Destroy <span className="d-none d-sm-inline">Table</span>
        </Button>
        <Button className="waves-effect waves-themed" variant="outline-success" onClick={handleResetSettings} disabled={isTableBuilt}>
          Build <span className="d-none d-sm-inline">Table</span>
        </Button>
      </div>

      {isTableBuilt && <div className="st-wrapper mt-4 pt-3 border-top border-secondary">
          <Row className="st-toolbar mb-4">
            <Col xs={12} sm={6} lg={6} xl={5} xxl={4}>
              <div className="input-group flex-nowrap" role="search">
                <span className="input-group-text px-2 bg-dark border-secondary text-light">
                  <svg className="sa-icon sa-bold" style={{
                width: '16px',
                height: '16px',
                fill: 'currentColor'
              }}>
                    <use href={`${basePath}/icons/sprite.svg#search`}></use>
                  </svg>
                </span>
                <FormControl type="text" placeholder="Search table records..." className="bg-transparent text-light border-secondary shadow-none" value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} autoComplete="off" />
              </div>
            </Col>
          </Row>

          {loading ? <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" variant="primary" />
            </div> : <>
              <DataTable table={table} emptyMessage="No hospital records match current configurations" />

              <TablePagination totalItems={totalItems} start={start} end={end} itemsName="entries" showInfo previousPage={table.previousPage} canPreviousPage={table.getCanPreviousPage()} pageCount={table.getPageCount()} pageIndex={table.getState().pagination.pageIndex} setPageIndex={table.setPageIndex} nextPage={table.nextPage} canNextPage={table.getCanNextPage()} pageSize={table.getState().pagination.pageSize} onPageSizeChange={table.setPageSize} showPageLimit />
            </>}
        </div>}
    </>;
};
export default FuzzySearchTable;