import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { DonutUpdate, DonutWithPattern, GradientDonut, MonochromePie, PieWithImageChart, SemiDonut, SimpleDonut, SimplePieChart } from './components/PieDonuts';
export const metadata = {
  title: 'Apex Pie/Donut Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Pie/Donut Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Slice into success with a tasty pie chart—perfect for dishing out delicious proportions with a grin!'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <SimplePieChart />
              <DonutUpdate />
              <GradientDonut />
              <DonutWithPattern />
            </Col>
            <Col sm={6}>
              <SimpleDonut />
              <MonochromePie />
              <SemiDonut />
              <PieWithImageChart />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;