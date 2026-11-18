import PageBreadcrumb from '@/components/PageBreadcrumb';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import { BordersIcons, DefaultPanel, DefaultPills, DefaultTabs, DirectionalPills, DirectionalTabs, JustifiedPills, JustifiedTabs, PillBorderAndIcon, PillsAsNav, PillVertical, TabSizes } from './components/Tabs';
export const metadata = {
  title: 'Tabs & Pills'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Tabs & Pills'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Takes the basic nav from above and adds the .nav-tabs class to generate a tabbed interface. Use them to create tabbable regions with our tab JavaScript plugin.'} />
        <div className="main-content">
          <div className="info-container">
            <p>
              Tabs and pills are UI components that allow users to navigate between different sections of content without leaving the current page.
              They enhance user experience by organizing information in a compact and accessible manner, making it easier to switch between related
              content areas. This interface is particularly useful for displaying content that is closely related but requires separation for clarity.
            </p>
            <p className="mb-0">
              Learn more about this component on bootstrap's
              <Link href="https://getbootstrap.com/docs/5.3/components/tabs/" target="_blank">
                official documentation
              </Link>
              .
            </p>
          </div>
          <Row>
            <Col xl={6}>
              <DefaultTabs />
              <TabSizes />
              <DirectionalTabs />
              <JustifiedTabs />
              <BordersIcons />
              <DefaultPanel />
            </Col>
            <Col xl={6}>
              <DefaultPills />
              <PillsAsNav />
              <DirectionalPills />
              <JustifiedPills />
              <PillBorderAndIcon />
              <PillVertical />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;