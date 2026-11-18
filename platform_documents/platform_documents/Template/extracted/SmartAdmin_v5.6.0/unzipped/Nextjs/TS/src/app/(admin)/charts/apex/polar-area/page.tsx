import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { BasicPolarArea, MonochromePolarArea } from './components/PolarAreaChart'

export const metadata: Metadata = { title: 'Apex Polar Area Chart' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Apex Polar Area Chart'}
          subTitle1={'Data Visualization'}
          subTitle2={'Apex Charts'}
          subText={'Build your base with a chart that’s out of this world—perfect for polar data vibes!'}
        />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicPolarArea />
            </Col>
            <Col sm={6}>
              <MonochromePolarArea />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
