import ComponentCard from '@/components/ComponentCard'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Row } from 'react-bootstrap'

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Borders'}
          subTitle1={'Design'}
          subTitle2={'System Utilities'}
          subText={
            'Bootstrap borders are utility classes that allow you to quickly add, remove, or modify borders on elements with predefined styles, colors, and widths.'
          }
        />
        <div className="main-content">
          <Row>
            <Col xl={6}>
              <Colorful />
              <AddBorders />
              <BorderOpacity />
              <BorderThickness />
            </Col>
            <Col xl={6}>
              <Rounded />
              <RemoveBorders />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page

const Colorful = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Colorful
          <span className="fw-300">
            <i>borders</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Use color profiles to the following border colors <code>,border-primary</code>, <code>.border-secondary</code>,
            <code>.border-success</code>, <code>.border-danger</code>, <code>.border-warning</code>, <code>.border-info</code>,
            <code>.border-light</code>, <code>.border-dark</code>, <code>.border-white</code>, <code>.border-transparent</code>,
            <code>.border-faded</code>
          </div>
          <div className="demo d-flex flex-wrap justify-content-evenly gap-1">
            <div className="border border-primary width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-primary-subtle width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-secondary width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-secondary-subtle width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-success width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-success-subtle width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-danger width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-danger-subtle width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-warning width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-warning-subtle width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-info width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-info-subtle width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-light width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-light-subtle width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-dark width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-dark-subtle width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-black width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-white width-10 height-10 d-inline-block bg-faded" />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const AddBorders = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Add
          <span className="fw-300">
            <i>Borders</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add border using <code>.border</code>, <code>.border-top</code>, <code>.border-end</code>, <code>.border-end</code>,
            <code>.border-bottom</code>, <code>.border-start</code>
          </div>
          <div className="demo d-flex flex-wrap justify-content-evenly justify-content-md-start gap-1">
            <div className="border width-10 height-10 d-inline-block bg-faded" />
            <div className="border-top width-10 height-10 d-inline-block bg-faded" />
            <div className="border-end width-10 height-10 d-inline-block bg-faded" />
            <div className="border-bottom width-10 height-10 d-inline-block bg-faded" />
            <div className="border-start width-10 height-10 d-inline-block bg-faded" />
            <div className="border rounded-circle width-10 height-10 d-inline-block bg-faded" />
            <div className="border rounded width-10 height-10 d-inline-block bg-faded" />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const BorderOpacity = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Border
          <span className="fw-300">
            <i>Opacity</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add border using <code>.border-opacity-75</code>, <code>.border-opacity-50</code>,<code>.border-opacity-25</code>,
            <code>.border-opacity-10</code>.
          </div>
          <div className="demo d-flex flex-wrap justify-content-evenly justify-content-md-start gap-1">
            <div className="border border-primary width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-primary border-opacity-75 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-primary border-opacity-50 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-primary border-opacity-25 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-primary border-opacity-10 width-10 height-10 d-inline-block bg-faded" />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const BorderThickness = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Border
          <span className="fw-300">
            <i>Thickness</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Border thickness using <code>border-1</code>, <code>border-2</code>,<code>border-3</code>, <code>border-4</code>, <code>border-5</code>.
          </div>
          <div className="demo d-flex flex-wrap justify-content-evenly justify-content-md-start gap-1">
            <div className="border border-1 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-2 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-3 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-4 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-5 width-10 height-10 d-inline-block bg-faded" />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const Rounded = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Rounded
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Round edges or control each corner using <code>.rounded</code>, <code>rounded-top</code>, <code>rounded-end</code>,
            <code>rounded-bottom</code>, <code>rounded-start</code>, <code>rounded-circle</code>, <code>rounded-0</code>, <code>.rounded-plus</code>,
            <code>
              .rounded-{'{'}sm,lg{'}'}
            </code>
            , <code>.rounded-pill</code>,
            <code>
              border-{'{'}top,bottom{'}'}-{'{'}left,right{'}'}-radius-0
            </code>
          </div>
          <div className="demo d-flex flex-wrap justify-content-evenly justify-content-md-start gap-1">
            <div className="rounded bg-success-50 width-10 height-10 d-inline-block" />
            <div className="rounded-top bg-success-200 width-10 height-10 d-inline-block" />
            <div className="rounded-end bg-success-200 width-10 height-10 d-inline-block" />
            <div className="rounded-bottom bg-success-200 width-10 height-10 d-inline-block" />
            <div className="rounded-start bg-success-200 width-10 height-10 d-inline-block" />
            <div className="rounded-circle bg-danger-200 width-10 height-10 d-inline-block" />
            <div className="rounded-plus bg-danger-50 width-10 height-10 d-inline-block" />
            <div className="rounded-0 bg-primary-50 width-10 height-10 d-inline-block" />
            <div className="rounded-pill bg-info-50 width-10 height-10 d-inline-block" />
          </div>
          <div className="panel-tag">
            Control rounded depth using <code>rounded-1</code>, <code>rounded-2</code>, <code>rounded-3</code>, <code>rounded-4</code>,
            <code>rounded-5</code>
          </div>
          <div className="demo d-flex flex-wrap justify-content-evenly justify-content-md-start gap-1">
            <div className="rounded-1 width-10 height-10 d-inline-block bg-fusion-50" />
            <div className="rounded-2 width-10 height-10 d-inline-block bg-fusion-50" />
            <div className="rounded-3 width-10 height-10 d-inline-block bg-fusion-50" />
            <div className="rounded-4 width-10 height-10 d-inline-block bg-fusion-50" />
            <div className="rounded-5 width-10 height-10 d-inline-block bg-fusion-50" />
          </div>
          <div className="panel-tag">
            Mix and match rounded corners using <code>rounded-bottom-1</code>, <code>rounded-start-2</code>,<code>rounded-end-circle</code>,
            <code>rounded-start-pill</code>, <code>rounded-5 rounded-top-0</code>
          </div>
          <div className="demo d-flex flex-wrap justify-content-evenly justify-content-md-start gap-1">
            <div className="rounded-bottom-1 width-10 height-10 d-inline-block bg-fusion-50" />
            <div className="rounded-start-2 width-10 height-10 d-inline-block bg-fusion-50" />
            <div className="rounded-end-circle width-10 height-10 d-inline-block bg-fusion-50" />
            <div className="rounded-start-pill width-10 height-10 d-inline-block bg-fusion-50" />
            <div className="rounded-5 rounded-top-0 width-10 height-10 d-inline-block bg-fusion-50" />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

const RemoveBorders = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Remove
          <span className="fw-300">
            <i>borders</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Subtract borders with <code>border-0</code>, <code>border-top-0</code>, <code>border-end-0</code>, <code>border-bottom-0</code>,
            <code>border-start-0</code>, <code>.border-transparent</code>
          </div>
          <div className="demo d-flex flex-wrap justify-content-evenly justify-content-md-start gap-1">
            <div className="border-0 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-top-0 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-end-0 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-bottom-0 width-10 height-10 d-inline-block bg-faded" />
            <div className="border border-start-0 width-10 height-10 d-inline-block bg-faded" />
            <div className="border rounded-circle border-end-0 border-start-0 width-10 height-10 d-inline-block bg-faded" />
            <div className="border rounded width-10 border-end-0 border-start-0 height-10 d-inline-block bg-faded" />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
