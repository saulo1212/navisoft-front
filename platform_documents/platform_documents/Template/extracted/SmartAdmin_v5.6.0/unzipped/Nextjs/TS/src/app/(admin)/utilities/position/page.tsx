import ComponentCard from '@/components/ComponentCard'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import { PositionFixd, PositionStatic } from './components/Position'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Position' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Position'}
          subTitle1={'Design'}
          subTitle2={'System Utilities'}
          subText={
            'Bootstrap position utilities allow you to control the positioning of elements using CSS properties like relative, absolute, fixed, sticky, and static to create flexible layouts.'
          }
        />
        <div className="main-content">
          <div className="info-container">
            <p className="mb-0">
              Positions can also be changed for mobile viewports by adding the following classes, <code>.position-on-mobile-absolute</code>,{' '}
              <code>.position-on-mobile-relative</code>, and <code>.position-on-mobile-static</code>
            </p>
          </div>

          <Row>
            <Col xl={6}>
              <PositionFixd />
              <PositionRelative />
              <PositionAbsolute />
            </Col>
            <Col xl={6}>
              <PositionSticky />
              <PositionStatic />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page

const PositionRelative = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Position
          <span className="fw-300">
            <i>Relative</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            In <code>.position-relative</code>, the element is positioned relative to itself. However, an absolute positioned element is relative to
            its parent. An element with <code>position: absolute</code> is removed from the normal document flow. ... If it doesn't have any parent
            elements, then the initial document <code>html</code> will be its parent
          </div>
          <Row>
            <Col sm={6}>
              <div className="demo-window rounded shadow-1 mb-4 mb-sm-0">
                <div className="demo-window-content">
                  <div className="d-flex flex-row" style={{ height: '15rem' }}>
                    <div className="flex-grow-1 w-100 bg-info-50 p-3 position-relative d-flex flex-column">
                      <div className="border border-danger flex-grow-1 p-2 position-relative">
                        .position-relative
                        <p className="position-absolute pos-right pos-bottom p-2 bg-fusion-500 m-0">.position-absolute</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={6}>
              <div className="demo-window rounded shadow-1">
                <div className="demo-window-content">
                  <div className="d-flex flex-row" style={{ height: '15rem' }}>
                    <div className="w-100 flex-grow-1 bg-success-50 p-3 position-relative d-flex flex-column">
                      <div className="border border-danger flex-grow-1 p-5 position-relative d-flex flex-column">
                        <div className="position-absolute pos-top pos-left p-2">.position-relative</div>
                        <div className="border border-danger flex-grow-1 p-2 position-relative">
                          .position-relative
                          <p className="position-absolute pos-right pos-bottom p-2 bg-fusion-500 m-0">.position-absolute</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>
  )
}

const PositionAbsolute = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Position
          <span className="fw-300">
            <i>Absolute</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            An element with <code>.position-absolute</code>; is positioned relative to the nearest positioned ancestor (instead of positioned relative
            to the viewport, like fixed). However; if an absolute positioned element has no positioned ancestors, it uses the document body, and moves
            along with page scrolling. You can use <code>.pos-top</code>, <code>.pos-right</code>, <code>.pos-bottom</code>, and{' '}
            <code>.pos-left</code> to position relavant to its closest relative positioned ancenstor
          </div>
          <div className="demo-window rounded mb-g shadow-1">
            <div className="demo-window-content">
              <div className="position-relative" style={{ height: '15rem' }}>
                <div className="bg-primary-50 p-2 position-absolute w-100 pos-top">.position-absolute .pos-top</div>
                <div className="bg-info-50 p-2 position-absolute w-100 pos-bottom">.position-absolute .pos-bottom</div>
                <div
                  className="bg-danger-50 p-2 position-absolute h-100 pos-right d-flex align-items-center justify-content-center"
                  style={{ width: 120 }}>
                  <span className="rotate-270 text-nowrap">.position-absolute .pos-right</span>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger hidden-sm-down d-flex align-items-center"
            data-toggle="popover"
            data-template='<div class="popover max-width-reset" role="tooltip"><div class="arrow"></div><div class="popover-body p-3"></div></div>'
            data-placement="top"
            data-trigger="hover"
            data-html="true"
            data-content='<img src="img/demo/position-absolute.gif" alt="" style="width:360px">'>
            <i className="sa sa-control-play me-2" />
            Live example
          </button>
        </div>
      </div>
    </ComponentCard>
  )
}

const PositionSticky = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Position
          <span className="fw-300">
            <i>Sticky</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              Position an element at the top of the viewport, from edge to edge, but only after you scroll past it. The <code>.sticky-top</code>{' '}
              utility uses CSS’s <code>position: sticky</code>, which isn’t fully supported in all browsers.
            </p>
          </div>
          <div className="demo-window rounded shadow-1 mb-g">
            <div className="demo-window-content">
              <div className="d-flex flex-row">
                <div className="position-relative overflow-auto p-3" style={{ height: 300 }}>
                  <h5 className="fw-500 opacity-70">
                    Sticky Element: Scroll Down to See the Effect
                    <small>Scroll down this page to see how sticky positioning works</small>
                  </h5>
                  <nav className="navbar navbar-expand-lg sticky-top bg-faded">
                    <Link className="navbar-brand d-flex align-items-center fw-500" href="">
                      SmartAdmin v5
                    </Link>
                    <button
                      className="navbar-toggler"
                      type="button"
                      data-toggle="collapse"
                      data-target="#navbarSticky"
                      aria-expanded="false"
                      aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon" />
                    </button>
                    This will be sticky
                  </nav>
                  <br />
                  <p className="opacity-70">Some example text..</p>
                  <h5 className="opacity-70">Scroll back up again to "remove" the sticky position.</h5>
                  <p className="opacity-50">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio,
                    vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices
                  </p>
                  <p>1..</p>
                  <p>...</p>
                  <p>...</p>
                  <p>...</p>
                  <p>4..</p>
                  <p>...</p>
                  <p>...</p>
                  <p>...</p>
                  <p>8..</p>
                  <p>...</p>
                  <p>...</p>
                  <p>...</p>
                  <p>12.</p>
                  <p>...</p>
                  <p>...</p>
                  <p>...</p>
                  <p>16.</p>
                  <p>...</p>
                  <p>...</p>
                  <p>...</p>
                  <p>20.</p>
                  <p>...</p>
                  <p>...</p>
                  <p>...</p>
                  <p>24.</p>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger hidden-sm-down d-flex align-items-center"
            data-toggle="popover"
            data-template='<div class="popover max-width-reset" role="tooltip"><div class="arrow"></div><div class="popover-body p-3"></div></div>'
            data-placement="top"
            data-trigger="hover"
            data-html="true"
            data-content='<img src="img/demo/position-sticky.gif" alt="" style="width:360px">'>
            <i className="sa sa-control-play me-2" />
            Live example
          </button>
        </div>
      </div>
    </ComponentCard>
  )
}
