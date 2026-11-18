import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { BasicModals, Modifications, SideModals, TransparentModal } from './components/Modals';
import Link from 'next/link';
export const metadata = {
  title: 'Modal'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Modal'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Modal dialogs for lightboxes, user notifications, or completely custom content'} />
        <div className="main-content">
          <div className="info-container">
            <p>
              Modals are built with HTML, CSS, and JavaScript. They're positioned over everything else in the document and remove scroll from the{' '}
              <code>body</code> so that modal content scrolls instead. Bootstrap only supports one modal window at a time. Nested modals aren't
              supported as it is believed to be poor user experiences. Modals use <code>position: fixed</code>, which can sometimes be a bit
              particular about its rendering. Whenever possible, place your modal HTML in a top-level position to avoid potential interference from
              other elements. You'll likely run into issues when nesting a .modal within another fixed element
            </p>
            <p className="mb-0">
              Find in-depth, guidelines, tutorials and more on Bootstrap Modals's at the
              <Link href="https://getbootstrap.com/docs/5.3/components/modal/" target="_blank">
                official documentation
              </Link>
              .
            </p>
          </div>
          <Row>
            <Col xl={6}>
              <BasicModals />
              <SideModals />
            </Col>
            <Col xl={6}>
              <Modifications />
              <TransparentModal />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;