import ComponentCard from '@/components/ComponentCard'
import { Button, Col, FormCheck, FormControl, FormLabel, FormSelect, InputGroup, Row } from 'react-bootstrap'
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput'
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel'
import InputGroupText from 'react-bootstrap/esm/InputGroupText'

export const InvalidFromStyles = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Invalid
            <span className="fw-300">
              <i>form styles</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <form className="was-validated">
              <div className="mb-3">
                <FormLabel>Text input</FormLabel>
                <FormControl type="text" className="is-invalid" id="simpleinputInvalid" required />
                <div className="invalid-feedback">Please enter a message in the textarea.</div>
              </div>
              <div className="mb-3">
                <FormLabel>Textarea</FormLabel>
                <textarea className="form-control is-invalid" id="validationTextarea3" placeholder="Required example textarea" required rows={4} />
                <div className="invalid-feedback">Please enter a message in the textarea.</div>
              </div>
              <div className="mb-3">
                <FormLabel>Checkbox &amp; Radio</FormLabel>
                <FormCheck className="mb-3">
                  <FormCheckInput type="checkbox" id="customControlValidation1" required />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Check this custom checkbox</FormCheckLabel>
                  <div className="invalid-feedback">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example invalid feedback text</div>
                </FormCheck>
                <FormCheck className="mb-2">
                  <FormCheckInput type="radio" id="customControlValidation2" name="radio-stacked" required />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Toggle this custom radio</FormCheckLabel>
                </FormCheck>
                <FormLabel>
                  <FormCheckInput type="radio" id="customControlValidation3" name="radio-stacked" required />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Or toggle this other custom radio</FormCheckLabel>
                  <div className="invalid-feedback">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;More example invalid feedback text</div>
                </FormLabel>
              </div>
              <div className="mb-3">
                <FormLabel>Switch elements</FormLabel>
                <FormCheck className="form-switch">
                  <FormCheckInput type="checkbox" className="is-invalid" id="customControlValidation4" required />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Toggle this switch element</FormCheckLabel>
                </FormCheck>
              </div>
              <div className="mb-3">
                <FormLabel>Custom select</FormLabel>
                <FormSelect required id="customControlValidation5">
                  <option>Open this select menu</option>
                  <option value={1}>One</option>
                  <option value={2}>Two</option>
                  <option value={3}>Three</option>
                </FormSelect>
                <div className="invalid-feedback">Example invalid custom select feedback</div>
              </div>
              <div className="mb-3">
                <FormLabel>Multiple Select</FormLabel>
                <FormSelect id="customControlValidation6" multiple required>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </FormSelect>
                <div className="invalid-feedback">Please select at least one option</div>
              </div>
              <div className="mb-3">
                <FormLabel>File input</FormLabel>
                <input type="file" className="form-control" id="customFile" required />
                <div className="invalid-feedback">Please choose a file</div>
              </div>
            </form>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const CustomStyles = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Custom
            <span className="fw-300">
              <i>Styles</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              <p>
                For custom Bootstrap form validation messages, you'll need to add the <code>novalidate</code> boolean attribute to your
                <code>&lt;form&gt;</code>. This disables the browser default feedback tooltips, but still provides access to the form validation APIs
                in JavaScript. Try to submit the form below; our JavaScript will intercept the submit button and relay feedback to you. When
                attempting to submit, you'll see the <code>:invalid</code> and <code>:valid</code> styles applied to your form controls.
              </p>
              <p>
                Custom feedback styles apply custom colors, borders, focus styles, and background icons to better communicate feedback. Background
                icons for <code>&lt;select&gt;</code>s are only available with <code>.custom-select</code>, and not <code>.form-control</code>.
              </p>
            </div>
          </div>
          <div className="panel-content">
            <form className="needs-validation" noValidate>
              <Row className="g-3">
                <Col md={4}>
                  <FormLabel>
                    First name <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl type="text" id="validationCustom01" placeholder="First name" defaultValue="Codex" required />
                  <div className="valid-feedback">Looks good!</div>
                </Col>
                <Col md={4}>
                  <FormLabel>
                    Last name <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl type="text" id="validationCustom02" placeholder="Last name" defaultValue="Lantern" required />
                  <div className="valid-feedback">Looks good!</div>
                </Col>
                <Col md={4}>
                  <FormLabel>
                    Username <span className="text-danger">*</span>
                  </FormLabel>
                  <InputGroup className="has-validation">
                    <InputGroupText id="inputGroupPrepend">@</InputGroupText>
                    <FormControl type="text" id="validationCustomUsername" placeholder="Username" aria-describedby="inputGroupPrepend" required />
                    <div className="invalid-feedback">Please choose a username.</div>
                  </InputGroup>
                </Col>
              </Row>
              <Row className="g-3 mt-3">
                <Col md={6}>
                  <FormLabel>
                    City <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl type="text" id="validationCustom03" required />
                  <div className="invalid-feedback">Please provide a valid city.</div>
                </Col>
                <Col md={3}>
                  <FormLabel>
                    State <span className="text-danger">*</span>
                  </FormLabel>
                  <FormSelect id="validationCustom04" required>
                    <option defaultChecked disabled>
                      Choose...
                    </option>
                    <option>Michigan</option>
                    <option>New York</option>
                    <option>Oklahoma</option>
                  </FormSelect>
                  <div className="invalid-feedback">Please select a valid state.</div>
                </Col>
                <Col md={3}>
                  <FormLabel>
                    Zip <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl type="text" id="validationCustom05" required />
                  <div className="invalid-feedback">Please provide a valid zip.</div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12}>
                  <FormCheck>
                    <FormCheckInput type="checkbox" id="invalidCheck" required />
                    &nbsp;&nbsp;&nbsp;
                    <FormCheckLabel>
                      Agree to terms and conditions <span className="text-danger">*</span>
                    </FormCheckLabel>
                    <div className="invalid-feedback">You must agree before submitting.</div>
                  </FormCheck>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col xs={12}>
                  <Button variant="primary">Submit form</Button>
                </Col>
              </Row>
            </form>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const ServerSide = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Server
            <span className="fw-300">
              <i>side</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              We recommend using client-side validation, but in case you require server-side validation, you can indicate invalid and valid form
              fields with <code>.is-invalid</code> and <code>.is-valid</code>. Note that <code>.invalid-feedback</code> is also supported with these
              classes
            </div>
            <form>
              <Row>
                <Col md={4} className="mb-3">
                  <FormLabel>First name</FormLabel>
                  <FormControl type="text" className="is-valid" id="validationServer01" placeholder="First name" defaultValue="Mark" required />
                  <div className="valid-feedback">Looks good!</div>
                </Col>
                <Col md={4} className="mb-3">
                  <FormLabel>Last name</FormLabel>
                  <FormControl type="text" className="is-valid" id="validationServer02" placeholder="Last name" defaultValue="Otto" required />
                  <div className="valid-feedback">Looks good!</div>
                </Col>
                <Col md={4} className="mb-3">
                  <FormLabel>Username</FormLabel>
                  <InputGroup className="has-validation">
                    <InputGroupText>@</InputGroupText>
                    <FormControl type="text" className="is-invalid" placeholder="Username" aria-describedby="inputGroupPrepend3" required />
                    <div className="invalid-feedback">Please choose a username.</div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <FormLabel>City</FormLabel>
                  <FormControl type="text" className="is-invalid" id="validationServer03" placeholder="City" required />
                  <div className="invalid-feedback">Please provide a valid city.</div>
                </Col>
                <Col md={3} className="mb-3">
                  <FormLabel>State</FormLabel>
                  <FormControl type="text" className="is-invalid" id="validationServer04" placeholder="State" required />
                  <div className="invalid-feedback">Please provide a valid state.</div>
                </Col>
                <Col md={3} className="mb-3">
                  <FormLabel>Zip</FormLabel>
                  <FormControl type="text" className="is-invalid" id="validationServer05" placeholder="Zip" required />
                  <div className="invalid-feedback">Please provide a valid zip.</div>
                </Col>
              </Row>
              <div className="mb-3">
                <FormCheck>
                  <FormCheckInput className="is-invalid" type="checkbox" id="invalidCheck3" required />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Agree to terms and conditions</FormCheckLabel>
                  <div className="invalid-feedback">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You must agree before submitting.</div>
                </FormCheck>
              </div>
              <Button variant="primary">Submit form</Button>
            </form>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const ValidFormStyles = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Valid
            <span className="fw-300">
              <i>form styles</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <form className="was-validated">
              <div className="mb-3">
                <FormLabel>Text input</FormLabel>
                <input type="text" className="form-control is-valid" id="simpleinputInvalid2" required defaultValue="test" />
                <div className="valid-feedback">Please enter a message in the textarea.</div>
              </div>
              <div className="mb-3">
                <FormLabel>Textarea</FormLabel>
                <textarea
                  className="form-control is-valid"
                  id="validationTextarea"
                  placeholder="Required example textarea"
                  required
                  rows={4}
                  defaultValue={'test'}
                />
                <div className="valid-feedback">Please enter a message in the textarea.</div>
              </div>
              <div className="mb-3">
                <FormLabel>Checkbox &amp; Radio</FormLabel>
                <div className="custom-control mb-3">
                  <FormCheck>
                    <FormCheckInput type="checkbox" id="customControlValidationSuccess1" required defaultChecked />
                    &nbsp;&nbsp;
                    <FormCheckLabel>Check this custom checkbox</FormCheckLabel>
                    <div className="valid-feedback">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example valid feedback text</div>
                  </FormCheck>
                </div>
                <FormCheck className="mb-2">
                  <FormCheckInput type="radio" id="customControlValidationSuccess2" name="radio-stacked" required defaultChecked />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Toggle this custom radio</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <FormCheckInput type="radio" id="customControlValidationSuccess3" name="radio-stacked" required />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Or toggle this other custom radio</FormCheckLabel>
                  <div className="valid-feedback">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;More example valid feedback text</div>
                </FormCheck>
              </div>
              <div className="mb-3">
                <FormLabel>Switch elements</FormLabel>
                <FormCheck className="form-switch">
                  <FormCheckInput type="checkbox" className="is-valid" id="customControlValidationSuccess4" required defaultChecked />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Toggle this switch element</FormCheckLabel>
                </FormCheck>
              </div>
              <div className="mb-3">
                <FormLabel>Custom select</FormLabel>
                <FormSelect required id="customControlValidationSuccess5">
                  <option>Open this select menu</option>
                  <option value={1} defaultChecked>
                    One
                  </option>
                  <option value={2}>Two</option>
                  <option value={3}>Three</option>
                </FormSelect>
                <div className="valid-feedback">Example valid custom select feedback</div>
              </div>
              <div className="mb-3">
                <FormLabel>Multiple Select</FormLabel>
                <FormSelect id="customControlValidationSuccess6" multiple required>
                  <option defaultChecked>1</option>
                  <option defaultChecked>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </FormSelect>
              </div>
              <div className="mb-3">
                <FormLabel>File input</FormLabel>
                <input type="file" className="form-control" id="customFile" required />
                <div className="invalid-feedback">Please choose a file</div>
              </div>
            </form>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const TooltipStyles = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Tooltip
            <span className="fw-300">
              <i>Styles</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              <p>
                If your form layout allows it, you can swap the
                <code>
                  .{'{'}valid|invalid{'}'}-feedback
                </code>
                classes for
                <code>
                  .{'{'}valid|invalid{'}'}-tooltip
                </code>
                classes to display validation feedback in a styled tooltip. Be sure to have a parent with <code>position: relative</code> on it for
                tooltip positioning. In the example below, our column classes have this already, but your project may require an alternative setup.
              </p>
            </div>
          </div>
          <div className="panel-content p-0">
            <form className="needs-validation" noValidate>
              <div className="panel-content">
                <Row>
                  <Col md={4} className="mb-3 position-relative">
                    <FormLabel>
                      First name <span className="text-danger">*</span>
                    </FormLabel>
                    <FormControl type="text" id="validationTooltip01" placeholder="First name" defaultValue="Codex" required />
                    <div className="valid-tooltip">Looks good!</div>
                  </Col>
                  <Col md={4} className="mb-3 position-relative">
                    <FormLabel>
                      Last name <span className="text-danger">*</span>
                    </FormLabel>
                    <FormControl type="text" id="validationTooltip02" placeholder="Last name" defaultValue="Lantern" required />
                    <div className="valid-tooltip">Looks good!</div>
                  </Col>
                  <Col md={4} className="mb-3 position-relative">
                    <FormLabel>
                      Username <span className="text-danger">*</span>
                    </FormLabel>
                    <InputGroup className="has-validation">
                      <InputGroupText>@</InputGroupText>
                      <FormControl type="text" id="validationTooltip03" placeholder="Username" required />
                      <div className="invalid-tooltip">Please choose a username.</div>
                    </InputGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3 position-relative">
                    <FormLabel>
                      City <span className="text-danger">*</span>
                    </FormLabel>
                    <FormControl type="text" id="validationTooltip04" placeholder="City" required />
                    <div className="invalid-tooltip">Please provide a valid city.</div>
                  </Col>
                  <Col md={3} className="mb-3 position-relative">
                    <FormLabel>
                      State <span className="text-danger">*</span>
                    </FormLabel>
                    <FormSelect id="validationCustom04" required>
                      <option defaultChecked disabled>
                        Choose...
                      </option>
                      <option>Michigan</option>
                      <option>New York</option>
                      <option>Oklahoma</option>
                    </FormSelect>
                    <div className="invalid-tooltip">Please select a valid state.</div>
                  </Col>
                  <Col md={3} className="mb-3 position-relative">
                    <FormLabel>
                      Zip <span className="text-danger">*</span>
                    </FormLabel>
                    <FormControl type="text" id="validationTooltip06" placeholder="Zip" required />
                    <div className="invalid-tooltip">Please provide a valid zip.</div>
                  </Col>
                  <Col xs={12} className="mb-3 position-relative">
                    <FormLabel>
                      Comment <span className="text-danger">*</span>
                    </FormLabel>
                    <textarea className="form-control" id="validationTooltip07" placeholder="Required example textarea" required />
                    <div className="invalid-tooltip">Please enter a message in the textarea.</div>
                  </Col>
                  <Col xs={12} className="position-relative">
                    <label className="form-label mb-2">
                      Please disclose your gender profile <span className="text-danger">*</span>
                    </label>
                    <FormCheck>
                      <FormCheckInput type="radio" id="validationTooltipGenderMale" name="radio-stacked" required />
                      <FormCheckLabel>Male</FormCheckLabel>
                    </FormCheck>
                    <FormCheck>
                      <FormCheckInput type="radio" id="validationTooltipGenderFemale" name="radio-stacked" required />
                      <FormCheckLabel>Female</FormCheckLabel>
                    </FormCheck>
                    <FormCheck>
                      <FormCheckInput type="radio" id="validationTooltipgenderPrivate" name="radio-stacked" required />
                      <FormCheckLabel>Prefer not to say</FormCheckLabel>
                      <div className="invalid-tooltip">Please select at least one</div>
                    </FormCheck>
                  </Col>
                </Row>
              </div>
              <div className="panel-content border-faded border-start-0 border-end-0 border-bottom-0 d-flex flex-row align-items-center">
                <div className="form-check position-relative">
                  <input type="checkbox" className="form-check-input" id="validationTooltipAgreement" required />
                  <label className="form-check-label" htmlFor="validationTooltipAgreement">
                    Agree to terms and conditions <span className="text-danger">*</span>
                  </label>
                  <div className="invalid-tooltip">You must agree before submitting.</div>
                </div>
                <Button variant="primary" className="ms-auto">
                  Submit form
                </Button>
              </div>
            </form>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const BrowserDefault = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Browser
            <span className="fw-300">
              <i>defaults</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              <p>
                Not interested in custom validation or JavaScript? No problem—use browser defaults. Try submitting the form below to see built-in
                feedback styles, which vary by browser and OS. While CSS can't style them, you can customize the text with JavaScript.
              </p>
            </div>
          </div>
          <div className="panel-content p-0">
            <form>
              <div className="panel-content">
                <Row>
                  <Col md={4} className="mb-3">
                    <FormLabel>First name</FormLabel>
                    <FormControl type="text" id="validationDefault01" placeholder="First name" defaultValue="Mark" required />
                  </Col>
                  <Col md={4} className="mb-3">
                    <FormLabel>Last name</FormLabel>
                    <FormControl type="text" id="validationDefault02" placeholder="Last name" defaultValue="Otto" required />
                  </Col>
                  <Col md={4} className="mb-3">
                    <FormLabel>Username</FormLabel>
                    <div className="input-group">
                      <span className="input-group-text" id="inputGroupPrepend4">
                        @
                      </span>
                      <FormControl type="text" id="validationDefaultUsername" placeholder="Username" aria-describedby="inputGroupPrepend4" required />
                    </div>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6} className="mb-3">
                    <FormLabel>City</FormLabel>
                    <FormControl type="text" id="validationDefault03" placeholder="City" required />
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormLabel>State</FormLabel>
                    <FormControl type="text" id="validationDefault04" placeholder="State" required />
                  </Col>
                  <Col md={3} className="mb-3">
                    <FormLabel>Zip</FormLabel>
                    <FormControl type="text" id="validationDefault05" placeholder="Zip" required />
                  </Col>
                </Row>
                <div className="mb-3">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="invalidCheck2" required />
                    <label className="form-check-label" htmlFor="invalidCheck2">
                      Agree to terms and conditions
                    </label>
                  </div>
                </div>
              </div>
              <div className="panel-content border-faded border-start-0 border-end-0 border-bottom-0 d-flex flex-row">
                <Button variant="primary" className="ms-auto waves-effect" type="submit">
                  Submit form
                </Button>
              </div>
            </form>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}
