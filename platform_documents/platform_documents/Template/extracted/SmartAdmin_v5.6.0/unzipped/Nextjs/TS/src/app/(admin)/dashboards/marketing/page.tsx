import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { statistics } from './components/data'
import EfficiencyMetrics from './components/EfficiencyMetrics'
import LiveFeeds from './components/LiveFeeds'
import ReturningTarget from './components/ReturningTarget'
import SalesPerformance from './components/SalesPerformance'
import StatisticCard from './components/StatisticCard'
import StatisticWithChart from './components/StatisticWithChart'

export const metadata: Metadata = { title: 'Marketing Dashboard' }

const Marketing = () => {
  return (
    <div className="content-wrapper">
      <div className="d-flex align-items-end mb-4">
        <PageBreadcrumb title={'Marketing Dashboard'} subTitle1={'Insights'} subTitle2={'Dashboards'} />
        <StatisticWithChart />
      </div>

      <div className="main-content">
        <Row className="sortable-off">
          {statistics.map((item, idx) => (
            <Col md={12} lg={6} xl={3} key={idx}>
              <StatisticCard item={item} />
            </Col>
          ))}
        </Row>

        <Row>
          <Col xl={12}>
            <LiveFeeds />
          </Col>
          <Col xl={6}>
            <ReturningTarget />
          </Col>
          <Col xl={6}>
            <EfficiencyMetrics />
          </Col>
          <Col xl={12}>
            <SalesPerformance />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Marketing
