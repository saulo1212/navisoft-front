import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicRadar, RadarMultipleSeries, RadarWithPolygonFill } from './components/RadarChart';
export const metadata = {
  title: 'Apex Radar Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Radar Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Kick off with this radar roundup—awesome for visualizing trends like a sci-fi pro!'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicRadar />
              <RadarWithPolygonFill />
            </Col>
            <Col sm={6}>
              <RadarMultipleSeries />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;