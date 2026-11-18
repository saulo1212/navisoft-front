import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Button, Col, FormControl, Row } from 'react-bootstrap';
import AccountInformation from './components/AccountInformation';
import Pagination from './components/Pagination';
export const metadata = {
  title: 'Forum: Threads'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Forum: Threads'} subTitle1={'Layouts'} subTitle2={'Miscellaneous'} subText={`Thread view with posts, replies, pagination, etc, with a functional "New Thread" button.`} />
        <div className="main-content">
          <Row>
            <Col xl={12}>
              <div className="input-group input-group-lg mb-g">
                <FormControl type="text" className="shadow-inset-2" placeholder="Search Threads" />
                <Button variant="outline-default" className="waves-effect" type="button">
                  <i className="fal fa-search" />
                </Button>
              </div>
              <AccountInformation />
              <Pagination />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;