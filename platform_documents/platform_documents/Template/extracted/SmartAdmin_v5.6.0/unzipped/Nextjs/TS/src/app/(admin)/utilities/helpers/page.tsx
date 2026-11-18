import demoNg from '@/assets/img/demo/avatars/ng.jpg'
import ComponentCard from '@/components/ComponentCard'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Col, FormLabel, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Helpers' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Helpers'}
          subTitle1={'Design'}
          subTitle2={'System Utilities'}
          subText={'Quickly fix layouts, manage positions, add shadows, and more'}
        />
        <div className="main-content">
          <div id="helper-filter-list">
            <Row>
              <Col xl={6}>
                <Rowgrids />
                <PositionAndZIndex />
                <DemoWindow />
                <OpacityPresets />
                <HoverBackground />
                <CursorPointer />
                <FocusRings />
                <BackgroundTricks />
              </Col>
              <Col xl={6}>
                <ShadowPresets />
                <ShadowHovers />
                <ChildHover />
                <GradientPresent />
                <ZIndexPresent />
                <RatioAndObject />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page

const Rowgrids = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="position absolute z-index">
          Row
          <span className="fw-300">
            <i>grids</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add borders to your columns by adding <code>.row-grid</code> to any <code>.row</code>, make sure to include <code>.g-0</code> modifer
          </div>
          <div className="border-faded">
            <Row className="row-grid g-0">
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
              <Col sm={3} className="p-3" />
            </Row>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const PositionAndZIndex = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="row grid border">
          Position
          <span className="fw-300">
            <i>and z-index</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Control position with the codes <code>start-0</code>, <code>end-0</code>, <code>top-0</code>, <code>bottom-0</code>, and
            <code>translate-middle</code>;
          </div>
          <div className="border border-primary p-3">
            <div className="position-relative height-sm w-100">
              <div className="d-block p-2 bg-primary-400 rounded-pill position-absolute top-0 start-0">.top-0 .start-0 </div>
              <div className="d-block p-2 bg-primary-400 rounded-pill position-absolute top-0 end-0">.top-0 .end-0</div>
              <div className="d-block p-2 bg-primary-400 rounded-pill position-absolute top-50 start-50">.top-50 .start-50</div>
              <div className="d-block p-2 bg-primary-400 rounded-pill position-absolute bottom-50 end-50">.bottom-50 .end-50</div>
              <div className="d-block p-2 bg-primary-400 rounded-pill position-absolute bottom-0 start-0">.bottom-0 .start-0</div>
              <div className="d-block p-2 bg-primary-400 rounded-pill position-absolute bottom-0 end-0">.bottom-0 .end-0</div>
              <div className="d-block p-1 bg-dark text-light fs-xs rounded-pill position-absolute translate-middle top-50 start-50 shadow-5">
                .translate-middle
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const DemoWindow = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="demo window">
          Demo
          <span className="fw-300">
            <i>window</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Use demo window wrapper <code>.demo-window</code> to portray a focal point for images, demo objects, data, tables or layout properties.
            Place content inside <code>.demo-window-content</code>
          </div>
          <div className="demo-window rounded height-sm">
            <div className="demo-window-content p-3">
              <div className="alert alert-info">You can place any html objects in here.</div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const OpacityPresets = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="opacity opacity- presets">
          Opacity
          <span className="fw-300">
            <i>presets</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Uniform widths to keep things aligned. See <code>helpers.scss</code> file for more details. You can also set <code>.width-0</code> to
            remove any given width, or you can use <code>.w-auto</code> to undo explicitly specified widths
          </div>
          <div className="form-group mb-2">
            <FormLabel>Select range</FormLabel>
            <input className="form-control unstyled" id="js_opacity_range" type="range" name="range" min={5} max={100} step={5} defaultValue={5} />
          </div>
          <div className="mb-g">
            <div className="fw-500 mb-2">Class</div>
            <div>
              <code id="js_opacity_class">.opacity-5</code>
            </div>
          </div>
          <div>
            <div className="fw-500 mb-2">Example</div>
            <Image src={demoNg} className="rounded-circle width-3 h-auto opacity-5" id="js_opacity" alt="" />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const HoverBackground = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="hover background">
          Hover
          <span className="fw-300">
            <i>background</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Hover any background with <code>.hover-bg</code>
          </div>
          <Row>
            <Col sm={6} md={6} xl={4}>
              <div className="rounded mb-g border border-faded bg-primary-500 color-fusion-300">
                <div className="p-3 hover-bg rounded">
                  <strong>Parent class</strong>
                  <p>
                    <code>bg-primary-500 color-fusion-300</code>
                  </p>
                  <strong>Child class</strong>
                  <p>
                    <code>hover-bg</code>
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={6} md={6} xl={4}>
              <div className="rounded mb-g border border-faded bg-info-500 color-fusion-300">
                <div className="p-3 hover-bg rounded">
                  <strong>Parent class</strong>
                  <p>
                    <code>bg-info-500 color-fusion-300</code>
                  </p>
                  <strong>Child class</strong>
                  <p>
                    <code>hover-bg</code>
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={6} md={6} xl={4}>
              <div className="rounded mb-g border border-faded bg-warning-500 color-fusion-300">
                <div className="p-3 hover-bg rounded">
                  <strong>Parent class</strong>
                  <p>
                    <code>bg-warning-500 color-fusion-300</code>
                  </p>
                  <strong>Child class</strong>
                  <p>
                    <code>hover-bg</code>
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={6} md={6} xl={4}>
              <div className="rounded mb-g border border-faded bg-success-500 color-fusion-300">
                <div className="p-3 hover-bg rounded">
                  <strong>Parent class</strong>
                  <p>
                    <code>bg-success-500 color-fusion-300</code>
                  </p>
                  <strong>Child class</strong>
                  <p>
                    <code>hover-bg</code>
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={6} md={6} xl={4}>
              <div className="rounded mb-g border border-faded bg-danger-500 color-fusion-300">
                <div className="p-3 hover-bg rounded">
                  <strong>Parent class</strong>
                  <p>
                    <code>bg-danger-500 color-fusion-300</code>
                  </p>
                  <strong>Child class</strong>
                  <p>
                    <code>hover-bg</code>
                  </p>
                </div>
              </div>
            </Col>
            <Col sm={6} md={6} xl={4}>
              <div className="rounded mb-g border border-faded bg-fusion-500 color-fusion-300">
                <div className="p-3 hover-bg rounded">
                  <strong>Parent class</strong>
                  <p>
                    <code>bg-fusion-500 color-white</code>
                  </p>
                  <strong>Child class</strong>
                  <p>
                    <code>hover-bg</code>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>
  )
}

