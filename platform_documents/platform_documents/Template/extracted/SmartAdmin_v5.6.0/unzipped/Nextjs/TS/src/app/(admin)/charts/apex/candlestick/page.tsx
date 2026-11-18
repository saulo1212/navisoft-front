import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { BasicCandlestick, CandlestickWithLine, CategoryXAxisCandlestick, ComboCandlestick } from './components/CabdlestickChart'

export const metadata: Metadata = { title: 'Apex Candlestick Chart' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Apex Candlestick Chart'}
          subTitle1={'Data Visualization'}
          subTitle2={'Apex Charts'}
          subText={'Use this page of Apex Candlestick Chart samples to prototype and enhance your app’s trading features.'}
        />
        <div className="main-content">
          <Row>
            <Col sm={6}>
              <BasicCandlestick />
              <ComboCandlestick />
            </Col>
            <Col sm={6}>
              <CategoryXAxisCandlestick />
              <CandlestickWithLine />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
