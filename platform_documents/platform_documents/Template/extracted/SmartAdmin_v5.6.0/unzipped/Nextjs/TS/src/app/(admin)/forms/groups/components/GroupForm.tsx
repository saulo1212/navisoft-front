import ComponentCard from '@/components/ComponentCard'
import { basePath } from '@/helpers'
import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormCheck,
  FormControl,
  FormLabel,
  FormSelect,
  InputGroup,
} from 'react-bootstrap'
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput'
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel'
import InputGroupText from 'react-bootstrap/esm/InputGroupText'

export const BasicExample = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Basic
          <span className="fw-300">
            <i>example</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              Place one add-on or button on either side of an input. You may also place one on both sides of an input. Remember to place
              <code>&lt;label&gt;</code>s outside the input group.
            </p>
          </div>
          <div className="mb-3">
            <FormLabel>Prepend</FormLabel>
            <div className="input-group">
              <span className="input-group-text">@</span>
              <FormControl
                type="text"
                id="basic-addon1"
                name="username"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
                autoComplete="username"
              />
            </div>
            <div className="form-text">Some help content goes here</div>
          </div>
          <div className="mb-3">
            <FormLabel>Append</FormLabel>
            <div className="input-group">
              <FormControl
                id="basic-addon2"
                name="recipient"
                type="text"
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                autoComplete="off"
              />
              <span className="input-group-text">@example.com</span>
            </div>
          </div>
          <div className="mb-3">
            <FormLabel>Your vanity URL</FormLabel>
            <div className="input-group">
              <span className="input-group-text" id="basic-addon3">
                https://example.com/users/
              </span>
              <FormControl type="text" id="basic-url" name="vanity-url" aria-describedby="basic-addon3" autoComplete="off" />
            </div>
          </div>
          <div className="mb-3">
            <FormLabel>Prepend and append</FormLabel>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <FormControl type="text" id="amount-input" name="amount" aria-label="Amount (to the nearest dollar)" autoComplete="off" />
              <span className="input-group-text">.00</span>
            </div>
          </div>
          <div className="mb-3">
            <FormLabel>Text area example</FormLabel>
            <div className="input-group">
              <span className="input-group-text">Comment</span>
              <textarea className="form-control" id="comment-textarea" name="comment" aria-label="With textarea" autoComplete="off" />
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const WrappingInput = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Wrapping
          <span className="fw-300">
            <i>inputs</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Input groups wrap by default via <code>flex-wrap: wrap</code> in order to accommodate custom form field validation within an input group.
            You may disable this with <code>.flex-nowrap</code>
          </div>
          <div className="mb-3">
            <FormLabel>Prepend with flex-nowrap</FormLabel>
            <div className="input-group flex-nowrap">
              <span className="input-group-text">
                <i className="sa sa-user fs-xl" />
              </span>
              <FormControl
                id="addon-wrapping-left"
                name="username-left"
                type="text"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="addon-wrapping-left"
                autoComplete="username"
              />
            </div>
          </div>
          <div className="mb-0">
            <FormLabel>Append with flex-nowrap</FormLabel>
            <div className="input-group flex-nowrap">
              <FormControl
                id="addon-wrapping-right"
                name="username-right"
                type="text"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="addon-wrapping-right"
                autoComplete="username"
              />
              <span className="input-group-text">
                <i className="sa sa-user fs-xl" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const VariousSizing = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Various
          <span className="fw-300">
            <i>sizing</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add the relative form sizing classes to the <code>.input-group</code> itself and contents within will automatically resize—no need for
            repeating the form control size classes on each element. <strong>Sizing on the individual input group elements isn't supported</strong>
          </div>
          <div className="mb-3">
            <FormLabel>Large Input Group</FormLabel>
            <InputGroup className="input-group-lg">
              <InputGroupText className="py-1 px-3">
                <div className="stack-icon" style={{ fontSize: '2.25rem' }}>
                  <div className="icon-layers stack-3x">
                    <i className="sa sa-base-2 text-success" />
                  </div>
                  <div className="icon-layers stack-2x">
                    <i className="sa sa-base-10 stack-2x alpha-2" />
                  </div>
                  <div className="icon-layers stack-1x">
                    <i className="sa sa-base-10 stack-1x text-light" />
                  </div>
                  <div className="icon-layers stack-1x">
                    <i className="sa sa-profile stack-1x text-dark" />
                  </div>
                </div>
              </InputGroupText>
              <FormControl id="input-group-lg-size" name="large-input" type="text" placeholder="Large size" aria-describedby="input-group-lg-size" />
            </InputGroup>
            <span className="form-text text-muted">Some help content goes here</span>
          </div>
          <div className="mb-3">
            <FormLabel>Large Input Group</FormLabel>
            <InputGroup className="input-group-lg">
              <InputGroupText>0.00%</InputGroupText>
              <span className="input-group-text text-danger">
                <i className="sa sa-lock" />
              </span>
              <FormControl
                id="input-group-lg-size-2"
                name="large-input-2"
                type="text"
                placeholder="Large size"
                aria-describedby="input-group-lg-size-2"
              />
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Small Input Group</FormLabel>
            <InputGroup className="input-group-sm">
              <FormControl id="input-group-sm-size" name="small-input" type="text" placeholder="Small size" aria-describedby="input-group-sm-size" />
              <InputGroupText>
                <i className="sa sa-reload" />
              </InputGroupText>
            </InputGroup>
          </div>
          <div className="mb-0">
            <FormLabel>Small Input Group</FormLabel>
            <InputGroup className="input-group-sm">
              <InputGroupText>
                <i className="sa sa-reload" />
              </InputGroupText>
              <FormControl
                id="input-group-sm-size-2"
                name="small-input-2"
                type="text"
                placeholder="Small size"
                aria-describedby="input-group-sm-size-2"
              />
            </InputGroup>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const CheckboxesAndRadio = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Checkboxes
          <span className="fw-300">
            <i>and radios</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Place any checkbox or radio option within an input group's addon instead of text</div>
          <div className="mb-3">
            <FormLabel>Checkbox generic</FormLabel>
            <InputGroup>
              <InputGroupText>
                <input type="checkbox" id="checkbox-generic" name="checkbox-generic" aria-label="Checkbox for following text input" />
              </InputGroupText>
              <FormControl type="text" id="checkbox-group-1" name="checkbox-text" aria-label="Text input with checkbox" autoComplete="off" />
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Checkbox</FormLabel>
            <InputGroup>
              <InputGroupText>
                <FormCheck className="mb-0">
                  <FormCheckInput type="checkbox" id="checkmeout1" name="checkmeout1" />
                  &nbsp;&nbsp;
                  <FormCheckLabel>I agree</FormCheckLabel>
                </FormCheck>
              </InputGroupText>
              <InputGroupText className="text-success">
                <span className="fw-500">$</span>
              </InputGroupText>
              <FormControl type="text" id="checkbox-group-2" name="checkbox-text-2" aria-label="Text input with checkbox" autoComplete="off" />
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Checkbox split</FormLabel>
            <InputGroup>
              <InputGroupText className="text-success">
                <i className="sa sa-big-plus fs-xl" />
              </InputGroupText>
              <FormControl type="text" id="checkbox-group-3" name="checkbox-text-3" aria-label="Text input with checkbox" autoComplete="off" />
              <InputGroupText>
                <FormCheck className="mb-0">
                  <FormCheckInput type="checkbox" id="checkmeout2" name="checkmeout2" />
                  &nbsp;&nbsp;
                  <FormCheckLabel htmlFor="checkmeout2">I agree</FormCheckLabel>
                </FormCheck>
              </InputGroupText>
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Checkbox switch</FormLabel>
            <InputGroup>
              <FormControl
                type="text"
                id="checkbox-group-4"
                name="checkbox-text-4"
                aria-label="Text input with checkbox"
                placeholder="Record title"
                autoComplete="off"
              />
              <InputGroupText>
                <FormCheck className="form-switch mb-0">
                  <FormCheckInput id="eventlog-switch-1" name="debugger-active" type="checkbox" />
                  &nbsp;&nbsp;
                  <FormCheckLabel className="fw-500" htmlFor="eventlog-switch-1">
                    Debugger Active
                  </FormCheckLabel>
                </FormCheck>
              </InputGroupText>
              <InputGroupText>
                <FormCheck className="form-switch mb-0">
                  <FormCheckInput id="eventlog-switch-2" name="record-logs" type="checkbox" />
                  &nbsp;&nbsp;
                  <FormCheckLabel className="fw-500" htmlFor="eventlog-switch-2">
                    Record Logs
                  </FormCheckLabel>
                </FormCheck>
              </InputGroupText>
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Radio generic</FormLabel>
            <InputGroup>
              <InputGroupText>
                <FormCheck className="form-switch mb-0">
                  <FormCheckInput type="radio" id="customRadio1" name="customRadio" />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Yes</FormCheckLabel>
                </FormCheck>
              </InputGroupText>
              <InputGroupText>
                <FormCheck className="form-switch mb-0">
                  <FormCheckInput type="radio" id="customRadio2" name="customRadio" />
                  &nbsp;&nbsp;
                  <FormCheckLabel>No</FormCheckLabel>
                </FormCheck>
              </InputGroupText>
              <FormControl type="text" id="radio-group-1" name="radio-text" aria-label="Text input with radio button" />
            </InputGroup>
          </div>
          <div className="mb-0">
            <FormLabel>Radio generic</FormLabel>
            <InputGroup>
              <InputGroupText>
                <FormCheck className="mb-0">
                  <FormCheckInput type="radio" id="customRadio3" name="customRadio2" />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Yes</FormCheckLabel>
                </FormCheck>
              </InputGroupText>
              <InputGroupText className="text-danger">
                <span className="fw-500">$</span>
              </InputGroupText>
              <FormControl type="text" id="radio-group-2" name="radio-text-2" aria-label="Text input with radio button" />
              <InputGroupText>
                <FormCheck className="mb-0">
                  <FormCheckInput type="radio" id="customRadio4" name="customRadio2" />
                  &nbsp;&nbsp;
                  <FormCheckLabel>No</FormCheckLabel>
                </FormCheck>
              </InputGroupText>
            </InputGroup>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const MultipleInput = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Multiple
          <span className="fw-300">
            <i>inputs</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add the relative form sizing classes to the <code>.input-group</code> itself and contents within will automatically resize—no need for
            repeating the form control size classes on each element. You can add <code>.input-group-multi-transition</code> to
            <code>.input-group</code> to animate focused inputs
          </div>
          <div className="mb-3">
            <FormLabel>Two input fields</FormLabel>
            <InputGroup>
              <InputGroupText className="text-success">
                <i className="sa sa-user fs-xl" />
              </InputGroupText>
              <FormControl type="text" aria-label="First name" placeholder="First name" id="name-f" name="first-name" autoComplete="given-name" />
              <FormControl type="text" aria-label="Last name" placeholder="Last name" id="name-l" name="last-name" autoComplete="family-name" />
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Three input fields (animated)</FormLabel>
            <InputGroup className="input-group-multi-transition">
              <InputGroupText>@</InputGroupText>
              <FormControl
                type="text"
                aria-label="Dollar amount (with dot and two decimal places)"
                id="dollar-1"
                name="recipient"
                placeholder="Recipient"
                autoComplete="off"
              />
              <FormControl type="text" aria-label="Person name" id="dollar-2" name="email" placeholder="Email" autoComplete="email" />
              <FormControl type="text" aria-label="Person name" id="dollar-3" name="amount" placeholder="Amount" autoComplete="off" />
              <InputGroupText>0.00</InputGroupText>
            </InputGroup>
          </div>
          <div className="mb-0">
            <FormLabel>Between two inputs</FormLabel>
            <InputGroup>
              <FormControl type="text" id="between-input-1" name="between-input-1" autoComplete="off" />
              <InputGroupText>
                <i className="sa sa-arrow-right fs-xl" />
              </InputGroupText>
              <FormControl type="text" id="between-input-2" name="between-input-2" autoComplete="off" />
            </InputGroup>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const SegmentedButton = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Segmented
          <span className="fw-300">
            <i>buttons</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Dropdown with action buttons</div>
          <div className="mb-3">
            <FormLabel>Button from left</FormLabel>
            <Dropdown className="input-group">
              <Button variant="outline-default" type="button" className="waves-effect" id="button-addon1" name="button-addon1">
                Go
              </Button>
              <DropdownToggle as="button" className="btn btn-outline-default dropdown-toggle-split">
                <span className="visually-hidden">Toggle Dropdown</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
              <FormControl type="text" aria-label="Text input with segmented dropdown button" />
            </Dropdown>
          </div>
          <div className="mb-0">
            <FormLabel>Button from right</FormLabel>
            <Dropdown className="input-group">
              <FormControl type="text" aria-label="Text input with segmented dropdown button" />
              <Button variant="outline-default" type="button" className="waves-effect">
                Action
              </Button>
              <DropdownToggle as="button" className="btn btn-outline-default dropdown-toggle-split">
                <span className="visually-hidden">Toggle Dropdown</span>
              </DropdownToggle>
              <DropdownMenu align={'end'}>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const SeamlessIcon = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Seamless
          <span className="fw-300">
            <i>icon</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Add seamless icons using various utility classes</div>
          <div className="mb-3">
            <FormLabel>Icon on left</FormLabel>
            <InputGroup className="body-bg shadow-inset-2 rounded">
              <InputGroupText className="bg-transparent border-end-0">
                <i className="sa sa-magnifier text-dark" />
              </InputGroupText>
              <FormControl
                type="text"
                className="border-start-0 bg-transparent ps-0"
                id="search-left"
                name="search-left"
                placeholder="Search..."
                autoComplete="off"
              />
            </InputGroup>
            <span className="form-text text-muted">Some help content goes here</span>
          </div>
          <div className="mb-3">
            <FormLabel>Icon on Right</FormLabel>
            <InputGroup className="body-bg shadow-inset-2 rounded">
              <FormControl
                type="text"
                className="border-end-0 bg-transparent pe-0"
                id="search-right"
                name="search-right"
                placeholder="Search..."
                autoComplete="off"
              />
              <InputGroupText className="bg-transparent border-start-0">
                <i className="sa sa-magnifier text-dark" />
              </InputGroupText>
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Large icon</FormLabel>
            <InputGroup className="input-group-lg body-bg shadow-inset-2 rounded">
              <InputGroupText className="bg-transparent border-end-0 py-1 px-3">
                <div className="stack-icon" style={{ fontSize: '2.2rem' }}>
                  <div className="icon-layers">
                    <i className="sa sa-base-7 text-info" />
                  </div>
                  <div className="icon-layers">
                    <svg className="sa-icon stack-1x sa-icon-light sa-bold">
                      <use href={`${basePath}/icons/sprite.svg#database`} />
                    </svg>
                  </div>
                </div>
              </InputGroupText>
              <FormControl
                type="text"
                className="border-start-0 bg-transparent ps-0"
                id="search-large"
                name="search-large"
                placeholder="Search..."
                autoComplete="off"
              />
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Small icon with button</FormLabel>
            <InputGroup className="input-group-sm body-bg shadow-inset-2 rounded">
              <InputGroupText className="bg-transparent border-end-0 py-1 px-3">
                <i className="sa sa-magnifier text-success" />
              </InputGroupText>
              <FormControl
                type="text"
                className="border-start-0 bg-transparent ps-0"
                id="search-small"
                name="search-small"
                placeholder="Type here..."
                autoComplete="off"
              />
              <Button variant="outline-default" className="waves-effect">
                Search
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const ButtonAddon = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Button
          <span className="fw-300">
            <i>addon</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="mb-3">
            <FormLabel>Button on left</FormLabel>
            <InputGroup>
              <Button variant="outline-default" className="waves-effect" id="button-addon1" name="button-addon1">
                Go
              </Button>
              <FormControl
                type="text"
                id="button-input-1"
                name="button-input-1"
                placeholder="Search anything..."
                aria-label="Example text with button addon"
                aria-describedby="button-addon1"
                autoComplete="off"
              />
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Button on right</FormLabel>
            <InputGroup>
              <FormControl
                type="text"
                id="button-input-2"
                name="button-input-2"
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
                autoComplete="off"
              />
              <Button variant="outline-default" className="waves-effect">
                Look up!
              </Button>
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Button on both sides</FormLabel>
            <InputGroup>
              <Button variant="outline-default" className="waves-effect">
                Go
              </Button>
              <FormControl
                id="button-addon3"
                name="button-input-3"
                type="text"
                placeholder="Search for anything..."
                aria-label="Example text with two button addons"
                aria-describedby="button-addon3"
                autoComplete="off"
              />
              <Button variant="outline-default" className="waves-effect" id="button-addon3-2" name="button-addon3-2">
                Go
              </Button>
              <Button variant="outline-default" className="waves-effect" id="button-addon3-3" name="button-addon3-3">
                Go
              </Button>
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Button on left with icon</FormLabel>
            <InputGroup>
              <Button variant="info" className="shadow-0 waves-effect" id="button-addon4" name="button-addon4">
                <i className="sa sa-magnifier" />
              </Button>
              <FormControl
                id="button-input-4"
                name="button-input-4"
                type="text"
                placeholder="Search anything..."
                aria-label="Example text with button addon"
                aria-describedby="button-addon4"
                autoComplete="off"
              />
            </InputGroup>
          </div>
          <div className="mb-0">
            <FormLabel>Button on right</FormLabel>
            <InputGroup>
              <FormControl
                type="text"
                id="button-input-5"
                name="button-input-5"
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="button-addon5"
                autoComplete="off"
              />
              <Button variant="primary" className="waves-effect shadow-0">
                <i className="sa sa-magnifier" />
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const ButtonAddonWithDropdown = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Buttons
          <span className="fw-300">
            <i>with dropdown</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Dropdowns are easily integrated just like buttons, you can have more than one dropdowns</div>
          <div className="mb-3">
            <FormLabel>Dropdown on left</FormLabel>
            <Dropdown className="input-group">
              <DropdownToggle as={'button'} className="btn btn-outline-default">
                Dropdown
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider role="separator" />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
              <FormControl
                type="text"
                aria-label="Text input with dropdown button"
                id="dropdown-input-left"
                name="dropdown-input-left"
                autoComplete="off"
              />
            </Dropdown>
            <span className="form-text text-muted">Some help content goes here</span>
          </div>
          <div className="mb-3">
            <FormLabel>Dropdown on right</FormLabel>
            <Dropdown className="input-group">
              <FormControl
                type="text"
                aria-label="Text input with dropdown button"
                id="dropdown-input-right"
                name="dropdown-input-right"
                autoComplete="off"
              />
              <DropdownToggle className="btn btn-outline-default" as={'button'}>
                Dropdown
              </DropdownToggle>
              <DropdownMenu align={'end'}>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider role="separator" />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <span className="form-text text-muted">Some help content goes here</span>
          </div>
          <div className="mb-0">
            <FormLabel>Dropdown on both</FormLabel>
            <Dropdown className="input-group">
              <DropdownToggle className="btn btn-outline-default" as={'button'}>
                Dropdown
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider role="separator" />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
              <FormControl
                type="text"
                aria-label="Text input with dropdown button"
                id="dropdown-input-both"
                name="dropdown-input-both"
                autoComplete="off"
              />
              <DropdownToggle as={'button'} className="btn btn-outline-default">
                Dropdown
              </DropdownToggle>
              <DropdownMenu align={'end'}>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider role="separator" />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <span className="form-text text-muted">Some help content goes here</span>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const CustomForms = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Custom
          <span className="fw-300">
            <i>forms</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Input groups include support for custom selects and custom file inputs. Browser default versions of these are not supported
          </div>
          <div className="mb-3">
            <FormLabel>Label &amp; select on left</FormLabel>
            <InputGroup>
              <InputGroupText>Options</InputGroupText>
              <FormSelect id="inputGroupSelect01" name="inputGroupSelect01" autoComplete="off">
                <option defaultChecked>Choose...</option>
                <option value={1}>One</option>
                <option value={2}>Two</option>
                <option value={3}>Three</option>
              </FormSelect>
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Label &amp; select on right</FormLabel>
            <InputGroup>
              <FormSelect id="inputGroupSelect02" name="inputGroupSelect02" autoComplete="off">
                <option defaultChecked>Choose...</option>
                <option value={1}>One</option>
                <option value={2}>Two</option>
                <option value={3}>Three</option>
              </FormSelect>
              <InputGroupText>Options</InputGroupText>
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Button &amp; select on left</FormLabel>
            <InputGroup>
              <Button variant="outline-default" className="waves-effect" id="button-select-1" name="button-select-1">
                Button
              </Button>
              <FormSelect id="inputGroupSelect03" name="inputGroupSelect03">
                <option defaultChecked>Choose...</option>
                <option value={1}>One</option>
                <option value={2}>Two</option>
                <option value={3}>Three</option>
              </FormSelect>
            </InputGroup>
          </div>
          <div className="mb-0">
            <FormLabel>Button &amp; select on right</FormLabel>
            <InputGroup>
              <FormSelect id="inputGroupSelect04" name="inputGroupSelect04">
                <option defaultChecked>Choose...</option>
                <option value={1}>One</option>
                <option value={2}>Two</option>
                <option value={3}>Three</option>
              </FormSelect>
              <Button variant="outline-default" className="waves-effect" id="button-select-2" name="button-select-2">
                Button
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const FileUpload = () => {
  return (
    <ComponentCard
      title={
        <h2>
          File
          <span className="fw-300">
            <i>upload</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Combine file upload with addon elements</div>
          <div className="mb-3">
            <FormLabel>File input with addon</FormLabel>
            <InputGroup>
              <InputGroupText>Upload</InputGroupText>
              <input type="file" className="form-control" id="inputGroupFile01" name="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
            </InputGroup>
            <div className="form-text">Some help content goes here</div>
          </div>
          <div className="mb-3">
            <FormLabel>Button &amp; select on right</FormLabel>
            <InputGroup>
              <input type="file" className="form-control" id="inputGroupFile02" name="inputGroupFile02" aria-describedby="inputGroupFileAddon02" />
              <InputGroupText id="inputGroupFileAddon02">Upload</InputGroupText>
            </InputGroup>
          </div>
          <div className="mb-3">
            <FormLabel>Button &amp; select on right</FormLabel>
            <InputGroup>
              <Button variant="outline-default" className="waves-effect" id="inputGroupFileAddon03" name="inputGroupFileAddon03">
                Button
              </Button>
              <input type="file" className="form-control" id="inputGroupFile03" />
            </InputGroup>
            <div className="form-text">Some help content goes here</div>
          </div>
          <div className="mb-0">
            <FormLabel>Button &amp; select on right</FormLabel>
            <InputGroup>
              <input type="file" className="form-control" id="inputGroupFile04" />
              <Button variant="outline-default" className="waves-effect" id="inputGroupFileAddon04" name="inputGroupFileAddon04">
                Button
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const KitchenSink = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Kitchen
          <span className="fw-300">
            <i>sink</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">A combination of elements working in harmony</div>
          <div className="mb-0">
            <FormLabel>Combined elements</FormLabel>
            <Dropdown className="input-group">
              <InputGroupText className="text-success">
                <i className="sa sa-user fs-xl" />
              </InputGroupText>
              <FormControl type="text" placeholder="User" id="user" name="user" autoComplete="username" />
              <span className="input-group-text">
                <i className="sa sa-arrow-right fs-xl" />
              </span>
              <FormSelect id="usertype" name="usertype">
                <option defaultChecked>User type</option>
                <option value={1}>One</option>
                <option value={2}>Two</option>
                <option value={3}>Three</option>
              </FormSelect>
              <Button variant="success" className="shadow-0 waves-effect">
                Save
              </Button>

              <DropdownToggle
                as="button"
                className="btn btn-success shadow-0 dropdown-toggle-split"
                id="save-dropdown"
                name="save-dropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <span className="visually-hidden">Toggle Dropdown</span>
              </DropdownToggle>
              <DropdownMenu align={'end'}>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem>Something else here</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div className="form-text">Some help content goes here</div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
