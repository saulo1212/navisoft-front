import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicLine, BrushChart, DashedLine, GradientLine, LineChartWithAnnotations, LineWithDataLabels, MissingNullValues, NegativeValuesWithDifferentColor, SteplineLine, SynchronizedCharts, ZoomableTimeseries } from './components/LineChart';
import RealTimeLineChart from './components/RealTimeLineChart';
export const metadata = {
  title: 'Apex Line Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Line Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Start with a chart that’s on the right path—ideal for showing progress over time...'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicLine />
              <ZoomableTimeseries />
              <SynchronizedCharts />
              <SteplineLine />
              <NegativeValuesWithDifferentColor />
              <RealTimeLineChart />
            </Col>
            <Col sm={6}>
              <LineWithDataLabels />
              <LineChartWithAnnotations />
              <BrushChart />
              <GradientLine />
              <MissingNullValues />
              <DashedLine />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;