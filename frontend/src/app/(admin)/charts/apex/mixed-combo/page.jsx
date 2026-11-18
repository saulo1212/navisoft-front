import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { LineAndArea, LineColumn, LineColumnArea, LineScatterMixed, MultipleYAxis } from './components/MixedComboChart';
export const metadata = {
  title: 'Apex Mixed/Combo Chart'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Apex Mixed/Combo Chart'} subTitle1={'Data Visualization'} subTitle2={'Apex Charts'} subText={'Mix it up with a chart party—perfect for tackling complex data maps, ideal for juggling multiple data, blending complex datasets.'} />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <LineColumn />
              <LineAndArea />
              <LineScatterMixed />
            </Col>
            <Col sm={6}>
              <MultipleYAxis />
              <LineColumnArea />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;