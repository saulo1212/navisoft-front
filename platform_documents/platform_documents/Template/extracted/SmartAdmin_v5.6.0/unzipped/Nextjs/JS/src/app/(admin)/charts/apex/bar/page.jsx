import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BarWithImages, BarwithMarkers, BarWithNegativeValues, BasicBar, CustomDataLabels, GroupedBar, GroupedStacked, PatternedBarChart, ReversedBarChart, StackedBar, StackedBars } from './components/BarChart';
export const metadata = {
  title: 'Apex Bar Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Bar Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Explore these Apex Bar Chart samples to speed up your app’s data comparison development.'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicBar />
              <StackedBar />
              <GroupedStacked />
              <BarwithMarkers />
              <CustomDataLabels />
              <BarWithImages />
            </Col>
            <Col sm={6}>
              <GroupedBar />
              <StackedBars />
              <BarWithNegativeValues />
              <ReversedBarChart />
              <PatternedBarChart />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;