import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicExample, ButtonAddon, ButtonAddonWithDropdown, CheckboxesAndRadio, CustomForms, FileUpload, KitchenSink, MultipleInput, SeamlessIcon, SegmentedButton, VariousSizing, WrappingInput } from './components/GroupForm';
export const metadata = {
  title: 'Groups'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Groups'} subTitle1={'Design'} subTitle2={'Forms'} subText="Input groups allow you to combine input fields with additional elements like text, icons, or buttons for enhanced functionality and design." />

        <div className="main-content">
          <Row>
            <Col xl={6}>
              <BasicExample />
              <WrappingInput />
              <VariousSizing />
              <CheckboxesAndRadio />
              <MultipleInput />
              <SegmentedButton />
            </Col>
            <Col xl={6}>
              <SeamlessIcon />
              <ButtonAddon />
              <ButtonAddonWithDropdown />
              <CustomForms />
              <FileUpload />
              <KitchenSink />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;