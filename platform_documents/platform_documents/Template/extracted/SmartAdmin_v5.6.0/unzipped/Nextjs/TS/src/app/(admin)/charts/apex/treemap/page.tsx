import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { BasicTimeLineChart, ColorRangeTimeLineChart, DistributedTimeLineChart, MultipleSeriesTimeLineChart } from './components/TreemapCharts'

export const metadata: Metadata = { title: 'Apex Treemap Chart' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Apex Treemap Chart'}
          subTitle1={'Data Visualization'}
          subTitle2={'Apex Charts'}
          subText={'Used for displaying complex data relationships and showcasing hierarchical structures.'}
        />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicTimeLineChart />
              <ColorRangeTimeLineChart />
            </Col>
            <Col sm={6}>
              <MultipleSeriesTimeLineChart />
              <DistributedTimeLineChart />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
