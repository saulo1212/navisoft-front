import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { AvatarUsage, ColorChange, DataPercentage, DynamicUsage, NestedCharts, ScaleColor } from './components/EasyPieChart'

export const metadata: Metadata = { title: 'Easy Pie Chart' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Easy Pie Chart'}
          subTitle1={'Data Visualization'}
          subTitle2={'Data Bites'}
          subText={'Lightweight plugin to render simple, animated and retina optimized pie charts.'}
        />
        <div className="main-content">
          <Row>
            <Col xl={6}>
              <ColorChange />
              <ScaleColor />
              <DataPercentage />
            </Col>
            <Col sm={6}>
              <AvatarUsage />
              <NestedCharts />
              <DynamicUsage />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
