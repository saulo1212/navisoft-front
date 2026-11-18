import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicRangeArea, ComboRangeArea, DatetimeRangeArea, MultipleRangeArea } from './components/RangeAreaChart';
export const metadata = {
  title: 'Apex Range Area Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Range Area Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'This range area design—ideal for highlighting trends within defined boundaries — perfect for showcasing data fluctuations in a structured format .'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicRangeArea />
              <DatetimeRangeArea />
            </Col>
            <Col sm={6}>
              <ComboRangeArea />
              <MultipleRangeArea />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;