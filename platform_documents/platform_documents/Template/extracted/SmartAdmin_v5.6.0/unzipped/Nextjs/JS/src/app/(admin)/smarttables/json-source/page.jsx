'use client';

import PageBreadcrumb from '@/components/PageBreadcrumb';
import Link from 'next/link';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import JsonSource from './components/JsonSource';
const Page = () => {
  const [tableData, setTableData] = useState(null);
  const handleDataImportSuccess = data => {
    setTableData(data);
  };
  return <div className="content-wrapper">
      <PageBreadcrumb title={'JSON Data Source'} subTitle1={'Data Visualization'} subTitle2={'Smart Tables'} subText={`Loading the table with External JSON data source with over 1000 records.`} />
      <div className="main-content">
        <div className="info-container mb-3">
          The <code>render</code> function allows you to manipulate data, apply <strong>custom styling</strong>, implement <strong>logic</strong>, and
          add various functionalities. For example, you can <strong>hover over a product to see its image</strong>, style emails based on mail
          providers, or use <strong>data matching</strong> to encode badges with colors. These are just basic examples—you can do much more with the
          <code>render</code> function.
          <Link href="" target="_blank" className="ms-1">
            See Documentation →
          </Link>
        </div>

        <Row>
          <Col lg={12}>
            <JsonSource importedData={tableData} onDataLoaded={handleDataImportSuccess} onResetImport={() => setTableData(null)} />
          </Col>
        </Row>
      </div>
    </div>;
};
export default Page;