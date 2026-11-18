import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicSlopeChart, MultiGroupSlopeChart } from './components/SlopeChart';
export const metadata = {
  title: 'Apex Slope Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Slope Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Highly effective for assessing data evolution efficiently, ideal for visualizing shifts over time.'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicSlopeChart />
            </Col>
            <Col sm={6}>
              <MultiGroupSlopeChart />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;