const CursorPointer = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="cursor pointer mouse">
          Cursor
          <span className="fw-300">
            <i>pointers</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Change your cursor pointer with these classes</div>
          <div className="demo d-flex flex-wrap justify-content-evenly gap-1">
            <div className="btn bg-faded cursor-auto">cursor-auto</div>
            <div className="btn bg-faded cursor-crosshair">cursor-crosshair</div>
            <div className="btn bg-faded cursor-default">cursor-default</div>
            <div className="btn bg-faded cursor-e-resize">cursor-e-resize</div>
            <div className="btn bg-faded cursor-help">cursor-help</div>
            <div className="btn bg-faded cursor-move">cursor-move</div>
            <div className="btn bg-faded cursor-n-resize">cursor-n-resize</div>
            <div className="btn bg-faded cursor-ne-resize">cursor-ne-resize</div>
            <div className="btn bg-faded cursor-nw-resize">cursor-nw-resize</div>
            <div className="btn bg-faded cursor-pointer">cursor-pointer</div>
            <div className="btn bg-faded cursor-progress">cursor-progress</div>
            <div className="btn bg-faded cursor-s-resize">cursor-s-resize</div>
            <div className="btn bg-faded cursor-se-resize">cursor-se-resize</div>
            <div className="btn bg-faded cursor-sw-resize">cursor-sw-resize</div>
            <div className="btn bg-faded cursor-text">cursor-text</div>
            <div className="btn bg-faded cursor-w-resize">cursor-w-resize</div>
            <div className="btn bg-faded cursor-wait">cursor-wait</div>
            <div className="btn cursor-inherit">cursor-inherit</div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const FocusRings = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="cursor pointer mouse">
          Focus
          <span className="fw-300">
            <i>Rings</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              The <code>.focus-ring</code> helper removes the default <code>outline</code> on <code>:focus</code>, replacing it with a
              <code>box-shadow</code> that can be more broadly customized. The new shadow is made up of a series of CSS variables, inherited from the
              <code>:root</code> level, that can be modified for any element or component.
            </p>
          </div>
          <div className="demo d-flex flex-wrap justify-content-evenly gap-1">
            <p>
              <Link href="" className="d-inline-flex focus-ring focus-ring-primary py-1 px-2 text-decoration-none border rounded-2">
                Primary focus
              </Link>
            </p>
            <p>
              <Link href="" className="d-inline-flex focus-ring focus-ring-secondary py-1 px-2 text-decoration-none border rounded-2">
                Secondary focus
              </Link>
            </p>
            <p>
              <Link href="" className="d-inline-flex focus-ring focus-ring-success py-1 px-2 text-decoration-none border rounded-2">
                Success focus
              </Link>
            </p>
            <p>
              <Link href="" className="d-inline-flex focus-ring focus-ring-danger py-1 px-2 text-decoration-none border rounded-2">
                Danger focus
              </Link>
            </p>
            <p>
              <Link href="" className="d-inline-flex focus-ring focus-ring-warning py-1 px-2 text-decoration-none border rounded-2">
                Warning focus
              </Link>
            </p>
            <p>
              <Link href="" className="d-inline-flex focus-ring focus-ring-info py-1 px-2 text-decoration-none border rounded-2">
                Info focus
              </Link>
            </p>
            <p>
              <Link href="" className="d-inline-flex focus-ring focus-ring-light py-1 px-2 text-decoration-none border rounded-2">
                Light focus
              </Link>
            </p>
            <p>
              <Link href="" className="d-inline-flex focus-ring focus-ring-dark py-1 px-2 text-decoration-none border rounded-2">
                Dark focus
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const BackgroundTricks = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="cursor pointer mouse">
          Background
          <span className="fw-300">
            <i>Tricks</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              The <code>.bg-placeholder</code> is used to create a placeholder background for elements. Use the <code>.translucent-light</code> or
              <code>.translucent-dark</code> classes (along with other supporting classes) to add a translucent background.
            </p>
          </div>
          <div className="demo">
            <div className="w-100 height-xl d-flex justify-content-center align-items-center gap-3 bg-placeholder">
              <div className="alert bg-light bg-light text-dark bg-opacity-25 shadow-5 translucent-light rounded-3 width-sm height-sm">
                .translucent-light
              </div>
              <div className="alert bg-dark bg-dark text-light bg-opacity-25 shadow-5 translucent-dark rounded-3 width-sm height-sm">
                .translucent-dark
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const ShadowPresets = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="shadow shadow- inset presets">
          Shadow
          <span className="fw-300">
            <i>Presets</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Add shadow presets for depth on elements</div>
          <Row>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-none bg-light mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-none</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-1 mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-1</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-2 mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-2</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-3 mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-3</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-4 mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-4</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-5 mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-5</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-sm mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-sm</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-lg mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-lg</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-inset-1 mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-inset-1</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-inset-2 mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-inset-2</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-inset-3 mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-inset-3</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-inset-4 mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-inset-4</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded shadow-inset-5 mb-g border border-faded">
                <strong>Class</strong>
                <p>
                  <code>.shadow-inset-5</code>
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>
  )
}

