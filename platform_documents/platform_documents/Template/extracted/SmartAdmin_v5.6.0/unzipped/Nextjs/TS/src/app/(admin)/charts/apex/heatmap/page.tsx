import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { BasicHeatMapChart, ColorRangeHeatmap, MultipleSeriesHeatmap } from './components/HeatMapChart'

export const metadata: Metadata = { title: 'Apex Heatmap Charts' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Apex Heatmap Charts'}
          subTitle1={'Data Visualization'}
          subTitle2={'Apex Charts'}
          subText={'Launch your app with this scorching heatmap—great for analyzing user engagement zones!'}
        />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicHeatMapChart />
              <ColorRangeHeatmap />
            </Col>
            <Col sm={6}>
              <MultipleSeriesHeatmap />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
