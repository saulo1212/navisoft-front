import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicArea, DatetimeXAxis, GithubStyleArea, IrregularTimeseriesArea, MissingNullValues, NegativeArea, SplineArea, StackedArea } from './components/AreaChart';
export const metadata = {
  title: 'Apex Area Charts'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Area Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Build on a solid foundation with an area chart display.'} />
        <div className="main-content">
          <div className="info-container">Explore these Apex Area Chart samples to accelerate your app’s data visualization development.</div>

          <Row>
            <Col sm={6}>
              <BasicArea />
              <DatetimeXAxis />
              <GithubStyleArea />
              <IrregularTimeseriesArea />
            </Col>
            <Col sm={6}>
              <SplineArea />
              <NegativeArea />
              <StackedArea />
              <MissingNullValues />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;