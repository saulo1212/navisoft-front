import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicScatterChart, CategoryScatterChart, DatetimeScatterChart, ScatterImageChart, ScatterImagesChart } from './components/ScatterChart';
export const metadata = {
  title: 'Apex Scatter Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Scatter Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Optimal for exploring data dispersion with accuracy, perfect for visualizing data distribution with precision.'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicScatterChart />
              <ScatterImagesChart />
              <ScatterImageChart />
            </Col>
            <Col sm={6}>
              <DatetimeScatterChart />
              <CategoryScatterChart />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;