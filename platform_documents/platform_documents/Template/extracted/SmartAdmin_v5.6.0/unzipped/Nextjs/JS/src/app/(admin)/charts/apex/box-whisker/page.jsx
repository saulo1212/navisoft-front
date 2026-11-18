import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicBoxAndWhisker, HorizontalBoxplotChart } from './components/BoxWhiskerChart';
export const metadata = {
  title: 'Apex Box & Whisker Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Box & Whisker Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Leverage these Apex Box & Whisker Chart variants as a starting point for custom analytical dashboards.'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicBoxAndWhisker />
            </Col>
            <Col sm={6}>
              <HorizontalBoxplotChart />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;