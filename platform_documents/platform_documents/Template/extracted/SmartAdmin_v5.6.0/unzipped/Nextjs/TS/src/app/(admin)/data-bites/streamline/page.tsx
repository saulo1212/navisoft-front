import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Row } from 'react-bootstrap'
import { AreaChart, BarChart, DiscreteChart, LineChart, PieChart, TristateChart } from './components/StreamlineChart'
import Link from 'next/link'

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Streamline'}
          subTitle1={'Data Visualization'}
          subTitle2={'Data Bites'}
          subText={'A lightweight, dependency-free JavaScript library for generating sparkline charts.'}
        />
        <div className="main-content">
          <div className="info-container">
            Streamline is a lightweight, dependency-free JavaScript library for generating mini graphs. This in-house plugin is designed to be
            flexible and customizable to your needs. If you'd like to request additional features, please don’t hesitate to{' '}
            <Link href="https://wrapbootstrap.com/user/MyOrange/message" target="_blank">
              contact us
            </Link>
            .
          </div>

          <Row>
            <Col xl={6}>
              <LineChart />
              <BarChart />
              <TristateChart />
            </Col>
            <Col xl={6}>
              <AreaChart />
              <DiscreteChart />
              <PieChart />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
