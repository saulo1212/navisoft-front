import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Row } from 'react-bootstrap'
import { DidYouMeanSuggestions, NestedStructure } from './components/ListFilter'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'List Filter' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Smart Filter'}
          subTitle1={'Components'}
          subTitle2={'UI Components'}
          subText={'Advanced navigation filtering with fuzzy search capabilities.'}
        />
        <div className="main-content">
          <Row>
            <Col xl={6}>
              <DidYouMeanSuggestions />
            </Col>
            <Col xl={6}>
              <NestedStructure />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
