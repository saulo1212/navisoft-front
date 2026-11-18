import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { AdvancedTimeLine, BasicTimeLineChart, CustomColorsTimeLine, DumbbellChartTimeLine, MultiSeries, MultiSeriesGroupRows } from './components/TimeLineChart';
export const metadata = {
  title: 'Apex Timeline Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Timeline Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Highly effective for managing and displaying schedules efficiently, presenting chronological data with clarity, and tracking events in a structured sequence.'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicTimeLineChart />
              <MultiSeries />
              <MultiSeriesGroupRows />
            </Col>
            <Col sm={6}>
              <CustomColorsTimeLine />
              <AdvancedTimeLine />
              <DumbbellChartTimeLine />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;