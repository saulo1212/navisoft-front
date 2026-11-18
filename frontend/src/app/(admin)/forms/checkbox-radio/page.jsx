import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { CheckboxInput, RadioInput, SwitchRadioAndCheckbox } from './components/CheckBoxRadio';
export const metadata = {
  title: 'Checkbox & Radio'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Checkbox & Radio'} subTitle1={'Design'} subTitle2={'Forms'} />
        <h6 className="mt-3 mb-4 fst-italic">
          Checkboxes and radio buttons form elements with support for custom designs using classes like <code>.form-check</code> and
          <code>.form-check-input</code>.
        </h6>

        <div className="main-content">
          <Row>
            <Col xl={6}>
              <CheckboxInput />
            </Col>
            <Col xl={6}>
              <RadioInput />
            </Col>
            <Col xl={12}>
              <SwitchRadioAndCheckbox />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;