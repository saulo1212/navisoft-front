import ComponentCard from '@/components/ComponentCard';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
export const metadata = {
  title: 'Sizing'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Sizing'} subTitle1={'Design'} subTitle2={'System Utilities'} subText={'Easily make an element as wide or as tall with our width and height utilities.'} />
        <div className="main-content">
          <div className="info-container">
            <p className="mb-0">
              You are able to reset the height and width of an object by adding class <code>.height-mobile-auto</code> and{' '}
              <code>.width-mobile-auto</code>. Expand full height and width of your mobile device by adding <code>.expand-full-height-on-mobile</code>{' '}
              and <code>.expand-full-width-on-mobile</code>. Reset max and minium width/height by using the following modifier: <code>.h-auto</code>,{' '}
              <code>.w-auto</code>, <code>.max-width-reset</code>, <code>.max-height-reset</code>, and <code>.min-width-0</code>
            </p>
          </div>

          <Row>
            <Col xl={12}>
              <WidthPresets />
              <HeightPresets />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;
const WidthPresets = () => {
  return <ComponentCard title={<h2>
          Width
          <span className="fw-300">
            <i>presets</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Uniform widths to keep things aligned. See <code>helpers.scss</code> file for more details. You can also set <code>.width-0</code> to
            remove any given width, or you can use <code>.w-auto</code> to undo explicitly specified widths
          </div>
          <Row>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-1</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 1.5rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-2</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 2rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-2" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-3</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 2.5rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-3" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-4</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 2.75rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-4" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-5</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 3rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-5" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-6</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 3.25rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-6" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-7</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 3.5rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-7" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-8</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 3.75rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-8" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-9</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 4rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-9" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-10</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 4.25rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-10" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-xs</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>
                      change <u>min-width</u> to 5rem
                    </i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-xs" style={{
                  maxWidth: '5rem'
                }} />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-sm</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>
                      change <u>min-width</u> to 10rem
                    </i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-sm" style={{
                  maxWidth: '10rem'
                }} />
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-lg</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>
                      change <u>min-width</u> to 15rem
                    </i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-lg" style={{
                  maxWidth: '15rem'
                }} />
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.width-xl</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>
                      change <u>min-width</u> to 20rem
                    </i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 width-xl" style={{
                  maxWidth: '20rem'
                }} />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <hr className="my-5" />
          <Row>
            <Col md={6} lg={2} xl={3}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.w-25</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 25%</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 w-25" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={2} xl={3}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.w-50</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 50%</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 w-50" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={2} xl={3}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.w-75</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 75%</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 w-75" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={2} xl={3}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.w-100</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change width to 100%</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-danger-50 height-1 opacity-50 mt-2 w-100" />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>;
};
const HeightPresets = () => {
  return <ComponentCard title={<h2>
          Height
          <span className="fw-300">
            <i>presets</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Uniform heights to keep things aligned. See <code>variables.scss</code> file for more details on <code>$p-*</code> values.
          </div>
          <Row data-masonry='{"percentPosition": true }'>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-1</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 1.5rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-1 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-2</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 2rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-2 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-3</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 2.5rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-3 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-4</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 2.75rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-4 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-5</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 3rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-5 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-6</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 3.25rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-6 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-7</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 3.5rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-7 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-8</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 3.75rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-8 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-9</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 4rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-9 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-10</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 4.25rem</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-10 opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-xs</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>
                      change <u>min-height</u> to 5rem
                    </i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-xs opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-sm</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>
                      change <u>min-height</u> to 10rem
                    </i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-sm opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-lg</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>
                      change <u>min-height</u> to 15rem
                    </i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-lg opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4} xl={4}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.height-xl</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>
                      change <u>min-height</u> to 20rem
                    </i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block bg-info-50 height-xl opacity-50 mt-2 width-1" />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <hr className="my-5" />
          <Row>
            <Col md={6} lg={2} xl={3}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.h-25</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 25%</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block height-10 mt-2 width-1 border border-primary">
                    <div className="d-block bg-info-500 h-25 opacity-50 width-1" />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={2} xl={3}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.h-50</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 50%</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block height-10 mt-2 width-1 border border-primary">
                    <div className="d-block bg-info-500 h-50 opacity-50 width-1" />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={2} xl={3}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.h-75</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 75%</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block height-10 mt-2 width-1 border border-primary">
                    <div className="d-block bg-info-500 h-75 opacity-50 width-1" />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={2} xl={3}>
              <Card className="shadow-1 shadow-hover-5 mb-g">
                <CardBody className="p-3">
                  <strong>Class</strong>
                  <p>
                    <code>.h-100</code>
                  </p>
                  <strong>Description</strong>
                  <p className="text-muted">
                    <i>change height to 100%</i>
                  </p>
                  <strong>Example</strong>
                  <div className="d-block height-10 mt-2 width-1 border border-primary">
                    <div className="d-block bg-info-500 h-100 opacity-50 width-1" />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>;
};