import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { ApexFunnelChart, PyramidChart } from './components/FunnelChart';
export const metadata = {
  title: 'Apex Funnel Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Funnel Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Build your base with a chart that’s a riot—perfect for visualizing process bottlenecks!'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <ApexFunnelChart />
            </Col>
            <Col sm={6}>
              <PyramidChart />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;