import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Card, Col, Container, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Responsive' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Responsive Grid'}
          subTitle1={'Design'}
          subTitle2={'System Utilities'}
          subText={
            'Use our powerful mobile-first flexbox grid to build layouts of all shapes and sizes thanks to a twelve column system, six default responsive tiers, and dozens of predefined classes.'
          }
        />
        <div className="main-content">
          <table className="table table-bordered table-striped table-transparant table-responsive rounded overflow-hidden mb-g">
            <thead className="bg-warning-700">
              <tr>
                <th className="border-top-0" />
                <th className="text-center">
                  Extra small
                  <br />
                  <small className="fw-normal">&lt;576px</small>
                </th>
                <th className="text-center">
                  Small
                  <br />
                  <small className="fw-normal">≥576px</small>
                </th>
                <th className="text-center">
                  Medium
                  <br />
                  <small className="fw-normal">≥768px</small>
                </th>
                <th className="text-center">
                  Large
                  <br />
                  <small className="fw-normal">≥992px</small>
                </th>
                <th className="text-center">
                  Extra large
                  <br />
                  <small className="fw-normal">≥1200px</small>
                </th>
                <th className="text-center">
                  XX large
                  <br />
                  <small className="fw-normal">≥1400px</small>
                </th>
                <th className="text-center">
                  XXX large
                  <br />
                  <small className="fw-normal">≥1599px</small>
                </th>
              </tr>
            </thead>
            <tbody className="bg-warning-100">
              <tr>
                <th>Grid behavior</th>
                <td>Horizontal at all times</td>
                <td colSpan={3}>Collapsed to start</td>
                <td colSpan={3}>horizontal above breakpoints</td>
              </tr>
              <tr>
                <th>Max container</th>
                <td>None (auto)</td>
                <td>540px</td>
                <td>720px</td>
                <td>960px</td>
                <td>1140px</td>
                <td>1320px</td>
                <td>1500px</td>
              </tr>
              <tr>
                <th>Class prefix</th>
                <td>
                  <code>.col-</code>
                </td>
                <td>
                  <code>.col-sm-</code>
                </td>
                <td>
                  <code>.col-md-</code>
                </td>
                <td>
                  <code>.col-lg-</code>
                </td>
                <td>
                  <code>.col-xl-</code>
                </td>
                <td>
                  <code>.col-xxl-</code>
                </td>
                <td>
                  <code>.col-xxxl-</code>
                </td>
              </tr>
              <tr>
                <th>Number of columns</th>
                <td colSpan={7}>12</td>
              </tr>
              <tr>
                <th>Max column width</th>
                <td className="text-muted">Auto</td>
                <td>60px</td>
                <td>78px</td>
                <td>95px</td>
                <td>95px</td>
                <td>95px</td>
                <td>95px</td>
              </tr>
              <tr>
                <th>Gutter width</th>
                <td colSpan={7}>1.5rem (0.75rem on left and right)</td>
              </tr>
              <tr>
                <th>Custom gutters</th>
                <td colSpan={7}>Yes</td>
              </tr>
              <tr>
                <th>Nestable</th>
                <td colSpan={7}>Yes</td>
              </tr>
              <tr>
                <th>Column ordering</th>
                <td colSpan={7}>Yes</td>
              </tr>
            </tbody>
          </table>

          <Card className="p-g d-block">
            <h5 className="mb-3 fw-600">
              How it works
              <small>
                Bootstrap's grid system uses a series of containers, rows, and columns to layout and align content. It's built with flexbox and is
                fully responsive. Below is an example and an in-depth look at how the grid comes together.
              </small>
            </h5>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <div className="col-sm">One of three columns</div>
                    <div className="col-sm">One of three columns</div>
                    <div className="col-sm">One of three columns</div>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="mt-3 fw-700">
              <span className="text-uppercase">Auto-layout columns</span>
              <small>
                Utilize breakpoint-specific column classes for equal-width columns. Add any number of unit-less classes for each breakpoint you need
                and every column will be the same width.
              </small>
            </h6>
            <h6 className="fw-700">
              <span className="text-uppercase">Equal-width </span>
              <small>
                For example, here are two grid layouts that apply to every device and viewport, from <code>xs</code> to <code>xl</code>.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <Col>1 of 2</Col>
                    <Col>1 of 2</Col>
                  </Row>
                  <Row>
                    <Col>1 of 3</Col>
                    <Col>1 of 3</Col>
                    <Col>1 of 3</Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Setting one column width </span>
              <small>
                Auto-layout for flexbox grid columns also means you can set the width of one column and the others will automatically resize around
                it. You may use predefined grid classes (as shown below), grid mixins, or inline widths. Note that the other columns will resize no
                matter the width of the center column.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <Col>1 of 3</Col>
                    <Col xs={6}>2 of 3 (wider)</Col>
                    <Col>3 of 3</Col>
                  </Row>
                  <Row>
                    <Col>1 of 3</Col>
                    <Col xs={5}>2 of 3 (wider)</Col>
                    <Col>3 of 3</Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Variable width content</span>
              <small>
                Using the
                <code>
                  col-{'{'}breakpoint{'}'}-auto
                </code>
                classes, columns can size itself based on the natural width of its content. This is super handy with single line content like inputs,
                numbers, etc. This, in conjunction with horizontal alignment classes, is very useful for centering layouts with uneven column sizes as
                viewport width changes.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row className="justify-content-md-center">
                    <Col lg={2} className="col">
                      1 of 3
                    </Col>
                    <Col xs={12} className="col-md-auto">
                      Variable width content
                    </Col>
                    <Col lg={2} className="col">
                      3 of 3
                    </Col>
                  </Row>
                  <Row>
                    <Col>1 of 3</Col>
                    <Col xs={12} className="col-md-auto">
                      Variable width content
                    </Col>
                    <Col lg={2} className="col">
                      3 of 3
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Equal-width multi-row</span>
              <small>
                Create equal-width columns that span multiple rows by inserting a <code>.w-100</code> where you want the columns to break to a new
                line. Make the breaks responsive by mixing the <code>.w-100</code> with some responsive display utilities.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <Col>col</Col>
                    <Col>col</Col>
                    <div className="w-100" />
                    <Col>col</Col>
                    <Col>col</Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Responsive classes</span>
              <small>
                Bootstrap's grid includes five tiers of predefined classes for building complex responsive layouts. Customize the size of your columns
                on extra small, small, medium, large, or extra large devices however you see fit.
              </small>
            </h6>
            <h6 className="fw-700">
              <span className="text-uppercase">All breakpoints</span>
              <small>
                For grids that are the same from the smallest of devices to the largest, use the <code>.col</code> and <code>.col-*</code> classes.
                Specify a numbered class when you need a particularly sized column; otherwise, feel free to stick to <code>.col</code>.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <Col>col</Col>
                    <Col>col</Col>
                    <Col>col</Col>
                    <Col>col</Col>
                  </Row>
                  <Row>
                    <Col xs={8}>col-8</Col>
                    <Col xs={4}>col-4</Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Stacked to horizontal </span>
              <small>
                Using a single set of <code>.col-sm-*</code> classes, you can create a basic grid system that starts out stacked on extra small
                devices before becoming horizontal on desktop (medium) devices.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <Col sm={8}>col-sm-8</Col>
                    <Col sm={4}>col-sm-4</Col>
                  </Row>
                  <Row>
                    <div className="col-sm">col-sm</div>
                    <div className="col-sm">col-sm</div>
                    <div className="col-sm">col-sm</div>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Mix and match</span>
              <small>
                Don't want your columns to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the
                example below for a better idea of how it all works.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <Col md={8} className="col">
                      .col .col-md-8
                    </Col>
                    <Col xs={6} md={4}>
                      .col-6 .col-md-4
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4}>
                      .col-6 .col-md-4
                    </Col>
                    <Col xs={6} md={4}>
                      .col-6 .col-md-4
                    </Col>
                    <Col xs={6} md={4}>
                      .col-6 .col-md-4
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>.col-6</Col>
                    <Col xs={6}>.col-6</Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Alignment</span>
              <small>
                Use flexbox alignment utilities to vertically and horizontally align columns. Bootstrap 5 uses a flexbox-based grid system.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row bd-example-row-flex-cols">
                <Container className="container-demo">
                  <Row className="align-items-start">
                    <Col>One of three columns</Col>
                    <Col>One of three columns</Col>
                    <Col>One of three columns</Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col>One of three columns</Col>
                    <Col>One of three columns</Col>
                    <Col>One of three columns</Col>
                  </Row>
                  <Row className="align-items-end">
                    <Col>One of three columns</Col>
                    <Col>One of three columns</Col>
                    <Col>One of three columns</Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Horizontal alignment</span>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row className="justify-content-start">
                    <Col xs={4}>One of two columns</Col>
                    <Col xs={4}>One of two columns</Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col xs={4}>One of two columns</Col>
                    <Col xs={4}>One of two columns</Col>
                  </Row>
                  <Row className="justify-content-end">
                    <Col xs={4}>One of two columns</Col>
                    <Col xs={4}>One of two columns</Col>
                  </Row>
                  <Row className="justify-content-around">
                    <Col xs={4}>One of two columns</Col>
                    <Col xs={4}>One of two columns</Col>
                  </Row>
                  <Row className="justify-content-between">
                    <Col xs={4}>One of two columns</Col>
                    <Col xs={4}>One of two columns</Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Gutters</span>
              <small>
                Gutters can be responsively adjusted using gutter modifier classes. For example: <code>.g-0</code> removes gutters, <code>.g-4</code>
                sets gutters to 1.5rem, and <code>.g-*-*</code> classes can be used for responsive gutter widths.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row className="g-0">
                    <Col xs={6}>.col-6 .g-0</Col>
                    <Col xs={6}>.col-6 .g-0</Col>
                  </Row>
                  <Row className="g-4">
                    <Col xs={6}>.col-6 .g-4</Col>
                    <Col xs={6}>.col-6 .g-4</Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Column ordering with order classes</span>
              <small>
                Use <code>.order-</code> classes for controlling the visual order of your content. These classes are responsive, so you can set the
                order by breakpoint (e.g., <code>.order-1.order-md-2</code>).
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <Col className="order-last">First, but last</Col>
                    <Col>Second, but unordered</Col>
                    <Col className="order-first">Third, but first</Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Offset classes</span>
              <small>
                Move columns to the right using <code>.offset-md-*</code> classes. These classes increase the left margin of a column by * columns.
                For example, <code>.offset-md-4</code> moves <code>.col-md-4</code> over four columns.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <Col md={4}>.col-md-4</Col>
                    <Col md={4} className="offset-md-4">
                      .col-md-4 .offset-md-4
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3} className="offset-md-3">
                      .col-md-3 .offset-md-3
                    </Col>
                    <Col md={3} className="offset-md-3">
                      .col-md-3 .offset-md-3
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Push and pull</span>
              <small>
                Easily change the order of our built-in grid columns with <code>.push-md-*</code> and <code>.pull-md-*</code> modifier classes.
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <Col md={9} className="push-md-3">
                      .col-md-9 .push-md-3
                    </Col>
                    <Col md={3} className="pull-md-9">
                      .col-md-3 .pull-md-9
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
            <hr />
            <h6 className="fw-700">
              <span className="text-uppercase">Nesting</span>
              <small>
                To nest your content with the default grid, add a new <code>.row</code> and set of <code>.col-sm-*</code> columns within an existing
                <code>.col-sm-*</code> column. Nested rows should include a set of columns that add up to 12 or fewer (it is not required that you use
                all 12 available columns).
              </small>
            </h6>
            <div className="bd-example">
              <div className="bd-example-row">
                <Container className="container-demo">
                  <Row>
                    <Col sm={9}>
                      Level 1: .col-sm-9
                      <Row>
                        <Col xs={8} sm={6}>
                          Level 2: .col-8 .col-sm-6
                        </Col>
                        <Col xs={4} sm={6}>
                          Level 2: .col-4 .col-sm-6
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Page
