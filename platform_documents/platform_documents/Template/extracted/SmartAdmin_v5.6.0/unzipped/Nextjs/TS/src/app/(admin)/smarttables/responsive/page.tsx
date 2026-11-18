import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import ResponsiveTable from './components/ResponsiveTable'

export const metadata: Metadata = { title: 'SmartTables: Responsive Settings' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Responsive Settings'}
          subTitle1={'Data Visualization'}
          subTitle2={'Smart Tables'}
          subText={`Loading the table with responsive settings & static data.`}
        />
        <div className="main-content">
          <div className="info-container">
            <strong>Responsive Settings</strong> are enabled by using{' '}
            <code>
              responsive: {'{'} enabled: true, breakpoint: 768, columnPriorities: {'{'} 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 {'}'} {'}'}
            </code>
          </div>
          <Row>
            <Col lg={12}>
              <ResponsiveTable />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
