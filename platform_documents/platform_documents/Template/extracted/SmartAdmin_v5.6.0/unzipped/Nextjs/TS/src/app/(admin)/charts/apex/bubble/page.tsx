import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { Bubble3DChart, SimpleBubbleChart } from './components/BubbleChart'

export const metadata: Metadata = { title: 'Apex Bubble Chart' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Apex Bubble Chart'}
          subTitle1={'Data Visualization'}
          subTitle2={'Apex Charts'}
          subText={'Utilize this collection of Apex Bubble Chart examples to blow up your development game!'}
        />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <SimpleBubbleChart />
            </Col>
            <Col sm={6}>
              <Bubble3DChart />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
