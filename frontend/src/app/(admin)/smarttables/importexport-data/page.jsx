'use client';

import PageBreadcrumb from '@/components/PageBreadcrumb';
import TablePagination from '@/components/table/TablePagination';
import { basePath } from '@/helpers';
import Link from 'next/link';
import { useState } from 'react';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormControl, Row } from 'react-bootstrap';
import Importexport from './components/Importexport';
const Page = () => {
  const [tableData, setTableData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleDataImportSuccess = data => {
    setTableData(data);
    setCurrentPage(1);
  };
  const tableHeaders = tableData && tableData.length > 0 ? Object.keys(tableData[0]) : [];
  const filteredData = tableData?.filter(row => {
    return Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
  }) || [];
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const indexOfLastItem = activePage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentRows = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const formatHeaderLabel = key => {
    return key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
  };
  const start = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const end = Math.min(indexOfLastItem, totalItems);
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
  const handleExport = format => {
    if (!tableData || tableData.length === 0) return;
    if (format === 'CSV' || format === 'EXCEL') {
      const delimiter = format === 'CSV' ? ',' : '\t';
      const headers = tableHeaders.map(h => `"${formatHeaderLabel(h)}"`).join(delimiter);
      const rows = filteredData.map(row => tableHeaders.map(h => {
        const val = row[h] === null || row[h] === undefined ? '' : String(row[h]);
        return `"${val.replace(/"/g, '""')}"`;
      }).join(delimiter)).join('\n');
      const content = `${headers}\n${rows}`;
      const mimeType = format === 'CSV' ? 'text/csv' : 'application/vnd.ms-excel';
      const extension = format === 'CSV' ? 'csv' : 'xls';
      triggerDownload(content, mimeType, `exported_data_${Date.now()}.${extension}`);
    }
    if (format === 'JSON') {
      const content = JSON.stringify(filteredData, null, 2);
      triggerDownload(content, 'application/json', `exported_data_${Date.now()}.json`);
    }
    if (format === 'COPY') {
      const headers = tableHeaders.map(h => formatHeaderLabel(h)).join('\t');
      const rows = filteredData.map(row => tableHeaders.map(h => row[h] ?? '').join('\t')).join('\n');
      navigator.clipboard.writeText(`${headers}\n${rows}`);
      alert('Data successfully copied to your system clipboard!');
    }
    if (format === 'XML') {
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<records>\n';
      filteredData.forEach(row => {
        xml += '  <record>\n';
        tableHeaders.forEach(h => {
          const cleanTag = h.replace(/[^a-zA-Z0-9]/g, '');
          xml += `    <${cleanTag}>${row[h] ?? ''}</${cleanTag}>\n`;
        });
        xml += '  </record>\n';
      });
      xml += '</records>';
      triggerDownload(xml, 'application/xml', `exported_data_${Date.now()}.xml`);
    }
    if (format === 'HTML') {
      let html = '<table border="1"><thead><tr>';
      tableHeaders.forEach(h => html += `<th>${formatHeaderLabel(h)}</th>`);
      html += '</tr></thead><tbody>';
      filteredData.forEach(row => {
        html += '<tr>';
        tableHeaders.forEach(h => html += `<td>${row[h] ?? ''}</td>`);
        html += '</tr>';
      });
      html += '</tbody></table>';
      triggerDownload(html, 'text/html', `exported_data_${Date.now()}.html`);
    }
    if (format === 'PDF') {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      let tableHtml = document.getElementById('myTable')?.outerHTML || '';
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
  return <div className="content-wrapper">
      <PageBreadcrumb title={'Import & Export Data'} subTitle1={'Smart Tables'} subTitle2={'Data Visualization'} subText={`No manual processing, no hassle—just smooth, efficient data management built for developers. 🚀`} />
      <div className="main-content">
        {!tableData ? <div id="hide-import-data">
            <div className="info-container p-3 mb-3 bg-faded rounded">
              <p className="mb-0">
                The <strong>SmartTables Import</strong> feature streamlines your workflow by
                <strong>automatically</strong> or <strong>conditionally</strong> importing
                <code>JSON</code> and <code>CSV</code> files (with more formats coming soon). Imported data is instantly{' '}
                <strong>sorted and listed</strong>, ready for you to explore. Need to share or transform your data?{' '}
                <strong>Effortlessly export</strong> it in multiple formats with just a click.
              </p>
            </div>
            <Importexport onDataLoaded={handleDataImportSuccess} />
            <small className="text-muted d-block mt-2">
              <strong>Note:</strong> The import feature accepts any JSON file structured as an array of objects. Download sample files{' '}
              <Link href={`${basePath}/json/MOCK_DATA.json`} target="_blank" className="text-decoration-none fw-500">
                here
              </Link>
              .
            </small>
          </div> : <div id="tableContainer">
            <Row>
              <Col lg={12}>
                <div className="st-wrapper" style={{
              position: 'relative',
              width: '100%'
            }}>
                  <div className="st-toolbar row mb-4">
                    <div className="col-12 col-sm-6 col-lg-6 col-xl-5 col-xxl-4 order-1 order-sm-0 mt-4 mt-sm-0">
                      <div className="st-search-wrapper">
                        <div className="input-group flex-nowrap" role="search">
                          <span className="input-group-text px-2" id="search-icon">
                            <svg className="sa-icon sa-bold">
                              <use href={`${basePath}/icons/sprite.svg#search`} />
                            </svg>
                          </span>
                          <FormControl type="text" id="addon-wrapping-left" placeholder="Search..." aria-label="Search input" aria-describedby="search-icon" autoComplete="off" value={searchTerm} onChange={e => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }} />
                        </div>
                      </div>
                    </div>
                    <div className="col d-flex justify-content-end gap-2">
                      <button onClick={() => setTableData(null)} className="btn btn-sm btn-outline-success d-flex align-items-center gap-1" type="button">
                        <i className="sa sa-cloud-upload" /> Import
                      </button>

                      <Dropdown className="btn-group">
                        <DropdownToggle as={'button'} className="btn btn-sm btn-outline-primary" type="button">
                          Export
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleExport('EXCEL')}>Excel</DropdownItem>
                          <DropdownItem onClick={() => handleExport('CSV')}>CSV</DropdownItem>
                          <DropdownItem onClick={() => handleExport('COPY')}>Copy</DropdownItem>
                          <DropdownItem onClick={() => handleExport('PDF')}>PDF</DropdownItem>
                          <DropdownItem onClick={() => handleExport('JSON')}>JSON</DropdownItem>
                          <DropdownItem onClick={() => handleExport('XML')}>XML</DropdownItem>
                          <DropdownItem onClick={() => handleExport('HTML')}>HTML</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                  <table id="myTable" className="table table-striped table-bordered table-hover">
                    <thead className="table-light text-uppercase fw-600 tracking-wider">
                      <tr>
                        {tableHeaders.map(header => <th key={header}>{formatHeaderLabel(header)}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {currentRows.length > 0 ? currentRows.map((row, rowIndex) => <tr key={rowIndex}>
                            {tableHeaders.map(header => {
                      const cellValue = row[header];
                      const displayValue = typeof cellValue === 'object' && cellValue !== null ? JSON.stringify(cellValue) : String(cellValue ?? '-');
                      let cellClass = '';
                      if (header.toLowerCase().includes('profit') || header.toLowerCase().includes('net')) {
                        cellClass = displayValue.startsWith('-') ? 'text-danger' : 'text-success';
                      }
                      return <td key={header} className={cellClass}>
                                  {displayValue}
                                </td>;
                    })}
                          </tr>) : <tr>
                          <td colSpan={tableHeaders.length || 1} className="text-center py-4 text-muted">
                            No records match the active search terms.
                          </td>
                        </tr>}
                    </tbody>
                  </table>

                  <TablePagination totalItems={totalItems} start={start} end={end} itemsName="records" showInfo previousPage={() => setCurrentPage(p => Math.max(p - 1, 1))} canPreviousPage={activePage > 1} pageCount={totalPages} pageIndex={activePage - 1} setPageIndex={index => setCurrentPage(index + 1)} nextPage={() => setCurrentPage(p => Math.min(p + 1, totalPages))} canNextPage={activePage < totalPages} pageSize={pageSize} onPageSizeChange={size => {
                setPageSize(size);
                setCurrentPage(1);
              }} showPageLimit />
                </div>
              </Col>
            </Row>
          </div>}
      </div>
    </div>;
};
export default Page;