const ShadowHovers = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="shadow shadow- inset presets">
          Shadow
          <span className="fw-300">
            <i>Hovers</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">a</div>
          <Row>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover-1 bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover-1</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover-2 bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover-2</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover-3 bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover-3</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover-4 bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover-4</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover-5 bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover-5</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-sm-hover bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-sm-hover</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-lg-hover bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-lg-hover</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover-inset-1 bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover-inset-1</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover-inset-2 bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover-inset-2</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover-inset-3 bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover-inset-3</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover-inset-4 bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover-inset-4</code>
                </p>
              </div>
            </Col>
            <Col lg={6} xl={4}>
              <div className="p-3 rounded mb-g border border-faded shadow-hover-inset-5 bg-highlight">
                <strong>Class</strong>
                <p>
                  <code>.shadow-hover-inset-5</code>
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>
  )
}

const ChildHover = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="child hover">
          Child
          <span className="fw-300">
            <i>Hover</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Hide and display child elements on hover</div>
          <Row>
            <Col xs={6}>
              <div className="p-3 hide-child-on-hover height-10 border border-warning rounded bg-warning-200" style={{ height: '10rem' }}>
                Children is hidden on hover <code className="ms-2">.hide-child-on-hover</code>
                <div className="hide-on-hover-parent mt-3 border border-info p-2 bg-info-500 rounded align-items-center">
                  This element is visible <code className="ms-2">.hide-on-hover-parent</code>
                </div>
              </div>
            </Col>
            <Col xs={6}>
              <div className="p-3 show-child-on-hover border border-warning rounded bg-warning-200" style={{ height: '10rem' }}>
                Children is shown on hover <code className="ms-2">.show-child-on-hover</code>
                <div className="show-on-hover-parent mt-3 border border-danger p-2 bg-danger-500 rounded align-items-center">
                  This element is hidden <code className="ms-2">.show-on-hover-parent</code>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>
  )
}

