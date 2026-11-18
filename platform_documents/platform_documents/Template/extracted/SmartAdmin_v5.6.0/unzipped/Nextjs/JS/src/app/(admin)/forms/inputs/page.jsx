import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { AlteringWithUtilities, FloatingDisabled, FloatingLabels, GeneralDisabled, GeneralInput, InputSizes } from './components/InputForm';
export const metadata = {
  title: 'Inputs'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Inputs'} subTitle1={'Design'} subTitle2={'Forms'} />
        <h6 className="mt-3 mb-4 fst-italic">
          Form inputs styled and customizable input elements using classes like <code>.form-control</code>, <code>.form-check</code>, and
          <code>.form-select</code> for consistent design and functionality.
        </h6>

        <div className="main-content">
          <Row>
            <Col xl={6}>
              <GeneralInput />
            </Col>
            <Col xl={6}>
              <GeneralDisabled />
            </Col>
            <Col xl={6}>
              <FloatingLabels />
            </Col>
            <Col xl={6}>
              <FloatingDisabled />
            </Col>
            <Col xl={12}>
              <InputSizes />
              <AlteringWithUtilities />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;