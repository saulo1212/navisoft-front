import ComponentCard from '@/components/ComponentCard';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Button, Col, Row } from 'react-bootstrap';
export const metadata = {
  title: 'Buttons'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Buttons'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Use custom button styles for actions in forms, dialogs, and more. Includes support for a handful of contextual variations, sizes, states, and more.'} />
        <div className="main-content">
          <Row>
            <Col md={12} xl={6}>
              <ButtonColor />
              <BlockButton />
              <SizeButton />
              <ButtonWithIcon />
              <IconsExamples />
            </Col>
            <Col md={12} xl={6}>
              <OutlineButton />
              <BlockOutline />
              <SizesOutline />
              <ButtonWithIconOutline />
              <IconOutline />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;
const ButtonColor = () => {
  return <ComponentCard title={<h2>
          Button
          <span className="fw-300">
            <i>Colors</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">SmartAdmin includes nine predefined button styles, each serving its own semantic purpose.</div>
          <h5 className="frame-heading">Default</h5>
          <div className="frame-wrap">
            <div className="demo d-flex gap-1 flex-wrap">
              <Button variant="primary" className="waves-effect">
                Primary
              </Button>
              <Button variant="secondary" className="waves-effect">
                Secondary
              </Button>
              <Button variant="success" className="waves-effect">
                Success
              </Button>
              <Button variant="info" className="waves-effect">
                Info
              </Button>
              <Button variant="warning" className="waves-effect">
                Warning
              </Button>
              <Button variant="danger" className="waves-effect">
                Danger
              </Button>
              <Button variant="dark" className="waves-effect">
                Dark
              </Button>
              <Button variant="light" className="waves-effect">
                Light
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Rounded</h5>
          <div className="frame-wrap">
            <div className="demo d-flex gap-1 flex-wrap">
              <Button variant="primary" className="btn-pills waves-effect">
                Primary
              </Button>
              <Button variant="secondary" className="btn-pills waves-effect">
                Secondary
              </Button>
              <Button variant="success" className="btn-pills waves-effect">
                Success
              </Button>
              <Button variant="info" className="btn-pills waves-effect">
                Info
              </Button>
              <Button variant="warning" className="btn-pills waves-effect">
                Warning
              </Button>
              <Button variant="danger" className="btn-pills waves-effect">
                Danger
              </Button>
              <Button variant="dark" className="btn-pills waves-effect">
                Dark
              </Button>
              <Button variant="light" className="btn-pills waves-effect">
                Light
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Unique style</h5>
          <div className="frame-wrap">
            <div className="demo d-flex gap-1 flex-wrap">
              <Button variant="default" className="waves-effect">
                Default
              </Button>
              <Button variant="default" className="btn-pills waves-effect">
                Default
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const BlockButton = () => {
  return <ComponentCard title={<h2>
          Block
          <span className="fw-300">
            <i>Buttons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Create block level buttons—those that span the full width of a parent—by adding <code>.btn-block</code>
          </div>
          <div className="frame-wrap text-center mb-0">
            <Row>
              <Col xl={6}>
                <div className="demo-v-spacing ">
                  <Button variant="primary" size="lg" className="btn-block waves-effect">
                    Block
                    <span>large</span>
                  </Button>
                  <Button variant="primary" className="btn-block waves-effect">
                    Block
                    <span>default</span>
                  </Button>
                  <Button variant="primary" size="sm" className="btn-block waves-effect">
                    Block
                    <span>small</span>
                  </Button>
                  <Button variant="primary" className="btn-xs btn-block waves-effect">
                    Block
                    <span>extra small</span>
                  </Button>
                </div>
              </Col>
              <Col xl={6}>
                <div className="demo-v-spacing mt-3 mt-xl-0">
                  <Button variant="success" size="lg" className="btn-pills waves-effect btn-block">
                    Block
                    <span>large</span>
                  </Button>
                  <Button variant="success" className="btn-pills btn-block waves-effect">
                    Block
                    <span>default</span>
                  </Button>
                  <Button variant="success" size="sm" className="btn-pills btn-block waves-effect">
                    Block
                    <span>small</span>
                  </Button>
                  <Button variant="success" className="btn-pills btn-xs btn-block waves-effect">
                    Block
                    <span>extra small</span>
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const SizeButton = () => {
  return <ComponentCard title={<h2>
          Option
          <span className="fw-300">
            <i>Sizes</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Alter button sizes by using the classes <code>.btn-lg</code>, <code>.btn-sm</code>, <code>.btn-xs</code>
          </div>
          <h5 className="frame-heading">Largest size</h5>
          <div className="frame-wrap">
            <div className="demo d-flex gap-1 flex-wrap">
              <Button variant="primary" size="lg" className="waves-effect">
                Primary
              </Button>
              <Button variant="secondary" size="lg" className="waves-effect">
                Secondary
              </Button>
              <Button variant="default" size="lg" className="waves-effect">
                Default
              </Button>
              <Button variant="success" size="lg" className="waves-effect">
                Success
              </Button>
              <Button variant="warning" size="lg" className="waves-effect">
                Warning
              </Button>
              <Button variant="info" size="lg" className="waves-effect">
                Info
              </Button>
              <Button variant="danger" size="lg" className="waves-effect">
                Danger
              </Button>
              <Button variant="dark" size="lg" className="waves-effect">
                Dark
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Default size</h5>
          <div className="frame-wrap">
            <div className="demo d-flex gap-1 flex-wrap">
              <Button variant="primary" className="waves-effect">
                Primary
              </Button>
              <Button variant="secondary" className="waves-effect">
                Secondary
              </Button>
              <Button variant="default" className="waves-effect">
                Default
              </Button>
              <Button variant="success" className="waves-effect">
                Success
              </Button>
              <Button variant="warning" className="waves-effect">
                Warning
              </Button>
              <Button variant="info" className="waves-effect">
                Info
              </Button>
              <Button variant="danger" className="waves-effect">
                Danger
              </Button>
              <Button variant="dark" className="waves-effect">
                Dark
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Small size</h5>
          <div className="frame-wrap">
            <div className="demo d-flex gap-1 flex-wrap">
              <Button variant="primary" size="sm" className="waves-effect">
                Primary
              </Button>
              <Button variant="secondary" size="sm" className="waves-effect">
                Secondary
              </Button>
              <Button variant="default" size="sm" className="waves-effect">
                Default
              </Button>
              <Button variant="success" size="sm" className="waves-effect">
                Success
              </Button>
              <Button variant="warning" size="sm" className="waves-effect">
                Warning
              </Button>
              <Button variant="info" size="sm" className="waves-effect">
                Info
              </Button>
              <Button variant="danger" size="sm" className="waves-effect">
                Danger
              </Button>
              <Button variant="dark" size="sm" className="waves-effect">
                Dark
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Smallest size</h5>
          <div className="frame-wrap">
            <div className="demo d-flex gap-1 flex-wrap">
              <Button variant="primary" className="btn-xs waves-effect">
                Primary
              </Button>
              <Button variant="secondary" className="btn-xs waves-effect">
                Secondary
              </Button>
              <Button variant="default" className="btn-xs waves-effect">
                Default
              </Button>
              <Button variant="success" className="btn-xs waves-effect">
                Success
              </Button>
              <Button variant="warning" className="btn-xs waves-effect">
                Warning
              </Button>
              <Button variant="info" className="btn-xs waves-effect">
                Info
              </Button>
              <Button variant="danger" className="btn-xs waves-effect">
                Danger
              </Button>
              <Button variant="dark" className="btn-xs waves-effect">
                Dark
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const ButtonWithIcon = () => {
  return <ComponentCard title={<h2>
          Button
          <span className="fw-300">
            <i>with Icons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">We use the icon tags to insert icons into buttons</div>
          <div className="demo d-flex gap-1 flex-wrap">
            <Button variant="primary" size="lg" className="waves-effect">
              <span className="fal fa-print me-1" />
              Print
            </Button>
            <Button variant="secondary" size="lg" className="waves-effect">
              <span className="fal fa-volume-mute me-1" />
              Mute
            </Button>
            <Button variant="default" size="lg" className="waves-effect">
              <span className="fal fa-check me-1" />
              Submit
            </Button>
            <Button variant="success" size="lg" className="waves-effect">
              <span className="fal fa-download me-1" />
              Download
            </Button>
            <Button variant="warning" size="lg" className="waves-effect">
              <span className="fal fa-exclamation-triangle me-1" />
              Scan Device
            </Button>
            <Button variant="info" size="lg" className="waves-effect">
              <span className="fal fa-bug me-1" />
              Report Bug
            </Button>
            <Button variant="danger" size="lg" className="waves-effect">
              <span className="fal fa-times me-1" />
              Delete
            </Button>
            <Button variant="dark" size="lg" className="waves-effect">
              <span className="fal fa-eject me-1" />
              Eject
            </Button>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const IconsExamples = () => {
  return <ComponentCard title={<h2>
          Icons
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Convert button to an icon button by adding the class <code>.btn-icon</code>
          </div>
          <h5 className="frame-heading">Various sizes</h5>
          <div className="frame-wrap">
            <div className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="primary" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="secondary" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-volume-mute fs-md" />
              </Button>
              <Button as="a" variant="default" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="success" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="warning" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="info" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="danger" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="dark" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-eject" />
              </Button>
            </div>
            <div className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="primary" className="btn-icon waves-effect">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="secondary" className="btn-icon waves-effect">
                <i className="fal fa-volume-mute fs-md" />
              </Button>
              <Button as="a" variant="default" className="btn-icon waves-effect">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="success" className="btn-icon waves-effect">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="warning" className="btn-icon waves-effect">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="info" className="btn-icon waves-effect">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="danger" className="btn-icon waves-effect">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="dark" className="btn-icon waves-effect">
                <i className="fal fa-eject" />
              </Button>
            </div>
            <div className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="primary" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="secondary" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-volume-mute" />
              </Button>
              <Button as="a" variant="default" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="success" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="warning" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="info" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="danger" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="dark" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-eject" />
              </Button>
            </div>
            <div className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="primary" className="waves-effect btn-xs btn-icon">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="secondary" className="waves-effect btn-xs btn-icon">
                <i className="fal fa-volume-mute" />
              </Button>
              <Button as="a" variant="default" className="waves-effect btn-xs btn-icon">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="success" className="waves-effect btn-xs btn-icon">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="warning" className="waves-effect btn-xs btn-icon">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="info" className="waves-effect btn-xs btn-icon">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="danger" className="waves-effect btn-xs btn-icon">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="dark" className="waves-effect btn-xs btn-icon">
                <i className="fal fa-eject" />
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Rounded</h5>
          <div className="frame-wrap">
            <div className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="primary" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="secondary" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-volume-mute fs-md" />
              </Button>
              <Button as="a" variant="default" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="success" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="warning" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="info" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="danger" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="dark" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-eject" />
              </Button>
            </div>
            <div className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="primary" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="secondary" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-volume-mute fs-md" />
              </Button>
              <Button as="a" variant="default" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="success" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="warning" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="info" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="danger" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="dark" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-eject" />
              </Button>
            </div>
            <div className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="primary" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="secondary" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-volume-mute" />
              </Button>
              <Button as="a" variant="default" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="success" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="warning" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="info" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="danger" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="dark" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-eject" />
              </Button>
            </div>
            <div className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="primary" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="secondary" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-volume-mute" />
              </Button>
              <Button as="a" variant="default" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="success" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="warning" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="info" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="danger" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="dark" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-eject" />
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Hover dot effect</h5>
          <div className="frame-wrap">
            <p className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="primary" size="lg" className="waves-effect btn-icon rounded-circle hover-effect-dot">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="secondary" size="lg" className="waves-effect btn-icon rounded-circle hover-effect-dot">
                <i className="fal fa-volume-mute fs-md" />
              </Button>
              <Button as="a" variant="success" size="lg" className="waves-effect btn-icon hover-effect-dot">
                <i className="fal fa-download" />
              </Button>
            </p>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const OutlineButton = () => {
  return <ComponentCard title={<h2>
          Button
          <span className="fw-300">
            <i>Outlines</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Replace the default modifier classes with<code>.btn-outline-*</code>
          </div>
          <h5 className="frame-heading">Outline</h5>
          <div className="frame-wrap">
            <div className="demo d-flex flex-wrap gap-1">
              <Button variant="outline-primary" className="waves-effect">
                Primary
              </Button>
              <Button variant="outline-secondary" className="waves-effect">
                Secondary
              </Button>
              <Button variant="outline-success" className="waves-effect">
                Success
              </Button>
              <Button variant="outline-info" className="waves-effect">
                Info
              </Button>
              <Button variant="outline-warning" className="waves-effect">
                Warning
              </Button>
              <Button variant="outline-danger" className="waves-effect">
                Danger
              </Button>
              <Button variant="outline-dark" className="waves-effect">
                Dark
              </Button>
              <Button variant="outline-light" className="waves-effect">
                Light
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Rounded outline</h5>
          <div className="frame-wrap">
            <div className="demo d-flex flex-wrap gap-1">
              <Button variant="outline-primary" className="btn-pills waves-effect">
                Primary
              </Button>
              <Button variant="outline-secondary" className="btn-pills waves-effect">
                Secondary
              </Button>
              <Button variant="outline-success" className="btn-pills waves-effect">
                Success
              </Button>
              <Button variant="outline-info" className="btn-pills waves-effect">
                Info
              </Button>
              <Button variant="outline-warning" className="btn-pills waves-effect">
                Warning
              </Button>
              <Button variant="outline-danger" className="btn-pills waves-effect">
                Danger
              </Button>
              <Button variant="outline-dark" className="btn-pills waves-effect">
                Dark
              </Button>
              <Button variant="outline-light" className="btn-pills waves-effect">
                Light
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Unique style</h5>
          <div className="frame-wrap mb-0">
            <div className="demo d-flex flex-wrap gap-1">
              <Button variant="outline-default" className="waves-effect">
                Default
              </Button>
              <Button variant="outline-default" className="btn-pills waves-effect">
                Default
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const BlockOutline = () => {
  return <ComponentCard title={<h2>
          Block
          <span className="fw-300">
            <i>Outlines</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Block buttons inherits outline button properties <code>.btn-outline-*</code>
          </div>
          <div className="frame-wrap text-center mb-0">
            <Row>
              <Col xl={6}>
                <div className="demo-v-spacing">
                  <Button variant="outline-primary" size="lg" className="btn-block waves-effect">
                    Block
                    <span>large</span>
                  </Button>
                  <Button variant="outline-primary" className="btn-block waves-effect">
                    Block
                    <span>default</span>
                  </Button>
                  <Button variant="outline-primary" size="sm" className="btn-block waves-effect">
                    Block
                    <span>small</span>
                  </Button>
                  <Button variant="outline-primary" className="btn-xs btn-block waves-effect">
                    Block
                    <span>extra small</span>
                  </Button>
                </div>
              </Col>
              <Col xl={6}>
                <div className="demo-v-spacing mt-3 mt-xl-0">
                  <Button variant="outline-success" size="lg" className="btn-pills btn-block waves-effect">
                    Block
                    <span>large</span>
                  </Button>
                  <Button variant="outline-success" className="btn-pills btn-block waves-effect">
                    Block
                    <span>default</span>
                  </Button>
                  <Button variant="outline-success" size="sm" className="btn-pills btn-block waves-effect">
                    Block
                    <span>small</span>
                  </Button>
                  <Button variant="outline-success" className="btn-pills btn-xs btn-block waves-effect">
                    Block
                    <span>extra small</span>
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const SizesOutline = () => {
  return <ComponentCard title={<h2>
          Option
          <span className="fw-300">
            <i>Sizes</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Alter button sizes by using the classes <code>.btn-lg</code>, <code>.btn-sm</code>, <code>.btn-xs</code>
          </div>
          <h5 className="frame-heading">Largest size</h5>
          <div className="frame-wrap">
            <p className="demo d-flex gap-1 flex-wrap">
              <Button variant="outline-primary" size="lg" className="waves-effect">
                Primary
              </Button>
              <Button variant="outline-secondary" size="lg" className="waves-effect">
                Secondary
              </Button>
              <Button size="lg" variant="outline-default" className="waves-effect">
                Default
              </Button>
              <Button size="lg" variant="outline-success" className="waves-effect">
                Success
              </Button>
              <Button variant="outline-warning" size="lg" className="waves-effect">
                Warning
              </Button>
              <Button variant="outline-info" size="lg" className="waves-effect">
                Info
              </Button>
              <Button variant="outline-danger" size="lg" className="waves-effect">
                Danger
              </Button>
              <Button variant="outline-dark" size="lg" className="waves-effect">
                Dark
              </Button>
            </p>
          </div>
          <h5 className="frame-heading">Default size</h5>
          <div className="frame-wrap">
            <p className="demo d-flex gap-1 flex-wrap">
              <Button variant="outline-primary" className="waves-effect">
                Primary
              </Button>
              <Button variant="outline-secondary" className="waves-effect">
                Secondary
              </Button>
              <Button variant="outline-default" className="waves-effect">
                Default
              </Button>
              <Button variant="outline-success" className="waves-effect">
                Success
              </Button>
              <Button variant="outline-warning" className="waves-effect">
                Warning
              </Button>
              <Button variant="outline-info" className="waves-effect">
                Info
              </Button>
              <Button variant="outline-danger" className="waves-effect">
                Danger
              </Button>
              <Button variant="outline-dark" className="waves-effect">
                Dark
              </Button>
            </p>
          </div>
          <h5 className="frame-heading">Small size</h5>
          <div className="frame-wrap">
            <p className="demo d-flex gap-1 flex-wrap">
              <Button size="sm" variant="outline-primary" className="waves-effect">
                Primary
              </Button>
              <Button size="sm" variant="outline-secondary" className="waves-effect">
                Secondary
              </Button>
              <Button size="sm" variant="outline-default" className="waves-effect">
                Default
              </Button>
              <Button size="sm" variant="outline-success" className="waves-effect">
                Success
              </Button>
              <Button size="sm" variant="outline-warning" className="waves-effect">
                Warning
              </Button>
              <Button size="sm" variant="outline-info" className="waves-effect">
                Info
              </Button>
              <Button size="sm" variant="outline-danger" className="waves-effect">
                Danger
              </Button>
              <Button size="sm" variant="outline-dark" className="waves-effect">
                Dark
              </Button>
            </p>
          </div>
          <h5 className="frame-heading">Smallest size</h5>
          <div className="frame-wrap">
            <p className="demo d-flex gap-1 flex-wrap">
              <Button variant="outline-primary" className="btn-xs waves-effect">
                Primary
              </Button>
              <Button variant="outline-secondary" className="btn-xs waves-effect">
                Secondary
              </Button>
              <Button variant="outline-default" className="btn-xs waves-effect">
                Default
              </Button>
              <Button variant="outline-success" className="btn-xs waves-effect">
                Success
              </Button>
              <Button variant="outline-warning" className="btn-xs waves-effect">
                Warning
              </Button>
              <Button variant="outline-info" className="btn-xs waves-effect">
                Info
              </Button>
              <Button variant="outline-danger" className="btn-xs waves-effect">
                Danger
              </Button>
              <Button variant="outline-dark" className="btn-xs waves-effect">
                Dark
              </Button>
            </p>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const ButtonWithIconOutline = () => {
  return <ComponentCard title={<h2>
          Button
          <span className="fw-300">
            <i>with Icons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">We use the icon tags to insert icons into buttons</div>
          <div className="demo d-flex gap-1 flex-wrap">
            <Button variant="outline-primary" size="lg" className="waves-effect">
              <span className="fal fa-print me-1" />
              Print
            </Button>
            <Button variant="outline-secondary" size="lg" className="waves-effect">
              <span className="fal fa-volume-mute me-1" />
              Mute
            </Button>
            <Button variant="outline-default" size="lg" className="waves-effect">
              <span className="fal fa-check me-1" />
              Submit
            </Button>
            <Button variant="outline-success" size="lg" className="waves-effect">
              <span className="fal fa-download me-1" />
              Download
            </Button>
            <Button variant="outline-warning" size="lg" className="waves-effect">
              <span className="fal fa-exclamation-triangle me-1" />
              Scan Device
            </Button>
            <Button variant="outline-info" size="lg" className="waves-effect">
              <span className="fal fa-bug me-1" />
              Report Bug
            </Button>
            <Button variant="outline-danger" size="lg" className="waves-effect">
              <span className="fal fa-times me-1" />
              Delete
            </Button>
            <Button variant="outline-dark" size="lg" className="waves-effect">
              <span className="fal fa-eject me-1" />
              Eject
            </Button>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const IconOutline = () => {
  return <ComponentCard title={<h2>
          Icon
          <span className="fw-300">
            <i>Outlined</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Convert button to an icon button by adding the class <code>.btn-icon</code>
          </div>
          <h5 className="frame-heading">Various sizes</h5>
          <div className="frame-wrap">
            <p className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="outline-primary" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="outline-secondary" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-volume-mute fs-md" />
              </Button>
              <Button as="a" variant="outline-default" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="outline-success" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="outline-warning" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="outline-info" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="outline-danger" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="outline-dark" size="lg" className="waves-effect btn-icon">
                <i className="fal fa-eject" />
              </Button>
            </p>
            <p className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="outline-primary" className="waves-effect btn-icon">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="outline-secondary" className="waves-effect btn-icon">
                <i className="fal fa-volume-mute fs-md" />
              </Button>
              <Button as="a" variant="outline-default" className="waves-effect btn-icon">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="outline-success" className="waves-effect btn-icon">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="outline-warning" className="waves-effect btn-icon">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="outline-info" className="waves-effect btn-icon">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="outline-danger" className="waves-effect btn-icon">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="outline-dark" className="waves-effect btn-icon">
                <i className="fal fa-eject" />
              </Button>
            </p>
            <p className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="outline-primary" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="outline-secondary" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-volume-mute" />
              </Button>
              <Button as="a" variant="outline-default" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="outline-success" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="outline-warning" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="outline-info" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="outline-danger" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="outline-dark" size="sm" className="waves-effect btn-icon">
                <i className="fal fa-eject" />
              </Button>
            </p>
            <p className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="outline-primary" className="waves-effect btn-icon">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="outline-secondary" className="waves-effect btn-icon">
                <i className="fal fa-volume-mute" />
              </Button>
              <Button as="a" variant="outline-default" className="waves-effect btn-icon">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="outline-success" className="waves-effect btn-icon">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="outline-warning" className="waves-effect btn-icon">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="outline-info" className="waves-effect btn-icon">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="outline-danger" className="waves-effect btn-icon">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="outline-dark" className="waves-effect btn-icon">
                <i className="fal fa-eject" />
              </Button>
            </p>
          </div>
          <h5 className="frame-heading">Rounded outline</h5>
          <div className="frame-wrap">
            <p className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="outline-primary" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="outline-secondary" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-volume-mute fs-md" />
              </Button>
              <Button as="a" variant="outline-default" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="outline-success" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="outline-warning" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="outline-info" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="outline-danger" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="outline-dark" size="lg" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-eject" />
              </Button>
            </p>
            <p className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="outline-primary" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="outline-secondary" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-volume-mute fs-md" />
              </Button>
              <Button as="a" variant="outline-default" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="outline-success" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="outline-warning" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="outline-info" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="outline-danger" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="outline-dark" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-eject" />
              </Button>
            </p>
            <p className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="outline-primary" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="outline-secondary" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-volume-mute" />
              </Button>
              <Button as="a" variant="outline-default" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="outline-success" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="outline-warning" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="outline-info" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="outline-danger" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="outline-dark" size="sm" className="waves-effect btn-icon rounded-circle">
                <i className="fal fa-eject" />
              </Button>
            </p>
            <p className="demo d-flex gap-1 flex-wrap">
              <Button as="a" variant="outline-primary" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-print" />
              </Button>
              <Button as="a" variant="outline-secondary" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-volume-mute" />
              </Button>
              <Button as="a" variant="outline-default" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-check" />
              </Button>
              <Button as="a" variant="outline-success" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-download" />
              </Button>
              <Button as="a" variant="outline-warning" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-exclamation-triangle" />
              </Button>
              <Button as="a" variant="outline-info" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-bug" />
              </Button>
              <Button as="a" variant="outline-danger" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-times" />
              </Button>
              <Button as="a" variant="outline-dark" className="waves-effect btn-xs btn-icon rounded-circle">
                <i className="fal fa-eject" />
              </Button>
            </p>
          </div>
          <h5 className="frame-heading">Hover dot effect</h5>
          <div className="frame-wrap">
            <p className="demo d-flex gap-1 flex-wrap">
              <Button variant="outline-primary" size="lg" className="waves-effect btn-icon rounded-circle hover-effect-dot">
                <i className="fal fa-print" />
              </Button>
              <Button variant="outline-secondary" size="lg" className="waves-effect btn-icon rounded-circle hover-effect-dot">
                <i className="fal fa-volume-mute fs-md" />
              </Button>
              <Button variant="outline-success" size="lg" className="waves-effect btn-icon hover-effect-dot">
                <i className="fal fa-download" />
              </Button>
            </p>
          </div>
        </div>
      </div>
    </ComponentCard>;
};