import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import {
  BasicRadialBars,
  CustomAngleCircle,
  GradientRadialBars,
  MultipleRadialBars,
  RadialbarsWithImage,
  SemiCircleGauge,
  StrokedGauge,
} from './components/RadiaBarsCharts'

export const metadata: Metadata = { title: 'Apex RadialBars/Circle Chart' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Apex RadialBars/Circle Chart'}
          subTitle1={'Data Visualization'}
          subTitle2={'Apex Charts'}
          subText={'Encapsulate your objectives with this chart—ideal for monitoring progress with precision.'}
        />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicRadialBars />
              <CustomAngleCircle />
              <RadialbarsWithImage />
              <SemiCircleGauge />
            </Col>
            <Col sm={6}>
              <MultipleRadialBars />
              <GradientRadialBars />
              <StrokedGauge />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
