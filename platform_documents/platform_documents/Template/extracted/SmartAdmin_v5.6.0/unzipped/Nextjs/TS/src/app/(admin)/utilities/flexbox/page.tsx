import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Flexbox' }

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Flexbox'}
          subTitle1={'Design'}
          subTitle2={'System Utilities'}
          subText={
            'Quickly manage the layout, alignment, and sizing of grid columns, navigation, components, and more with a full suite of responsive flexbox utilities.'
          }
        />
        <div className="main-content">
          <Row>
            <Col lg={12}>
              <EnableFlexBehaviors />
              <Direction />
              <JustifyContent />
              <AlignItems />
              <AlignSelf />
              <Fill />
              <GrowAndShrink />
              <AutoMargins />
              <WithAlignItems />
              <Wrap />
              <Order />
              <AlignContent />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page

const EnableFlexBehaviors = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Enable <span className="fw-300">flex behaviors </span>
          <small>
            Apply <code>display</code> utilities to create a flexbox container and transform <strong>direct children elements</strong> into flex
            items. Flex containers and items are able to be modified further with additional flex properties.
          </small>
        </h5>
        <h5 className="frame-heading">
          <code>d-flex</code>
        </h5>
        <div className="frame-wrap">
          <div className="d-flex p-2 bd-highlight">I'm a flexbox container!</div>
        </div>
        <h5 className="frame-heading">
          <code>d-inline-flex</code>
        </h5>
        <div className="frame-wrap">
          <div className="d-inline-flex p-2 bd-highlight">I'm an inline flexbox container!</div>
        </div>
      </CardBody>
    </Card>
  )
}

