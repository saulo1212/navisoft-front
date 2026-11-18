import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { AligningPagination, BasicExample, DifferentStates, PaginationSizing, UsingIcon } from './components/Pagination';
export const metadata = {
  title: 'Pagination'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Pagination'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Examples for showing pagination to indicate a series of related content exists across multiple pages.'} />
        <div className="main-content">
          <Row>
            <Col xl={6}>
              <BasicExample />
              <DifferentStates />
              <UsingIcon />
            </Col>
            <Col xl={6}>
              <PaginationSizing />
              <AligningPagination />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;