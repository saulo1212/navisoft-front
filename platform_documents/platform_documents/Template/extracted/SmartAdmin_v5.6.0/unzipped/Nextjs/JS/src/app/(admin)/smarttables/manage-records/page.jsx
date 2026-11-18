import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import ManageRecords from './components/ManageRecords';
export const metadata = {
  title: 'SmartTables: Manage Records'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Manage Records'} subTitle1={'Smart Tables'} subTitle2={'Data Visualization'} subText={`Functionality for managing records with full CRUD (Create, Read, Update, Delete) operations. This allows you to build interactive data management interfaces with minimal effort.`} />
        <div className="main-content">
          <div className="info-container">
            Turn on <strong>Edit, Add, and Delete</strong> feature by using <code>addRecord: true</code> and use hooks create custom form elements.
          </div>
          <Row>
            <Col lg={12}>
              <ManageRecords />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;