const GradientPresent = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="gradient backgrounds color">
          Gradient
          <span className="fw-300">
            <i>presets</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            There are 8 different gradients that you can mix and match with different background colors. The gradient classes are
            <code>.bg-primary-gradient</code>, <code>.bg-info-gradient</code>, <code>.bg-success-gradient</code>, <code>.bg-warning-gradient</code>,
            <code>.bg-danger-gradient</code>, <code>.bg-fusion-gradient</code>, <code>.bg-brand-gradient</code>, and <code>.bg-trans-gradient</code>
            (which requires <code>.text-white</code> modifier)
          </div>
          <div className="mb-2">
            <Row>
              <Col sm={6}>
                <div className="mb-3">
                  <FormLabel>Step 1: Select Background</FormLabel>
                  <select className="form-select js-bg-color js-bg-gradient-demo custom-select" id="select-background">
                    <option>Select Background</option>
                  </select>
                </div>
              </Col>
              <Col sm={6}>
                <div className="mb-3">
                  <FormLabel>Step 2: Select Gradient</FormLabel>
                  <select className="form-select js-bg-gradient custom-select js-bg-gradient-demo" id="select-gradient">
                    <option value="bg-primary-gradient">bg-primary-gradient</option>
                    <option value="bg-info-gradient">bg-info-gradient</option>
                    <option value="bg-success-gradient">bg-success-gradient</option>
                    <option value="bg-warning-gradient">bg-warning-gradient</option>
                    <option value="bg-danger-gradient">bg-danger-gradient</option>
                    <option value="bg-fusion-gradient">bg-fusion-gradient</option>
                    <option value="bg-brand-gradient">bg-brand-gradient</option>
                    <option value="bg-trans-gradient text-white">bg-trans-gradient</option>
                  </select>
                </div>
              </Col>
            </Row>
          </div>
          <div id="js-gradient-demo" className="p-3 rounded bg-primary-500 bg-primary-gradient">
            <h3>
              Header 3<small>Subheader text</small>
            </h3>
            <p>
              Paragraph text, <strong>in bold</strong>, <i>italic</i>, and <u>underlined</u>
            </p>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const ZIndexPresent = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="gradient backgrounds color">
          Z-index
          <span className="fw-300">
            <i>Presets</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            We call these “low-level” <code>z-index</code> utilities because of their default values of <code>-1</code>
            through <code>3</code>, which we use for the layout of overlapping components. High-level <code>z-index</code> values are used for overlay
            components like modals and tooltips.
          </div>
          <div className="demo m-0 border-0 position-relative" style={{ minHeight: '13rem', zIndex: 1 }}>
            <div className="z-3 position-absolute p-5 rounded-3 bg-info-900 border border-dark text-light shadow-2" style={{ top: 0, left: 0 }}>
              <span className="position-absolute end-0 bottom-0 p-2">z-3</span>
            </div>
            <div
              className="z-2 position-absolute p-5 rounded-3 bg-info-900 border border-dark text-light shadow-2"
              style={{ top: '1.6rem', left: '1.6rem' }}>
              <span className="position-absolute end-0 bottom-0 p-2">z-2</span>
            </div>
            <div
              className="z-1 position-absolute p-5 rounded-3 bg-info-900 border border-dark text-light shadow-2"
              style={{ top: '3.2rem', left: '3.2rem' }}>
              <span className="position-absolute end-0 bottom-0 p-2">z-1</span>
            </div>
            <div
              className="z-0 position-absolute p-5 rounded-3 bg-info-900 border border-dark text-light shadow-2"
              style={{ top: '4.8rem', left: '4.8rem' }}>
              <span className="position-absolute end-0 bottom-0 p-2">z-0</span>
            </div>
            <div
              className="z-n1 position-absolute p-5 rounded-3 bg-info-900 border border-dark text-light shadow-2"
              style={{ top: '6.4rem', left: '6.4rem' }}>
              <span className="position-absolute end-0 bottom-0 p-2">z-n1</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const RatioAndObject = () => {
  return (
    <ComponentCard
      title={
        <h2 data-filter-tags="gradient backgrounds color">
          Ratio
          <span className="fw-300">
            <i>&amp; Object Fit</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Use the <code>.ratio</code> class to create a responsive ratio for an element. Use the <code>.object-fit</code> class to control how an
            element is resized to fit its container.
          </div>
          <div className="demo d-flex gap-3 align-items-end justify-content-center">
            <div className="ratio ratio-1x1 width-sm bg-faded border">
              <div className="p-2">1x1</div>
            </div>
            <div className="ratio ratio-4x3 width-sm bg-faded border">
              <div className="p-2">4x3</div>
            </div>
            <div className="ratio ratio-16x9 width-sm bg-faded border">
              <div className="p-2">16x9</div>
            </div>
            <div className="ratio ratio-21x9 width-sm bg-faded border">
              <div className="p-2">21x9</div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
