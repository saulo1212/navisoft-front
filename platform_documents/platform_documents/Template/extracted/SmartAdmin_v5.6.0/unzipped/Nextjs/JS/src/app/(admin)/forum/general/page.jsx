import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import ForumCategory from './components/ForumCategory';
export const metadata = {
  title: 'Forum View'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Forum View'} subTitle1={'Layouts'} subTitle2={'Miscellaneous'} subText="Full forum view system, with threads and posts." />
        <div className="main-content">
          <Row>
            <Col xl={12}>
              <ForumCategory />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;