import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import {
  AnimationPopover,
  BasicPopover,
  DelayedPopover,
  PopoverContainer,
  PopoverContent,
  PopoverDismissable,
  PopoverPlacement,
  PopoverTemplate,
  PopoverTitle,
  PopoverTriggers,
} from './components/PopOver'

export const metadata: Metadata = { title: 'Popovers' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Popovers'}
          subTitle1={'Design'}
          subTitle2={'UI Components'}
          subText={
            'Bootstrap popovers are interactive, dismissible overlays that provide additional content when users click or hover over an element.'
          }
        />
        <div className="main-content">
          <Row>
            <Col xl={6}>
              <BasicPopover />
              <PopoverContent />
              <AnimationPopover />
              <PopoverTitle />
              <PopoverContainer />
            </Col>
            <Col xl={6}>
              <DelayedPopover />
              <PopoverPlacement />
              <PopoverTriggers />
              <PopoverTemplate />
              <PopoverDismissable />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
