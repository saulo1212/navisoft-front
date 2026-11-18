import ComponentCard from '@/components/ComponentCard'
import Link from 'next/link'
import { Col, FormControl, FormLabel, FormSelect, Row } from 'react-bootstrap'
import FormRange from 'react-bootstrap/esm/FormRange'

export const GeneralInput = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            General
            <span className="fw-300">
              <i>inputs</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              <p>
                Be sure to use an appropriate type attribute on all inputs (e.g., code <code>email</code> for email address or <code>number</code> for
                numerical information) to take advantage of newer input controls like email verification, number selection, and more.
              </p>
            </div>
            <form>
              <div className="mb-3">
                <FormLabel>Text</FormLabel>
                <FormControl type="text" id="simpleinput" />
              </div>
              <div className="mb-3">
                <FormLabel>Email</FormLabel>
                <FormControl type="email" id="example-email-2" name="example-email-2" placeholder="Email" />
              </div>
              <div className="mb-3">
                <FormLabel>Password</FormLabel>
                <FormControl type="password" id="example-password" defaultValue="password" />
              </div>
              <div className="mb-3">
                <FormLabel>Placeholder</FormLabel>
                <FormControl type="text" id="example-palaceholder" placeholder="placeholder" />
              </div>
              <div className="mb-3">
                <FormLabel>Text area</FormLabel>
                <textarea className="form-control" id="example-textarea" rows={5} />
              </div>
              <div className="mb-3">
                <FormLabel>Static control</FormLabel>
                <input type="text" readOnly className="form-control-plaintext" id="example-static" defaultValue="email@example.com" />
              </div>
              <div className="mb-3">
                <FormLabel>Helping text</FormLabel>
                <FormControl type="text" id="example-helping" placeholder="Helping text" />
                <div className="form-text">A block of help text that breaks onto a new line and may extend beyond one line.</div>
              </div>
              <div className="mb-3">
                <FormLabel>Input Select</FormLabel>
                <FormSelect id="example-select">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </FormSelect>
              </div>
              <div className="mb-3">
                <FormLabel>Multiple Select</FormLabel>
                <FormSelect id="example-multiselect" multiple>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </FormSelect>
              </div>
              <div className="mb-3">
                <FormLabel>Default file input</FormLabel>
                <input type="file" id="example-fileinput" className="form-control" />
              </div>
              <div className="mb-3">
                <FormLabel>Date and time</FormLabel>
                <input className="form-control" type="datetime-local" defaultValue="2023-07-23T11:25:00" id="example-datetime-local-input" />
              </div>
              <div className="mb-3">
                <FormLabel>Date</FormLabel>
                <input className="form-control" id="example-date" type="date" name="date" defaultValue="2023-07-23" />
              </div>
              <div className="mb-3">
                <FormLabel>Month</FormLabel>
                <FormControl id="example-month" type="month" name="month" />
              </div>
              <div className="mb-3">
                <FormLabel>Week</FormLabel>
                <FormControl id="example-week" type="week" name="week" />
              </div>
              <div className="mb-3">
                <FormLabel>Time</FormLabel>
                <FormControl id="example-time-2" type="time" name="time" />
              </div>
              <div className="mb-3">
                <FormLabel>Time</FormLabel>
                <FormControl id="example-time-3" type="time" name="time" />
              </div>
              <div className="mb-3">
                <FormLabel>Number</FormLabel>
                <FormControl id="example-number" type="number" name="number" defaultValue={839473} />
              </div>
              <div className="mb-3">
                <FormLabel>Color</FormLabel>
                <FormControl className="form-control-color" id="example-color" type="color" name="color" defaultValue="#727cf5" />
              </div>
              <div className="mb-3">
                <FormLabel>Range (form-control)</FormLabel>
                <FormRange id="example-range" name="range" min={0} max={100} />
              </div>
              <div className="mb-3">
                <FormLabel>Range</FormLabel>
                <FormRange id="customRange2" />
              </div>
              <div className="mb-3">
                <FormLabel>Select (custom)</FormLabel>
                <FormSelect>
                  <option defaultChecked>Open this select menu</option>
                  <option value={1}>One</option>
                  <option value={2}>Two</option>
                  <option value={3}>Three</option>
                </FormSelect>
              </div>
              <div className="mb-0">
                <FormLabel>File Browser</FormLabel>
                <input type="file" className="form-control" id="customFile" />
              </div>
            </form>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const GeneralDisabled = () => {
  return (
    <ComponentCard
      title={
        <h2>
          General
          <span className="fw-300">
            <i>inputs (disabled)</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              Add disabled to an <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code>, or <code>&lt;button&gt;</code> to block interactions, with
              Bootstrap styling them accordingly. Controls inside a <code>&lt;fieldset disabled&gt;</code> are also disabled. For
              <code>&lt;a&gt;</code> elements, Bootstrap uses <code>pointer-events: none;</code> and reduced opacity instead.
            </p>
          </div>
          <form>
            <div className="mb-3">
              <FormLabel className="text-muted">Text disabled</FormLabel>
              <FormControl type="text" id="simpleinput-disabled" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Email disabled</FormLabel>
              <FormControl type="email" id="example-email-disabled" name="example-email-disabled" placeholder="Email" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Password disabled</FormLabel>
              <FormControl type="password" id="example-password-disabled" defaultValue="password" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Placeholder disabled</FormLabel>
              <FormControl type="text" id="example-palaceholder-disabled" placeholder="placeholder" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Text area disabled</FormLabel>
              <textarea className="form-control" id="example-textarea-disabled" rows={5} disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Static control disabled</FormLabel>
              <input type="text" readOnly className="form-control-plaintext" id="example-static-disabled" defaultValue="email@example.com" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Helping text disabled</FormLabel>
              <FormControl type="text" id="example-helping-disabled" placeholder="Helping text" disabled />
              <div className="form-text">A block of help text that breaks onto a new line and may extend beyond one line.</div>
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Input Select disabled</FormLabel>
              <FormSelect id="example-select-disabled" disabled>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </FormSelect>
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Multiple Select disabled</FormLabel>
              <FormSelect id="example-multiselect-disabled" multiple disabled>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </FormSelect>
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Default file input disabled</FormLabel>
              <FormControl type="file" id="example-fileinput-disabled" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Date and time disabled</FormLabel>
              <FormControl type="datetime-local" defaultValue="2023-07-23T11:25:00" id="example-datetime-local-input-disabled" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Date disabled</FormLabel>
              <FormControl id="example-date-disabled" type="date" name="date" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Month disabled</FormLabel>
              <FormControl id="example-month-disabled" type="month" name="month" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Week disabled</FormLabel>
              <FormControl id="example-week-disabled" type="week" name="week" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Time disabled</FormLabel>
              <FormControl id="example-time-disabled" type="time" name="time" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Time disabled</FormLabel>
              <FormControl id="example-time-disabled-2" type="time" name="time" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Number disabled</FormLabel>
              <FormControl id="example-number-disabled" type="number" name="number" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Color disabled</FormLabel>
              <input
                className="form-control form-control-color disabled"
                id="example-color-disabled"
                type="color"
                name="color"
                defaultValue="#ed1c24"
                disabled
              />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Range disabled</FormLabel>
              <input className="form-control" id="example-range-disabled" type="range" name="range" min={0} max={100} disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Range (disabled)</FormLabel>
              <input type="range" className="form-range" id="customRange1" disabled />
            </div>
            <div className="mb-3">
              <FormLabel className="text-muted">Select (disabled)</FormLabel>
              <select className="form-select" disabled>
                <option defaultChecked>Open this select menu</option>
                <option value={1}>One</option>
                <option value={2}>Two</option>
                <option value={3}>Three</option>
              </select>
            </div>
            <div className="mb-0">
              <FormLabel className="text-muted">File Browser (disabled)</FormLabel>
              <input type="file" className="form-control" id="customFile-2" disabled />
            </div>
          </form>
        </div>
      </div>
    </ComponentCard>
  )
}

export const FloatingLabels = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Floating
          <span className="fw-300">
            <i>Labels</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <Row>
            <Col xl={12}>
              <div className="frame-wrap mb-4">
                <div className="form-floating mb-3">
                  <FormControl type="email" id="floatingInput" placeholder="name@example.com" />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <FormControl type="password" id="floatingPassword" placeholder="Password" />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="form-floating mb-3">
                  <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea" style={{ height: 100 }} />
                  <label htmlFor="floatingTextarea">Comments</label>
                </div>
                <div className="form-floating">
                  <FormSelect id="floatingSelect" aria-label="Floating label select example">
                    <option defaultChecked>Open this select menu</option>
                    <option value={1}>One</option>
                    <option value={2}>Two</option>
                    <option value={3}>Three</option>
                  </FormSelect>
                  <label htmlFor="floatingSelect">Works with selects</label>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>
  )
}

