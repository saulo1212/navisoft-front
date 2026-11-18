import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import {
  AnimatedBars,
  DefaultProgress,
  GradientBackgrounds,
  LabelDisplay,
  MultipleBars,
  SolidBackgrounds,
  StripedBackrounds,
  VariousHeight,
} from './components/Progress'

export const metadata: Metadata = { title: 'Progressbars' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Progressbars'}
          subTitle1={'Design'}
          subTitle2={'UI Components'}
          subText={
            'Bootstrap progress bars visually represent the completion status of a task, with customizable colors, labels, and animated stripes.'
          }
        />
        <div className="main-content">
          <div className="info-container">
            <p className="mb-0">
              Progress components are built with two HTML elements, some CSS to set the width, and a few attributes. We don’t use the HTML5
              <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress" target="_blank">
                <code>&lt;progress&gt;</code>
              </a>
              element, ensuring you can stack progress bars, animate them, and place text labels over them.
            </p>
          </div>
          <Row>
            <Col xl={6}>
              <DefaultProgress />
              <VariousHeight />
              <LabelDisplay />
              <SolidBackgrounds />
            </Col>
            <Col xl={6}>
              <MultipleBars />
              <GradientBackgrounds />
              <StripedBackrounds />
              <AnimatedBars />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