const Direction = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Direction
          <small>
            Set the direction of flex items in a flex container with direction utilities. In most cases you can omit the horizontal class here as the
            browser default is row. However, you may encounter situations where you needed to explicitly set this value (like responsive layouts).
          </small>
        </h5>
        <h5 className="frame-heading">
          Use <code>.flex-row</code> to set a horizontal direction (the browser default), or <code>.flex-row-reverse</code> to start the horizontal
          direction from the opposite side.
        </h5>
        <div className="frame-wrap">
          <div className="d-flex flex-row bd-highlight mb-3">
            <div className="p-2 bd-highlight">Flex item 1</div>
            <div className="p-2 bd-highlight">Flex item 2</div>
            <div className="p-2 bd-highlight">Flex item 3</div>
          </div>
          <div className="d-flex flex-row-reverse bd-highlight">
            <div className="p-2 bd-highlight">Flex item 1</div>
            <div className="p-2 bd-highlight">Flex item 2</div>
            <div className="p-2 bd-highlight">Flex item 3</div>
          </div>
        </div>
        <h5 className="frame-heading">
          Use <code>.flex-column</code> to set a vertical direction, or <code>.flex-column-reverse</code> to start the vertical direction from the
          opposite side.
        </h5>
        <div className="frame-wrap">
          <div className="d-flex flex-column bd-highlight mb-3">
            <div className="p-2 bd-highlight">Flex item 1</div>
            <div className="p-2 bd-highlight">Flex item 2</div>
            <div className="p-2 bd-highlight">Flex item 3</div>
          </div>
          <div className="d-flex flex-column-reverse bd-highlight">
            <div className="p-2 bd-highlight">Flex item 1</div>
            <div className="p-2 bd-highlight">Flex item 2</div>
            <div className="p-2 bd-highlight">Flex item 3</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const JustifyContent = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Justify <span className="fw-300">Content</span>
          <small>
            <code>justify-content</code> utilities on flexbox containers to change the alignment of flex items on the main axis (the x-axis to start,
            y-axis if <code>flex-direction: column</code>). Choose from <code>start</code> (browser default), <code>end</code>, <code>center</code>,
            <code>between</code>, or <code>around</code>.
          </small>
        </h5>
        <div className="frame-wrap">
          <div className="d-flex justify-content-start bd-highlight mb-3">
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex justify-content-end bd-highlight mb-3">
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex justify-content-center bd-highlight mb-3">
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex justify-content-between bd-highlight mb-3">
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex justify-content-around bd-highlight">
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const AlignItems = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Align <span className="fw-300">items</span>
          <small>
            Use <code>align-items</code> utilities on flexbox containers to change the alignment of flex items on the cross axis (the y-axis to start,
            x-axis if <code>flex-direction: column</code>).
          </small>
        </h5>
        <h5 className="frame-heading">
          Choose from <code>start</code>, <code>end</code>, <code>center</code>, <code>baseline</code>, or <code>stretch</code> (browser default).
        </h5>
        <div className="frame-wrap">
          <div className="d-flex align-items-start bd-highlight mb-3" style={{ height: 100 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex align-items-end bd-highlight mb-3" style={{ height: 100 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex align-items-center bd-highlight mb-3" style={{ height: 100 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex align-items-baseline bd-highlight mb-3" style={{ height: 100 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex align-items-stretch bd-highlight" style={{ height: 100 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
        </div>
        <p>
          Responsive variations also exist for <code>align-items</code>.
        </p>
      </CardBody>
    </Card>
  )
}

const AlignSelf = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Align <span className="fw-300">self</span>
          <small>
            Use <code>align-self</code> utilities on flexbox items to individually change their alignment on the cross axis (the y-axis to start,
            x-axis if <code>flex-direction: column</code>).
          </small>
        </h5>
        <h5 className="frame-heading">
          Choose from the same options as <code>align-items: start</code>, <code>end</code>, <code>center</code>, <code>baseline</code>, or
          <code>stretch</code> (browser default).
        </h5>
        <div className="frame-wrap">
          <div className="d-flex bd-highlight mb-3" style={{ height: 100 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="align-self-start p-2 bd-highlight">Aligned flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex bd-highlight mb-3" style={{ height: 100 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="align-self-end p-2 bd-highlight">Aligned flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex bd-highlight mb-3" style={{ height: 100 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="align-self-center p-2 bd-highlight">Aligned flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex bd-highlight mb-3" style={{ height: 100 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="align-self-baseline p-2 bd-highlight">Aligned flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex bd-highlight" style={{ height: 100 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="align-self-stretch p-2 bd-highlight">Aligned flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const Fill = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Fill
          <small>
            Use the <code>.flex-fill</code> class on a series of sibling elements to force them into widths equal to their content (or equal widths if
            their content does not surpass their border-boxes) while taking up all available horizontal space.
          </small>
        </h5>
        <div className="frame-wrap">
          <div className="d-flex bd-highlight">
            <div className="p-2 flex-fill bd-highlight">Flex item with a lot of content</div>
            <div className="p-2 flex-fill bd-highlight">Flex item</div>
            <div className="p-2 flex-fill bd-highlight">Flex item</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const GrowAndShrink = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Grow <span className="fw-300">and shrink</span>
          <small>
            Use <code>.flex-grow-*</code> utilities to toggle a flex item’s ability to grow to fill available space. In the example below, the
            <code>.flex-grow-1</code> elements uses all available space it can, while allowing the remaining two flex items their necessary space.
          </small>
        </h5>
        <h5 className="frame-heading">
          Choose from the same options as <code>align-items: start</code>, <code>end</code>, <code>center</code>, <code>baseline</code>, or
          <code>stretch</code> (browser default).
        </h5>
        <div className="frame-wrap">
          <div className="d-flex bd-highlight">
            <div className="p-2 flex-grow-1 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Third flex item</div>
          </div>
        </div>
        <h5 className="frame-heading">
          Use <code>.flex-shrink-*</code> utilities to toggle a flex item’s ability to shrink if necessary. In the example below, the second flex item
          with .<code>flex-shrink-1</code> is forced to wrap it’s contents to a new line, “shrinking” to allow more space for the previous flex item
          with <code>.w-100</code>.
        </h5>
        <div className="frame-wrap">
          <div className="d-flex bd-highlight">
            <div className="p-2 w-100 bd-highlight">Flex item</div>
            <div className="p-2 flex-shrink-1 bd-highlight">Flex item</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const AutoMargins = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Auto <span className="fw-300">margins</span>
          <small>
            Flexbox can do some pretty awesome things when you mix flex alignments with auto margins. Shown below are three examples of controlling
            flex items via auto margins: default (no auto margin), pushing two items to the right (<code>.me-auto</code>), and pushing two items to
            the left (<code>.ms-auto</code>).
          </small>
        </h5>
        <div className="frame-wrap">
          <div className="d-flex bd-highlight mb-3">
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex bd-highlight mb-3">
            <div className="me-auto p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex bd-highlight mb-3">
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="ms-auto p-2 bd-highlight">Flex item</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const WithAlignItems = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          With <span className="fw-300">align-items</span>
          <small>
            Vertically move one flex item to the top or bottom of a container by mixing align-items, flex-direction: column, and
            <code>margin-top: auto</code> or <code>margin-bottom: auto</code>.
          </small>
        </h5>
        <h5 className="frame-heading">
          Choose from the same options as <code>align-items: start</code>, <code>end</code>, <code>center</code>, <code>baseline</code>, or
          <code>stretch</code> (browser default).
        </h5>
        <div className="frame-wrap">
          <div className="d-flex align-items-start flex-column bd-highlight mb-3" style={{ height: 200 }}>
            <div className="mb-auto p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
          <div className="d-flex align-items-end flex-column bd-highlight mb-3" style={{ height: 200 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="mt-auto p-2 bd-highlight">Flex item</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const Wrap = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Wrap
          <small>
            Change how flex items wrap in a flex container. Choose from no wrapping at all (the browser default) with <code>.flex-nowrap</code>,
            wrapping with <code>.flex-wrap</code>, or reverse wrapping with <code>.flex-wrap-reverse</code>.
          </small>
        </h5>
        <h5 className="frame-heading">d-flex flex-nowrap</h5>
        <div className="frame-wrap">
          <div className="d-flex flex-nowrap bd-highlight" style={{ width: '8rem' }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
        </div>
        <h5 className="frame-heading">d-flex flex-wrap</h5>
        <div className="frame-wrap">
          <div className="d-flex flex-wrap bd-highlight">
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
        </div>
        <h5 className="frame-heading">d-flex flex-wrap-reverse</h5>
        <div className="frame-wrap">
          <div className="d-flex flex-wrap-reverse bd-highlight">
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const Order = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Order
          <small>
            Change the <em>visual</em> order of specific flex items with a handful of <code>order</code> utilities. We only provide options for making
            an item first or last, as well as a reset to use the DOM order. As <code>order</code> takes any integer value (e.g., <code>5</code>), add
            custom CSS for any additional values needed.
          </small>
        </h5>
        <div className="frame-wrap">
          <div className="d-flex flex-nowrap bd-highlight">
            <div className="order-3 p-2 bd-highlight">First flex item</div>
            <div className="order-2 p-2 bd-highlight">Second flex item</div>
            <div className="order-1 p-2 bd-highlight">Third flex item</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const AlignContent = () => {
  return (
    <Card className="mb-g">
      <CardBody>
        <h5 className="mb-g">
          Align <span className="fw-300">content</span>
          <small>
            Use <code>align-content</code> utilities on flexbox containers to align flex items <em>together</em> on the cross axis. Choose from
            <code>start</code> (browser default), <code>end</code>, <code>center</code>, <code>between</code>, <code>around</code>, or
            <code>stretch</code>. To demonstrate these utilities, we’ve enforced <code>flex-wrap: wrap</code> and increased the number of flex items.
          </small>
        </h5>
        <div className="alert alert-info">
          <strong>Heads up!</strong> This property has no effect on single rows of flex items.
        </div>
        <h5 className="frame-heading">
          <code> d-flex align-content-start flex-wrap </code>
        </h5>
        <div className="frame-wrap">
          <div className="d-flex align-content-start flex-wrap bd-highlight mb-3" style={{ height: 200 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
        </div>
        <h5 className="frame-heading">
          <code> d-flex align-content-end flex-wrap </code>
        </h5>
        <div className="frame-wrap">
          <div className="d-flex align-content-center flex-wrap bd-highlight mb-3" style={{ height: 200 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
        </div>
        <h5 className="frame-heading">
          <code> d-flex align-content-center flex-wrap </code>
        </h5>
        <div className="frame-wrap">
          <div className="d-flex align-content-between flex-wrap bd-highlight mb-3" style={{ height: 200 }}>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
            <div className="p-2 bd-highlight">Flex item</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
