import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BrowserDefault, CustomStyles, InvalidFromStyles, ServerSide, TooltipStyles, ValidFormStyles } from './components/Validation';
export const metadata = {
  title: 'Validation'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Validation'} subTitle1={'Design'} subTitle2={'Forms'} subText="Provide valuable, actionable feedback to your users with HTML5 form validation." />

        <div className="main-content">
          <div className="info-container">
            Validation styles are available for the following form controls and components: <code>&lt;input&gt;</code> and{' '}
            <code>&lt;textarea&gt;</code> with <code>.form-control</code>, <code>&lt;select&gt;</code> with <code>.form-select</code>, and{' '}
            <code>.form-check</code> inputs.
          </div>

          <Row>
            <Col xl={6}>
              <InvalidFromStyles />
              <CustomStyles />
              <ServerSide />
            </Col>
            <Col xl={6}>
              <ValidFormStyles />
              <TooltipStyles />
              <BrowserDefault />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;