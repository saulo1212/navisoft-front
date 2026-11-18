import PageBreadcrumb from '@/components/PageBreadcrumb';
import ServerSide from './components/ServerSide';
import { Col, Row } from 'react-bootstrap';
import Link from 'next/link';
export const metadata = {
  title: 'SmartTables: Server-Side Mode'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'SmartTables: Server-Side Mode'} subTitle1={'Data Visualization'} subTitle2={'Smart Tables'} subText={`Loading the table with server side data.`} />
        <div className="main-content">
          <div className="info-container">
            <strong>Here</strong> we use <code>mock-server.php</code> to load data via AJAX, data resets every 24 hours. Configure with:
            <code>
              data: {'{'} type: 'ajax', source: 'API_URL', serverSide: true, method: 'GET', cacheDuration: 300000 {'}'}
            </code>
            Processing happens server-side; client only renders. <strong>Searched, paging, and sorting</strong> is cached for 5 minutes. Test how this
            works by opening the browser's <strong>developer tools</strong> and going to the <strong>Network</strong> tab.{' '}
            <Link href="smarttablesjs.html#smarttables-server-side" target="_blank">
              See documentation →
            </Link>
          </div>

          <Row>
            <Col lg={12}>
              <ServerSide />
            </Col>
            <Col lg={12}></Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;