import PageBreadcrumb from '@/components/PageBreadcrumb';
import Link from 'next/link';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import FuzzyMatching from './components/FuzzyMatching';
export const metadata = {
  title: 'ST: Fuzzy Matching'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Fuzzy Matching'} subTitle1={'Data Visualization'} subTitle2={'Smart Tables'} subText={`Fuzzy Matching allows matching text that isn't an exact match, making search more forgiving and intuitive.`} />
        <div className="main-content">
          <div className="info-container">
            <p className="mb-0">
              Adjust the settings below to see how different fuzzy matching parameters affect search results. After configuring your settings, click
              <strong>Build Table</strong> to initialize the table with those settings. To apply new settings, click <strong>Destroy Table</strong>
              and then <strong>Build Table</strong> again.
              <Link href="" target="_blank">
                See Documentation →
              </Link>
            </p>
          </div>

          <Row>
            <Col lg={12}>
              <Card className="mb-g">
                <CardBody>
                  <FuzzyMatching />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;