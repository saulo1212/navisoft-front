import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { AreaChart, BarChart, ChartSize, DonutChart, DynamicChart, LineChart, PieChart, UpdatingChart } from './components/PeityChart'

export const metadata: Metadata = { title: 'Peity Charts' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Peity Charts'}
          subTitle1={'Data Visualization'}
          subTitle2={'Data Bites'}
          subText={'Lightweight inline SVG mini charts'}
        />
        <div className="main-content">
          <div className="info-container">
            Peity turns element text like <code>"5,3,9,6,5,9,7"</code> into simple SVG mini graphs. These lightweight charts can be used inline or as
            small data visualization elements.
          </div>

          <Row>
            <Col sm={6}>
              <LineChart />
              <BarChart />
              <DonutChart />
              <DynamicChart />
            </Col>
            <Col sm={6}>
              <AreaChart />
              <PieChart />
              <UpdatingChart />
              <ChartSize />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
