import ComponentCard from '@/components/ComponentCard';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row, Spinner } from 'react-bootstrap';
export const metadata = {
  title: 'Spinners'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Spinners'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Bootstrap spinners are animated loading indicators used to show that a process is ongoing, available in various styles and sizes.'} />
        <div className="main-content">
          <div className="info-container">
            CSS "spinners" can be used to show the loading state in your projects. They're built only with HTML and CSS, meaning you don't need any
            JavaScript to create them. You will, however, need some custom JavaScript to toggle their visibility. Their appearance, alignment, and
            sizing can be easily customized with our amazing utility classes.
          </div>

          <Row>
            <Col xl={6}>
              <BorderSpinners />
              <ColorSpinners />
              <AlignmentSpinners />
              <SizesSpinners />
              <ShapeChange />
              <NestedSpinners />
            </Col>
            <Col xl={6}>
              <GrowingSpinners />
              <GrowingSpinnerColors />
              <GrowingSpinnerAlignment />
              <GrowingSpinnerSizes />
              <ShapeShifting />
              <GrowingSpinnerNested />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;
const BorderSpinners = () => {
  return <ComponentCard title={<h2>
          Border
          <span className="fw-300">
            <i>spinner</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Use the border spinners for a lightweight loading indicator</div>
          <Spinner role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    </ComponentCard>;
};
const GrowingSpinnerNested = () => {
  return <ComponentCard title={<h2>
          Growing
          <span className="fw-300">
            <i>spinner nested</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Use spinners within buttons to indicate an action is currently processing or taking place. You may also swap the text out of the spinner
            element and utilize button text as needed.
          </div>
          <div className="demo">
            <button className="btn btn-success btn-icon rounded-circle" type="button" disabled>
              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
              <span className="visually-hidden">Loading...</span>
            </button>
            <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
              <span className="visually-hidden">Loading...</span>
            </button>
            <button className="btn btn-info" type="button" disabled>
              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
              Loading...
            </button>
            <button className="btn btn-danger rounded-pill" type="button" disabled>
              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
              Loading...
            </button>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const ShapeShifting = () => {
  return <ComponentCard title={<h2>
          Shape
          <span className="fw-300">
            <i>shifting</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Change the shape of your growing spinner using border utilities</div>
          <div className="demo-h-spacing">
            <div className="spinner-grow rounded-0 text-primary" style={{
            width: '3rem',
            height: '3rem'
          }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow rounded-0 text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow spinner-grow-sm rounded-0 text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const GrowingSpinnerAlignment = () => {
  return <ComponentCard title={<h2>
          Growing
          <span className="fw-300">
            <i>spinner alignment</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag"></div>
          <h5 className="frame-heading">Flex</h5>
          <div className="frame-wrap">
            <div className="border p-3">
              <div className="d-flex justify-content-center">
                <div className="spinner-grow" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
          <h5 className="frame-heading">Float</h5>
          <div className="frame-wrap">
            <div className="border p-3">
              <div className="d-flex align-items-center">
                <strong>Loading...</strong>
                <div className="spinner-grow ms-auto" role="status" aria-hidden="true" />
              </div>
            </div>
          </div>
          <h5 className="frame-heading">Text align</h5>
          <div className="frame-wrap">
            <div className="border p-3">
              <div className="text-start">
                <div className="spinner-grow" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const GrowingSpinnerSizes = () => {
  return <ComponentCard title={<h2>
          Growing
          <span className="fw-300">
            <i>spinner sizes</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add <code>.spinner-grow-sm</code> to make a smaller spinner that can quickly be used within other components. Or, use custom CSS or inline
            styles to change the dimensions as needed.
          </div>
          <div className="demo-h-spacing">
            <div className="spinner-grow" style={{
            width: '3rem',
            height: '3rem'
          }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow spinner-grow-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const GrowingSpinnerColors = () => {
  return <ComponentCard title={<h2>
          Growing
          <span className="fw-300">
            <i>spinner colors</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Once again, this spinner is built with <code>currentColor</code>, so you can easily change its appearance with{' '}
            <a href="#" target="_blank">
              text color utilities
            </a>
          </div>
          <div className="demo">
            <div className="spinner-grow text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const GrowingSpinners = () => {
  return <ComponentCard title={<h2>
          Growing
          <span className="fw-300">
            <i>spinner</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">If you don't fancy a border spinner, switch to the grow spinner</div>
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const NestedSpinners = () => {
  return <ComponentCard title={<h2>
          Spinner
          <span className="fw-300">
            <i>sizes</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Use spinners within buttons to indicate an action is currently processing or taking place. You may also swap the text out of the spinner
            element and utilize button text as needed.
          </div>
          <div className="demo">
            <button className="btn btn-success btn-icon rounded-circle" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              <span className="visually-hidden">Loading...</span>
            </button>
            <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              <span className="visually-hidden">Loading...</span>
            </button>
            <button className="btn btn-info" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              Loading...
            </button>
            <button className="btn btn-danger rounded-pill" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              Loading...
            </button>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const ShapeChange = () => {
  return <ComponentCard title={<h2>
          Shape
          <span className="fw-300">
            <i>changes</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Change the shape of your spinner using border utilities</div>
          <div className="demo-h-spacing">
            <div className="spinner-border rounded-0 text-primary" style={{
            width: '3rem',
            height: '3rem'
          }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border rounded-0 text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border rounded-0 text-info spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const SizesSpinners = () => {
  return <ComponentCard title={<h2>
          Spinner
          <span className="fw-300">
            <i>sizes</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add <code>.spinner-border-sm</code> to make a smaller spinner that can quickly be used within other components. Or, use custom CSS or
            inline styles to change the dimensions as needed.
          </div>
          <div className="demo-h-spacing">
            <Spinner style={{
            width: '3rem',
            height: '3rem'
          }} role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <Spinner role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <Spinner className=" spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const AlignmentSpinners = () => {
  return <ComponentCard title={<h2>
          Spinner
          <span className="fw-300">
            <i>Alignment</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag"></div>
          <h5 className="frame-heading">Flex</h5>
          <div className="frame-wrap">
            <div className="border p-3">
              <div className="d-flex justify-content-center">
                <Spinner role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </div>
          </div>
          <h5 className="frame-heading">Float</h5>
          <div className="frame-wrap">
            <div className="border p-3">
              <div className="d-flex align-items-center">
                <strong>Loading...</strong>
                <Spinner className="ms-auto" role="status" aria-hidden="true" />
              </div>
            </div>
          </div>
          <h5 className="frame-heading">Text align</h5>
          <div className="frame-wrap">
            <div className="border p-3">
              <div className="text-start">
                <Spinner role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const ColorSpinners = () => {
  return <ComponentCard title={<h2>
          Color
          <span className="fw-300">
            <i>spinners</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            The border spinner uses <code>currentColor</code> for its <code>border-color</code>, meaning you can customize the color with{' '}
            <a href="#" target="_blank">
              text color utilities
            </a>
            . You can use any of our text color utilities on the standard spinner
          </div>
          <div className="demo">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};