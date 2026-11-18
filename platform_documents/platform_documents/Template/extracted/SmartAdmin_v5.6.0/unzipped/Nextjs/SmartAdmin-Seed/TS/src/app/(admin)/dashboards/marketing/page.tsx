import PageBreadcrumb from "@/components/PageBreadcrumb";
import {Col, Row} from "react-bootstrap";
import {statistics} from "@/app/(admin)/dashboards/marketing/data";
import StatisticCard from "@/app/(admin)/dashboards/marketing/components/StatisticCard";
import LiveFeeds from "@/app/(admin)/dashboards/marketing/components/LiveFeeds";
import ReturningTarget from "@/app/(admin)/dashboards/marketing/components/ReturningTarget";
import EfficiencyMetrics from "@/app/(admin)/dashboards/marketing/components/EfficiencyMetrics";
import SalesPerformance from "@/app/(admin)/dashboards/marketing/components/SalesPerformance";
import StatisticWithChart from "@/app/(admin)/dashboards/marketing/components/StatisticWithChart";

const Marketing = () => {
    return (
        <div className="content-wrapper">
            <div className="d-flex align-items-end mb-4">
                <PageBreadcrumb title={'Marketing Dashboard'} subTitle1={'Insights'} subTitle2={'Dashboards'}/>
                <StatisticWithChart/>
            </div>

            <div className="main-content">

                <Row className="sortable-off">
                    {statistics.map((item, idx) => (
                        <Col md={12} lg={6} xl={3} key={idx}>
                            <StatisticCard item={item}/>
                        </Col>
                    ))}
                </Row>

                <Row>
                    <Col xl={12}>
                        <LiveFeeds/>
                    </Col>
                    <Col xl={6}>
                        <ReturningTarget/>
                    </Col>
                    <Col xl={6}>
                        <EfficiencyMetrics/>
                    </Col>
                    <Col xl={12}>
                        <SalesPerformance/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Marketing;
