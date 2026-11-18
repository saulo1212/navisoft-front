'use client'
import ComponentCard from '@/components/ComponentCard'
import { useState } from 'react'
import { Button, Col, FormCheck, Row } from 'react-bootstrap'
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput'
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel'

export const CheckboxInput = () => {
  const [isCircle, setIsCircle] = useState(false)

  const handleToggleCircle = () => {
    setIsCircle((prev) => !prev)
  }

  const inputClass = isCircle ? 'rounded-circle' : ''
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Checkbox
            <span className="fw-300">
              <i>inputs</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Add <code>.form-check</code> wrapper to your <code>input</code> and <code>label</code> to create a custom checkbox component. You can
              add <code>.rounded-circle</code> to the input to make it circular.
            </div>

            <Button
              variant={isCircle ? 'danger' : 'outline-danger'}
              id="js-checkbox-toggle"
              className="waves-effect mb-g"
              onClick={handleToggleCircle}>
              {isCircle ? 'Change back to default' : 'Change to CIRCLE'}
            </Button>

            <h5 className="frame-heading">Block alignment</h5>
            <div className="frame-wrap">
              <div className="demo demo-checkbox">
                <FormCheck>
                  <FormCheckInput type="checkbox" id="defaultUnchecked" className={inputClass} />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Unchecked</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <FormCheckInput type="checkbox" id="defaultChecked" defaultChecked className={inputClass} />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Checked</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <FormCheckInput type="checkbox" id="defaultIndeterminate" defaultChecked className={inputClass} />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Indeterminate</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <FormCheckInput type="checkbox" id="defaultUncheckedDisabled" disabled className={inputClass} />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Unchecked &amp; disabled</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <FormCheckInput type="checkbox" id="defaultCheckedDisabled" defaultChecked disabled className={inputClass} />
                  &nbsp;&nbsp;
                  <FormCheckLabel>Checked &amp; disabled</FormCheckLabel>
                </FormCheck>
              </div>
            </div>

            <h5 className="frame-heading">Inline alignment</h5>
            <div className="frame-wrap demo-checkbox">
              <FormCheck className="form-check-inline">
                <FormCheckInput type="checkbox" id="defaultInline1" className={inputClass} />
                &nbsp;&nbsp;
                <FormCheckLabel htmlFor="defaultInline1">Unchecked</FormCheckLabel>
              </FormCheck>
              <FormCheck className="form-check-inline">
                <FormCheckInput type="checkbox" id="defaultInline2" defaultChecked className={inputClass} />
                &nbsp;&nbsp;
                <FormCheckLabel htmlFor="defaultInline2">Checked</FormCheckLabel>
              </FormCheck>
              <FormCheck className="form-check-inline">
                <FormCheckInput type="checkbox" id="defaultInlined" disabled className={inputClass} />
                &nbsp;&nbsp;
                <FormCheckLabel htmlFor="defaultInlined">Disabled</FormCheckLabel>
              </FormCheck>
              <FormCheck className="form-check-inline">
                <FormCheckInput type="checkbox" id="defaultInline3" defaultChecked disabled className={inputClass} />
                &nbsp;&nbsp;
                <FormCheckLabel htmlFor="defaultInline3">Checked &amp; disabled</FormCheckLabel>
              </FormCheck>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const RadioInput = () => {
  const [isRounded, setIsRounded] = useState(false)

  const handleToggleRounded = () => {
    setIsRounded((prev) => !prev)
  }

  const inputClass = isRounded ? 'rounded' : ''

  return (
    <>
      <ComponentCard
        title={
          <h2>
            Radio{' '}
            <span className="fw-300">
              <i>inputs</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Add <code>.form-check</code> wrapper to your <code>input</code> and <code>label</code> to create a custom radio component. You can add{' '}
              <code>.rounded</code> to change it to a rounded radio
            </div>

            <Button
              variant={isRounded ? 'danger' : 'outline-danger'}
              id="js-radio-toggle"
              type="button"
              className="waves-effect mb-g"
              onClick={handleToggleRounded}>
              {isRounded ? 'Change back to default' : 'Change to ROUNDED'}
            </Button>

            <h5 className="frame-heading">Block alignment</h5>
            <div className="frame-wrap">
              <div className="demo demo-radio">
                <FormCheck>
                  <FormCheckInput type="radio" id="defaultUncheckedRadio" name="defaultExampleRadios" className={inputClass} />
                  &nbsp;&nbsp;
                  <FormCheckLabel htmlFor="defaultUncheckedRadio">Unchecked</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <FormCheckInput type="radio" id="defaultCheckedRadio" name="defaultExampleRadios" defaultChecked className={inputClass} />
                  &nbsp;&nbsp;
                  <FormCheckLabel htmlFor="defaultCheckedRadio">Checked</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <FormCheckInput type="radio" className={`active ${inputClass}`} id="defaultUncheckedRadio2" name="defaultExampleRadios" />
                  &nbsp;&nbsp;
                  <FormCheckLabel htmlFor="defaultUncheckedRadio2">Unchecked</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <FormCheckInput type="radio" id="defaultUncheckedDisabledRadio2" name="defaultExampleRadios1" disabled className={inputClass} />
                  &nbsp;&nbsp;
                  <FormCheckLabel htmlFor="defaultUncheckedDisabledRadio2">Disabled</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <FormCheckInput
                    type="radio"
                    id="defaultCheckedDisabledRadio2"
                    name="defaultCheckedDisabledRadio2"
                    defaultChecked
                    disabled
                    className={inputClass}
                  />
                  &nbsp;&nbsp;
                  <FormCheckLabel htmlFor="defaultCheckedDisabledRadio2">Checked &amp; disabled</FormCheckLabel>
                </FormCheck>
              </div>
            </div>

            <h5 className="frame-heading">Inline alignment</h5>
            <div className="frame-wrap demo-radio">
              <FormCheck className="form-check-inline">
                <FormCheckInput type="radio" id="defaultInline1Radio" name="inlineDefaultRadiosExample" className={inputClass} />
                &nbsp;&nbsp;
                <FormCheckLabel htmlFor="defaultInline1Radio">Unchecked</FormCheckLabel>
              </FormCheck>
              <FormCheck className="form-check-inline">
                <FormCheckInput type="radio" id="defaultInline2Radio" name="inlineDefaultRadiosExample" defaultChecked className={inputClass} />
                &nbsp;&nbsp;
                <FormCheckLabel htmlFor="defaultInline2Radio">Checked</FormCheckLabel>
              </FormCheck>
              <FormCheck className="form-check-inline">
                <FormCheckInput type="radio" id="defaultInline4Radio" name="inlineDefaultRadiosExample2" disabled className={inputClass} />
                &nbsp;&nbsp;
                <FormCheckLabel htmlFor="defaultInline4Radio">Disabled</FormCheckLabel>
              </FormCheck>
              <FormCheck className="form-check-inline">
                <FormCheckInput
                  type="radio"
                  id="defaultInline3Radio"
                  name="inlineDefaultRadiosExample2"
                  defaultChecked
                  disabled
                  className={inputClass}
                />
                &nbsp;&nbsp;
                <FormCheckLabel htmlFor="defaultInline3Radio">Checked &amp; disabled</FormCheckLabel>
              </FormCheck>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const SwitchRadioAndCheckbox = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Switch
          <span className="fw-300">
            <i>radio and checkbox</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            A switch has the markup of a custom checkbox but uses <code>.form-switch</code> to render a toggle switch. Switches also support the{' '}
            <code>disabled</code> attribute
          </div>
          <Row>
            <Col xl={6}>
              <h5 className="frame-heading">Switch checkbox</h5>
              <div className="frame-wrap demo">
                <div className="demo">
                  <FormCheck className="form-switch">
                    <FormCheckInput type="checkbox" id="customSwitch1" />
                    &nbsp;&nbsp;
                    <FormCheckLabel>Unchecked</FormCheckLabel>
                  </FormCheck>
                  <FormCheck className="form-switch">
                    <FormCheckInput type="checkbox" id="customSwitch2" defaultChecked />
                    &nbsp;&nbsp;
                    <FormCheckLabel>Checked</FormCheckLabel>
                  </FormCheck>
                  <FormCheck className="form-switch">
                    <FormCheckInput type="checkbox" disabled id="customSwitchd" />
                    &nbsp;&nbsp;
                    <FormCheckLabel>Disabled</FormCheckLabel>
                  </FormCheck>
                  <FormCheck className="form-switch">
                    <FormCheckInput type="checkbox" id="customSwitch3" defaultChecked disabled />
                    &nbsp;&nbsp;
                    <FormCheckLabel>Checked &amp; disabled</FormCheckLabel>
                  </FormCheck>
                </div>
              </div>
            </Col>
            <Col xl={6}>
              <h5 className="frame-heading">Switch Radio</h5>
              <div className="frame-wrap demo">
                <div className="demo">
                  <FormCheck className="form-switch">
                    <FormCheckInput type="radio" id="customSwitch1radio" name="defaultSwitchRadioExample" />
                    &nbsp;&nbsp;
                    <FormCheckLabel>Unchecked</FormCheckLabel>
                  </FormCheck>
                  <FormCheck className="form-switch">
                    <FormCheckInput type="radio" id="customSwitch2radio" defaultChecked name="defaultSwitchRadioExample" />
                    &nbsp;&nbsp;
                    <FormCheckLabel>Checked</FormCheckLabel>
                  </FormCheck>
                  <FormCheck className="form-switch">
                    <FormCheckInput type="radio" disabled id="customSwitchdradio" name="defaultSwitchRadioExample2" />
                    &nbsp;&nbsp;
                    <FormCheckLabel>Disabled</FormCheckLabel>
                  </FormCheck>
                  <FormCheck className="form-switch">
                    <FormCheckInput type="radio" id="customSwitch3radio" defaultChecked disabled name="defaultSwitchRadioExample2" />
                    &nbsp;&nbsp;
                    <FormCheckLabel>Checked &amp; disabled</FormCheckLabel>
                  </FormCheck>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>
  )
}
