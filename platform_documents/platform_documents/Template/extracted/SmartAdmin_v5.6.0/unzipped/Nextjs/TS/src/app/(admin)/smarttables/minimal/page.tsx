import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import MinimalTable from './components/MinimalTable'

export const metadata: Metadata = { title: 'SmartTables' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Minimal Settings'}
          subTitle1={'Data Visualization'}
          subTitle2={'Smart Tables'}
          subText={`Loading the table with minimal settings & static data.`}
        />
        <div className="main-content">
          <div className="info-container">
            By default, most of the features are disabled, including the responsive design. We inilialize the table by using
            <code>
              const table = new SmartTables('myTable', {'{'}
              {'}'});
            </code>
            Only <strong>"Search"</strong>, <strong>"Pagination"</strong>, <strong>"Sorting"</strong>, and <strong>"Entries"</strong> are enabled by
            default.
            <strong className="text-danger">Note: This is a non-responsive example of SmartTables. </strong>
          </div>
          <Row>
            <Col lg={12}>
              <MinimalTable />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
