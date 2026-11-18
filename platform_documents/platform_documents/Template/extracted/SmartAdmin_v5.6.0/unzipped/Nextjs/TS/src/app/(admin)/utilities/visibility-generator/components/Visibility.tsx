import { Button, FormCheck } from 'react-bootstrap'
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput'
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel'

type VisiblityProps = {
  visibility: string
  onChange: (value: string) => void
}

export const VisibilityMode = ({ visibility, onChange }: VisiblityProps) => {
  return (
    <div className="option-card">
      <div className="option-title">Visibility Mode</div>
      <div className="form-section">
        <FormCheck className="form-check-inline">
          <FormCheckInput type="radio" id="visibilityHidden" name="visibilityMode" value="hidden" checked={visibility === 'hidden'}
            onChange={(e) => onChange(e.target.value)} />
          &nbsp;
          <FormCheckLabel htmlFor="visibilityHidden">Hidden</FormCheckLabel>
        </FormCheck>
        <FormCheck className="form-check-inline">
          <FormCheckInput type="radio" id="visibilityVisible" name="visibilityMode" value="visible" checked={visibility === 'visible'}
            onChange={(e) => onChange(e.target.value)} />
          <FormCheckLabel htmlFor="visibilityVisible">Visible</FormCheckLabel>
        </FormCheck>
      </div>
    </div>
  )
}

type DisplayTypeProps = {
  visibility: string
}

export const DisplayType = ({ visibility }: DisplayTypeProps) => {
  return (
    <div className="option-card" id="displayTypeSection" style={{ display: visibility === 'visible' ? 'block' : 'none' }}>
      <div className="option-title">Display Type</div>
      <div className="form-section">
        <FormCheck className="form-check-inline">
          <FormCheckInput type="radio" id="block" name="displayType" defaultValue="block" defaultChecked />
          <FormCheckLabel htmlFor="block">Block</FormCheckLabel>
        </FormCheck>
        <FormCheck className="form-check form-check-inline">
          <FormCheckInput type="radio" id="flex" name="displayType" defaultValue="flex" />
          <FormCheckLabel htmlFor="flex">Flex</FormCheckLabel>
        </FormCheck>
        <FormCheck className="form-check form-check-inline">
          <FormCheckInput type="radio" id="inline" name="displayType" defaultValue="inline" />
          <FormCheckLabel htmlFor="inline">Inline</FormCheckLabel>
        </FormCheck>
      </div>
    </div>
  )
}

export const Breakpoints = () => {
  return (
    <div className="option-card">
      <div className="option-title">
        <span>Breakpoints</span>
        <small className="float-end text-muted">
          Current: <span id="currentBreakpoint">...</span>
        </small>
      </div>
      <div className="mb-2">
        <FormCheck>
          <FormCheckInput type="checkbox" id="all" defaultValue="all" />
          <FormCheckLabel className="fw-bold" htmlFor="all">
            All Breakpoints
          </FormCheckLabel>
        </FormCheck>
      </div>
      <div className="bp-grid">
        <FormCheck>
          <FormCheckInput type="checkbox" className="breakpoint-checkbox" id="xs" defaultValue="xs" />
          <FormCheckLabel htmlFor="xs">XS (≤576px)</FormCheckLabel>
        </FormCheck>
        <div className="form-check">
          <input type="checkbox" className="form-check-input breakpoint-checkbox" id="sm" defaultValue="sm" />
          <label className="form-check-label" htmlFor="sm">
            SM (≥576px)
          </label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input breakpoint-checkbox" id="md" defaultValue="md" />
          <label className="form-check-label" htmlFor="md">
            MD (≥768px)
          </label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input breakpoint-checkbox" id="lg" defaultValue="lg" />
          <label className="form-check-label" htmlFor="lg">
            LG (≥992px)
          </label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input breakpoint-checkbox" id="xl" defaultValue="xl" />
          <label className="form-check-label" htmlFor="xl">
            XL (≥1200px)
          </label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input breakpoint-checkbox" id="xxl" defaultValue="xxl" />
          <label className="form-check-label" htmlFor="xxl">
            XXL (≥1400px)
          </label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input breakpoint-checkbox" id="xxxl" defaultValue="xxxl" />
          <label className="form-check-label" htmlFor="xxxl">
            XXXL (≥1600px)
          </label>
        </div>
      </div>
      <Button variant="primary" id="generateBtn" className="waves-effect w-100 mt-3">
        <i className="fal fa-code me-1" /> Generate Classes
      </Button>
    </div>
  )
}

export const GeneratedClasses = () => {
  return (
    <div className="output-section" id="output">
      <h5 className="mb-3 fw-bold">
        Generated Classes <small className="text-muted">(Copy these)</small>
      </h5>
      <div className="class-list position-relative mb-3" id="classOutput">
        <span className="fst-italic text-muted">Select options and click "Generate Classes" to see the result.</span>
        <button id="copyClasses" type="button" className="copy-button d-none">
          <i className="fal fa-copy me-1" /> Copy
        </button>
      </div>
      <div className="app-fob-showcase-text" data-prefix="Preview">
        <div id="breakpointIndicators" className="mb-2">
          <span className="breakpoint-indicator" data-bp="xs">
            xs
          </span>
          <span className="breakpoint-indicator" data-bp="sm">
            sm
          </span>
          <span className="breakpoint-indicator" data-bp="md">
            md
          </span>
          <span className="breakpoint-indicator" data-bp="lg">
            lg
          </span>
          <span className="breakpoint-indicator" data-bp="xl">
            xl
          </span>
          <span className="breakpoint-indicator" data-bp="xxl">
            xxl
          </span>
        </div>
        <div id="testDiv">
          <div>This element will update based on your selections</div>
        </div>
      </div>
      <div className="mt-4">
        <a className="btn btn-link btn-sm p-0" data-bs-toggle="collapse" href="#cssEquivalent" role="button" aria-expanded="false">
          <i className="fal fa-code me-1" /> Show CSS Equivalent
        </a>
        <div className="collapse mt-2" id="cssEquivalent">
          <div className="position-relative">
            <div className="css-output" id="cssOutput">
              <span className="fst-italic text-muted">/* CSS will appear here */</span>
            </div>
            <button id="copyCSS" type="button" className="copy-button d-none">
              <i className="fal fa-copy me-1" /> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
