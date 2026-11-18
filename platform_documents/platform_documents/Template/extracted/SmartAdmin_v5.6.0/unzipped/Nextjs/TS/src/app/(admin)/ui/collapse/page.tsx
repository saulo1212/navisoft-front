import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { AccordionExample, BasicExample, MultipleTargets } from './components/Collapse'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Collapse' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Collapse'}
          subTitle1={'Interactive Features'}
          subTitle2={'UI Components'}
          subText={'Toggle the visibility of content across your project with a few classes.'}
        />
        <div className="main-content">
          <div className="info-container">
            <p>
              The collapse JavaScript plugin is used to show and hide content. Buttons or anchors are used as triggers that are mapped to specific
              elements you toggle. Collapsing an element will animate the height from its current value to 0. Given how CSS handles animations, you
              cannot use padding on a <code>.collapse</code> element. Instead, use the class as an independent wrapping element.
            </p>
            <p className="mb-0">
              Learn more about this component on bootstrap's{' '}
              <Link href="https://getbootstrap.com/docs/5.3/components/collapse/" target="_blank">
                official documentation
              </Link>
              .
            </p>
          </div>

          <Row>
            <Col xl={6}>
              <BasicExample />
              <MultipleTargets />
            </Col>
            <Col xl={6}>
              <AccordionExample />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
