import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicColumn, ColumnWithDataLabels, ColumnWithGroupLabel, ColumnWithMarkers, ColumnWithNegativeValues, ColumnWithRotatedLabels, DistributedColumns, DumbbellChart, GroupedStackedColumn, StackedColumn, StackedColumns100 } from './components/ColumnChart';
import { DynamicLoadedChart } from './components/DynamicLoadedChart';
export const metadata = {
  title: 'Apex Column Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Column Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Utilize this collection of Apex Chart examples to simplify your comparative analysis.'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicColumn />
              <StackedColumn />
              <GroupedStackedColumn />
              <ColumnWithMarkers />
              <ColumnWithRotatedLabels />
              <DynamicLoadedChart />
            </Col>
            <Col sm={6}>
              <ColumnWithDataLabels />
              <StackedColumns100 />
              <DumbbellChart />
              <ColumnWithGroupLabel />
              <ColumnWithNegativeValues />
              <DistributedColumns />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;