export const FloatingDisabled = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Floating
          <span className="fw-300">
            <i>Labels (Disabled)</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <Row>
            <Col xl={12}>
              <div className="frame-wrap mb-4">
                <div className="form-floating mb-3">
                  <FormControl type="email" id="floatingInputDisabled" placeholder="name@example.com" disabled />
                  <label htmlFor="floatingInputDisabled">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <FormControl type="password" id="floatingPasswordDisabled" placeholder="Password" disabled />
                  <label htmlFor="floatingPasswordDisabled">Password</label>
                </div>
                <div className="form-floating mb-3">
                  <FormControl placeholder="Leave a comment here" id="floatingTextareaDisabled" style={{ height: 100 }} disabled />
                  <label htmlFor="floatingTextareaDisabled">Comments</label>
                </div>
                <div className="form-floating">
                  <FormSelect id="floatingSelectDisabled" aria-label="Floating label select example" disabled>
                    <option defaultChecked>Open this select menu</option>
                    <option value={1}>One</option>
                    <option value={2}>Two</option>
                    <option value={3}>Three</option>
                  </FormSelect>
                  <label htmlFor="floatingSelectDisabled">Works with selects</label>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>
  )
}

export const InputSizes = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Input
          <span className="fw-300">
            <i>Sizes</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Set heights using classes like <code>.form-control-lg</code>, <code>.form-control-sm</code> and for custom inputs, you can use
            <code>.form-select-sm</code>, <code>.form-select-lg</code>, and set widths using grid column classes like <code>.col-lg-*</code>
          </div>
          <form>
            <div className="mb-3">
              <FormLabel>Small</FormLabel>
              <FormControl
                type="text"
                id="example-input-small"
                name="example-input-small"
                className="form-control-sm"
                placeholder=".form-control-sm"
              />
            </div>
            <div className="mb-3">
              <FormLabel>Normal</FormLabel>
              <FormControl type="text" id="example-input-normal" name="example-input-normal" placeholder="Normal" />
            </div>
            <div className="mb-3">
              <FormLabel>Large</FormLabel>
              <FormControl
                type="text"
                id="example-input-large"
                name="example-input-large"
                className="form-control-lg"
                placeholder=".form-control-lg"
              />
            </div>
            <div className="mb-0">
              <Row>
                <Col xs={6}>
                  <FormLabel>Grid Sizes</FormLabel>
                </Col>
                <Col xs={6} className="text-end">
                  <Link href="" title="Responsive Grid" target="_blank">
                    Check out how it works
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col xs={3}>
                  <FormControl type="text" id="example-gridsize" className="border-primary" placeholder=".col-3" />
                </Col>
                <Col>
                  <FormControl type="text" id="example-gridsize-2" className="border-success" placeholder=".col" />
                </Col>
                <Col xs={12}>
                  <div className="mt-3">
                    <input className="form-range" id="gridrange" type="range" name="gridrange" min={1} max={12} defaultValue={3} />
                  </div>
                </Col>
              </Row>
            </div>
          </form>
        </div>
      </div>
    </ComponentCard>
  )
}

export const AlteringWithUtilities = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Altering
          <span className="fw-300">
            <i>with utilities</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">You can easily alter the border, border-radius and padding using the utility classes.</div>
          <Row>
            <Col lg={3}>
              <div className="mb-3">
                <FormLabel>Square edges</FormLabel>
                <FormControl type="text" id="example-input-square" className="rounded-0" placeholder="Square borders" />
              </div>
            </Col>
            <Col lg={3}>
              <div className="mb-3">
                <FormLabel>Rounded pill</FormLabel>
                <FormControl type="text" id="example-input-pill" className="rounded-pill" placeholder="Rounded pill" />
              </div>
            </Col>
            <Col lg={3}>
              <div className="mb-3">
                <FormLabel>Material</FormLabel>
                <FormControl
                  type="text"
                  id="example-input-material"
                  className="rounded-0 border-top-0 border-start-0 border-end-0 px-0 bg-transparent"
                  placeholder="Material"
                />
              </div>
            </Col>
            <Col lg={3}>
              <div className="mb-3">
                <FormLabel>Border color</FormLabel>
                <FormControl type="text" id="example-input-border" className="border-info" placeholder="Border colors" />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>
  )
}
