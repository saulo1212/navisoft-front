import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { BasicSparklineChart } from './components/SparklineChart'

export const metadata: Metadata = { title: 'Apex Sparkline' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Apex Sparkline'}
          subTitle1={'Data Visualization'}
          subTitle2={'Apex Charts'}
          subText={'Perfect for subtle metric insights, highly effective for presenting data in a streamlined format.'}
        />
        <div className="main-content">
          <Row>
            <Col sm={12}>
              <BasicSparklineChart />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
