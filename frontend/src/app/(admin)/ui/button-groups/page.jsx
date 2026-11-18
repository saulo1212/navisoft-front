import ComponentCard from '@/components/ComponentCard';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Button, ButtonGroup, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
export const metadata = {
  title: 'Button Group'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Button Group'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Group a series of buttons together on a single line or stack them in a vertical column.'} />
        <div className="main-content">
          <div className="info-container">
            <p className="mb-0">
              The <code>.btn</code> styles can be applied to other elements, such as <code>&lt;label&gt;</code>s, to provide checkbox or radio style
              button toggling. Add <code>data-bs-toggle="buttons"</code> to a <code>.btn-group</code> containing those modified buttons to enable
              their toggling behavior via JavaScript.
            </p>
          </div>
          <Row>
            <Col xl={6}>
              <SizesExample />
              <NestingExample />
              <VerticalVariation />
            </Col>
            <Col xl={6}>
              <CheckboxAndRadio />
              <ToolBarExample />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;
const SizesExample = () => {
  return <ComponentCard title={<h2>
          Sizes
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Instead of applying button sizing classes to every button in a group, just add <code>.btn-group-*</code> to each <code>.btn-group</code>,
            including each one when nesting multiple groups.
          </div>
          <div className="demo demo-v-spacing-lg">
            <ButtonGroup className="btn-group-lg" role="group" aria-label="Large button group">
              <Button variant="secondary">Left</Button>
              <Button variant="secondary">Middle</Button>
              <Button variant="secondary">Right</Button>
            </ButtonGroup>
            <br />
            <ButtonGroup role="group" aria-label="Default button group">
              <Button variant="secondary">Left</Button>
              <Button variant="secondary">Middle</Button>
              <Button variant="secondary">Right</Button>
            </ButtonGroup>
            <br />
            <ButtonGroup className="btn-group-sm" role="group" aria-label="Small button group">
              <Button variant="secondary">Left</Button>
              <Button variant="secondary">Middle</Button>
              <Button variant="secondary">Right</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const NestingExample = () => {
  return <ComponentCard title={<h2>
          Nesting
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Place a <code>.btn-group</code> within another <code>.btn-group</code> when you want dropdown menus mixed with a series of buttons.
          </div>
          <ButtonGroup role="group" aria-label="Button group with nested dropdown">
            <Button variant="secondary">1</Button>
            <Button variant="secondary">2</Button>
            <Dropdown className="btn-group" role="group">
              <DropdownToggle variant="secondary">Dropdown</DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Dropdown link</DropdownItem>
                <DropdownItem>Dropdown link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </div>
      </div>
    </ComponentCard>;
};
const VerticalVariation = () => {
  return <ComponentCard title={<h2>
          Vertical
          <span className="fw-300">
            <i>Variation</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Make a set of buttons appear vertically stacked rather than horizontally using class <code>.btn-group-vertical</code>.
            <strong>Split button dropdowns are not supported here.</strong>
          </div>
          <Dropdown className="btn-group-vertical" role="group" aria-label="Vertical button group">
            <Button variant="primary">Button</Button>
            <Button variant="primary">Button</Button>
            <ButtonGroup role="group">
              <DropdownToggle variant="primary">Dropdown</DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Dropdown link</DropdownItem>
                <DropdownItem>Dropdown link</DropdownItem>
              </DropdownMenu>
            </ButtonGroup>
            <Button variant="primary">Button</Button>
            <Button variant="primary">Button</Button>
          </Dropdown>
        </div>
      </div>
    </ComponentCard>;
};
const CheckboxAndRadio = () => {
  return <ComponentCard title={<h2>
          Checkbox and Radio
          <span className="fw-300">
            <i>buttons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            <code>.button</code> styles can be applied to other elements, such as
            <code>
              <label />
            </code>
            s, to provide checkbox or radio style button toggling. Add <code>data-toggle="buttons"</code> to a <code>.btn-group</code> containing
            those modified buttons to enable their toggling behavior via JavaScript and add <code>.btn-group-toggle</code> to style the
            <code>input</code>s within your buttons. <strong>Note that you can create single input-powered buttons or groups of them.</strong>
          </div>
          <div className="alert alert-info">
            The checked state for these buttons is
            <strong>
              only updated via <code>click</code> event
            </strong>
            on the button. If you use another method to update the input—e.g., with <code>input type="reset"</code> or by manually applying the
            input’s <code>checked</code> property—you’ll need to toggle <code>.active</code> on the <code>label</code> manually.
          </div>
          <h5 className="frame-heading">Checkbox</h5>
          <div className="frame-wrap">
            <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
              <input type="checkbox" className="btn-check" id="btncheck1" autoComplete="off" />
              <label className="btn btn-primary" htmlFor="btncheck1">
                Checkbox 1
              </label>
              <input type="checkbox" className="btn-check" id="btncheck2" autoComplete="off" />
              <label className="btn btn-primary" htmlFor="btncheck2">
                Checkbox 2
              </label>
              <input type="checkbox" className="btn-check" id="btncheck3" autoComplete="off" />
              <label className="btn btn-primary" htmlFor="btncheck3">
                Checkbox 3
              </label>
            </div>
          </div>
          <h5 className="frame-heading mt-3">Radio</h5>
          <div className="frame-wrap">
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked />
              <label className="btn btn-primary" htmlFor="btnradio1">
                Radio 1
              </label>
              <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
              <label className="btn btn-primary" htmlFor="btnradio2">
                Radio 2
              </label>
              <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
              <label className="btn btn-primary" htmlFor="btnradio3">
                Radio 3
              </label>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const ToolBarExample = () => {
  return <ComponentCard title={<h2>
          Toolbar
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Combine sets of button groups into button toolbars for more complex components. Use utility classes as needed to space out groups,
            buttons, and more.
          </div>
          <div className="btn-toolbar mb-3" role="group" aria-label="Toolbar with button groups">
            <ButtonGroup className="me-2" role="group" aria-label="First group">
              <Button variant="primary">1</Button>
              <Button variant="primary">2</Button>
              <Button variant="primary">3</Button>
              <Button variant="primary">4</Button>
            </ButtonGroup>
            <ButtonGroup className="me-2" role="group" aria-label="Second group">
              <Button variant="primary">5</Button>
              <Button variant="primary">6</Button>
              <Button variant="primary">7</Button>
              <Button variant="primary">8</Button>
            </ButtonGroup>
            <ButtonGroup role="group" aria-label="Third group">
              <Button variant="primary">9</Button>
              <Button variant="primary">10</Button>
              <Button variant="primary" active>
                11
              </Button>
              <Button variant="primary">12</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </ComponentCard>;
};