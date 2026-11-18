import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicToasts, PlacementToasts, StackingToasts, TranslucentToasts } from './components/Toasts';
export const metadata = {
  title: 'Toasts'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Toasts'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Push notifications to your visitors with a toast, a lightweight and easily customizable alert message.'} />
        <div className="main-content">
          <div className="info-container">
            <p>
              Toasts are lightweight notifications designed to mimic the push notifications that have been popularized by mobile and desktop operating
              systems. They're built with flexbox, so they're easy to align and position.
            </p>
            <p className="mb-0">
              Learn more about this component on bootstrap's
              <a href="https://getbootstrap.com/docs/5.3/components/toasts/" target="_blank">
                official documentation
              </a>
              .
            </p>
          </div>

          <Row>
            <Col xl={6}>
              <BasicToasts />
              <StackingToasts />
            </Col>
            <Col xl={6}>
              <TranslucentToasts />
              <PlacementToasts />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;