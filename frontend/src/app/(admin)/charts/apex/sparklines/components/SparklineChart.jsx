'use client';

import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import ComponentCard from '@/components/ComponentCard';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { spark1Options, spark2Options, spark3Options, spark4Options, spark5Options, spark6Options } from './data';
export const BasicSparklineChart = () => {
  return <ComponentCard title={<h2>
          Basic
          <span className="fw-light">
            <i>Sparklines</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <Row className="m-0">
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="mb-0">Sales</h5>
                      <span className="text-muted">Monthly</span>
                    </div>
                    <h3 className="text-success mb-0">+24%</h3>
                  </div>
                  <ApexChartClient getOptions={spark1Options} series={spark1Options().series} type="line" height={80} />
                </CardBody>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="mb-0">Revenue</h5>
                      <span className="text-muted">Quarterly</span>
                    </div>
                    <h3 className="text-success mb-0">+17%</h3>
                  </div>
                  <ApexChartClient getOptions={spark2Options} series={spark2Options().series} type="bar" height={80} />
                </CardBody>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="mb-0">Customers</h5>
                      <span className="text-muted">Daily</span>
                    </div>
                    <h3 className="text-danger mb-0">-3%</h3>
                  </div>
                  <ApexChartClient getOptions={spark3Options} series={spark3Options().series} type="area" height={80} />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="m-0">
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="mb-0">Orders</h5>
                      <span className="text-muted">Weekly</span>
                    </div>
                    <h3 className="text-success mb-0">+12%</h3>
                  </div>
                  <ApexChartClient getOptions={spark4Options} series={spark4Options().series} type="area" height={80} />
                </CardBody>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="mb-0">Engagement</h5>
                      <span className="text-muted">Monthly</span>
                    </div>
                    <h3 className="text-success mb-0">+8%</h3>
                  </div>
                  <ApexChartClient getOptions={spark5Options} series={spark5Options().series} type="area" height={80} />
                </CardBody>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="mb-0">Conversion</h5>
                      <span className="text-muted">Monthly</span>
                    </div>
                    <h3 className="text-success mb-0">+5%</h3>
                  </div>
                  <ApexChartClient getOptions={spark6Options} series={spark6Options().series} type="bar" height={80} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>;
};