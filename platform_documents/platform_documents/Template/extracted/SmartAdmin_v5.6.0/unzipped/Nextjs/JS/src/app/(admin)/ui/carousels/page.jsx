import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { AddCaptions, ControlsExample, Crossfade, Indicators, IntervalExample, KitchenSinkCarousels, SlidesOnly } from './components/Carousels';
export const metadata = {
  title: 'Carousels'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Carousels'} subTitle1={'Visual Feedback'} subTitle2={'UI Components'} subText={'Bootstrap carousels are slideshow components that cycle through images or content with controls, indicators, and optional autoplay.'} />
        <div className="main-content">
          <Row>
            <Col sm={12}>
              <div className="info-container">
                <p className="mb-0">
                  The carousel is a slideshow for cycling through a series of content, built with CSS 3D transforms and a bit of JavaScript. It works
                  with a series of images, text, or custom markup. It also includes support for previous/next controls and indicators.
                </p>
              </div>
            </Col>
            <Col xl={12}>
              <KitchenSinkCarousels />
            </Col>
            <Col xl={6}>
              <SlidesOnly />
              <ControlsExample />
              <IntervalExample />
            </Col>
            <Col xl={6}>
              <Indicators />
              <Crossfade />
              <AddCaptions />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;