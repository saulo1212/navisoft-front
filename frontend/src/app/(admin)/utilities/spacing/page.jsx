import ComponentCard from '@/components/ComponentCard';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
export const metadata = {
  title: 'Spacing'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Spacing'} subTitle1={'Design'} subTitle2={'System Utilities'} subText={'Bootstrap includes a wide range of shorthand responsive margin and padding utility classes to modify an element’s appearance.'} />
        <div className="main-content">
          <div className="info-container">
            <p>
              Assign responsive-friendly <code>margin</code> or <code>padding</code> values to an element or a subset of its sides with shorthand
              classes. Includes support for individual properties, all properties, and vertical and horizontal properties. Classes are built from a
              default Sass map ranging from <code>.25rem</code> to <code>3rem</code>.
            </p>
            <p className="mb-0">
              We have further added quick margin and padding options for by using gutter space variable <code>.m-g</code>, margin bottom gutter{' '}
              <code>.mb-g</code>. Padding gutter can be adding by using <code>.p-g</code> modifier. The <code>*-g</code> will change based on the
              gutter variable.
            </p>
          </div>

          <Row>
            <Col xl={6}>
              <DefaultPanel />
            </Col>
            <Col xl={6}>
              <HorizontalCentering />
              <NegativeMargin />
              <MarginExamples />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;
const DefaultPanel = () => {
  return <ComponentCard title={<h2>
          Default
          <span className="fw-300">
            <i>Panel</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              Spacing utilities that apply to all breakpoints, from <code>xs</code> to <code>xxl</code>, have no breakpoint abbreviation in them. This
              is because those classes are applied from <code>min-width: 0</code> and up, and thus are not bound by a media query. The remaining
              breakpoints, however, do include a breakpoint abbreviation.
            </p>
            <p>
              The classes are named using the format{' '}
              <code>
                {'{'}property{'}'}
                {'{'}sides{'}'}-{'{'}size{'}'}
              </code>{' '}
              for <code>xs</code> and{' '}
              <code>
                {'{'}property{'}'}
                {'{'}sides{'}'}-{'{'}breakpoint{'}'}-{'{'}size{'}'}
              </code>{' '}
              for <code>sm</code>, <code>md</code>, <code>lg</code>, <code>xl</code>, and <code>xxl</code>.
            </p>
          </div>
          <p>
            Where <em>property</em> is one of:
          </p>
          <ul className="list-spaced">
            <li>
              <code>t</code> - for classes that set <code>margin-top</code> or <code>padding-top</code>
            </li>
            <li>
              <code>b</code> - for classes that set <code>margin-bottom</code> or <code>padding-bottom</code>
            </li>
            <li>
              <code>l</code> - for classes that set <code>margin-start</code> or <code>padding-start</code>
            </li>
            <li>
              <code>r</code> - for classes that set <code>margin-end</code> or <code>padding-end</code>
            </li>
            <li>
              <code>x</code> - for classes that set both <code>*-left</code> and <code>*-right</code>
            </li>
            <li>
              <code>y</code> - for classes that set both <code>*-top</code> and <code>*-bottom</code>
            </li>
            <li>
              blank - for classes that set a <code>margin</code> or <code>padding</code> on all 4 sides of the element
            </li>
          </ul>
          <p>
            Where <em>size</em> is one of:
          </p>
          <ul className="list-spaced">
            <li>
              <code>0</code> - for classes that eliminate the <code>margin</code> or <code>padding</code> by setting it to <code>0</code>
            </li>
            <li>
              <code>1</code> - (by default) for classes that set the <code>margin</code> or <code>padding</code> to <code>$spacer * .25</code>
            </li>
            <li>
              <code>2</code> - (by default) for classes that set the <code>margin</code> or <code>padding</code> to <code>$spacer * .5</code>
            </li>
            <li>
              <code>3</code> - (by default) for classes that set the <code>margin</code> or <code>padding</code> to <code>$spacer</code>
            </li>
            <li>
              <code>4</code> - (by default) for classes that set the <code>margin</code> or <code>padding</code> to <code>$spacer * 1.5</code>
            </li>
            <li>
              <code>5</code> - (by default) for classes that set the <code>margin</code> or <code>padding</code> to <code>$spacer * 2</code>
            </li>
            <li>
              <code>auto</code> - for classes that set the <code>margin</code> to auto
            </li>
          </ul>
          <p>Example padding:</p>
          <div className="demo">
            <div className="p-2 p-sm-3 p-md-4 p-lg-5 p-xl-6 p-xxl-7 bg-danger-50 pattern-2">
              <div className="bg-success-600 pattern-1 ps-2">.p-2 .p-sm-3 .p-md-4 .p-lg-5 .p-xl-6 .p-xxl-7</div>
            </div>
            <div className="p-1 p-sm-2 p-md-3 p-lg-4 p-xl-5 p-xxl-6 bg-danger-50 pattern-2">
              <div className="bg-success-600 pattern-1 ps-2">.p-1 .p-sm-2 .p-md-3 .p-lg-4 .p-xl-5 .p-xxl-6</div>
            </div>
            <div className="p-0 p-sm-1 p-md-2 p-lg-3 p-xl-4 p-xxl-5 bg-danger-50 pattern-2">
              <div className="bg-success-600 pattern-1 ps-2">.p-0 .p-sm-1 .p-md-2 .p-lg-3 .p-xl-4 .p-xxl-5</div>
            </div>
            <div className="p-3 p-sm-0 p-md-1 p-lg-2 p-xl-3 p-xxl-4 bg-danger-50 pattern-2">
              <div className="bg-success-600 pattern-1 ps-2">.p-3 .p-sm-0 .p-md-1 .p-lg-2 .p-xl-3 .p-xxl-4</div>
            </div>
            <div className="p-4 p-sm-4 p-md-0 p-lg-1 p-xl-2 p-xxl-3 bg-danger-50 pattern-2">
              <div className="bg-success-600 pattern-1 ps-2">.p-4 .p-sm-4 .p-md-0 .p-lg-1 .p-xl-2 .p-xxl-3</div>
            </div>
            <div className="p-5 p-sm-6 p-md-3 p-lg-0 p-xl-1 p-xxl-2 bg-danger-50 pattern-2">
              <div className="bg-success-600 pattern-1 ps-2">.p-5 .p-sm-6 .p-md-3 .p-lg-0 .p-xl-1 .p-xxl-2</div>
            </div>
            <div className="p-6 p-sm-5 p-md-5 p-lg-6 p-xl-0 p-xxl-1 bg-danger-50 pattern-2">
              <div className="bg-success-600 pattern-1 ps-2">.p-6 .p-sm-5 .p-md-5 .p-lg-6 .p-xl-0 .p-xxl-1</div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const HorizontalCentering = () => {
  return <ComponentCard title={<h2>
          Horizontal
          <span className="fw-300">
            <i>centering</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              Additionally, Bootstrap also includes an <code>.mx-auto</code> class for horizontally centering fixed-width block level content—that is,
              content that has <code>display: block</code> and a <code>width</code> set—by setting the horizontal margins to <code>auto</code>.
            </p>
          </div>
          <div className="w-100 bg-danger-50 pattern-2 p-3">
            <div className="mx-auto p-2 bg-info-500 pattern-1 shadow" style={{
            width: 200
          }}>
              Centered element
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const NegativeMargin = () => {
  return <ComponentCard title={<h2>
          Negative
          <span className="fw-300">
            <i>margin</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            The syntax is nearly the same as the default, positive margin utilities, but with the addition of <code>n</code> before the requested
            size.
          </div>
          <p>
            Here’s an example of customizing the Bootstrap grid at the medium (<code>md</code>) breakpoint and above. We’ve increased the{' '}
            <code>.col</code> padding with <code>.px-md-5</code> and then counteracted that with <code>.mx-md-n5</code> on the parent{' '}
            <code>.row</code>.
          </p>
          <Row className="mx-md-n5">
            <Col className="px-md-5">
              <div className="p-3 border bg-light">Custom column padding</div>
            </Col>
            <Col className="px-md-5">
              <div className="p-3 border bg-light">Custom column padding</div>
            </Col>
          </Row>
        </div>
      </div>
    </ComponentCard>;
};
const MarginExamples = () => {
  return <ComponentCard title={<h2>
          Margin
          <span className="fw-300">
            <i>examples</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Margin specific viewports example
            <Row className="mt-1">
              <Col xs={12} sm={6} md={6} lg={2} className="col-lg-2">
                *-xs-* &lt;576px
              </Col>
              <Col xs={12} sm={6} md={6} lg={2} className="col-lg-2">
                *-sm-* ≥576px
              </Col>
              <Col xs={12} sm={6} md={6} lg={2} className="col-lg-2">
                *-md-* ≥768px
              </Col>
              <Col xs={12} sm={6} md={6} lg={2} className="col-lg-2">
                *-lg-* ≥992px
              </Col>
              <Col xs={12} sm={6} md={6} lg={2} className="col-lg-2">
                *-xl-* ≥1200px
              </Col>
              <Col xs={12} sm={6} md={6} lg={2} className="col-lg-2">
                *-xxl-* ≥1400px
              </Col>
            </Row>
          </div>
          <div className="demo">
            <Row className="bg-danger-50 pattern-2">
              <div className="col bg-info text-white ms-1 ms-sm-2 ms-md-3 ms-lg-4 ms-xl-5 ms-xxl-6 pattern-1">
                .ms-1 .ms-sm-2 .ms-md-3 .ms-lg-4 .ms-xl-5 .ms-xxl-6
              </div>
            </Row>
            <Row className="bg-danger-50 pattern-2">
              <div className="col bg-info text-white mx-xs-1 mx-sm-2 mx-md-3 mx-lg-4 mx-xl-5 mx-xxl-6 pattern-1">
                .mx-1 .mx-sm-2 .mx-md-3 .mx-lg-4 .mx-xl-5 .mx-xxl-6
              </div>
            </Row>
            <Row className="bg-danger-50 pattern-2">
              <div className="col bg-info text-white my-1 my-sm-2 my-md-3 my-lg-4 my-xl-5 my-xxl-6 pattern-1">
                .my-1 .my-sm-2 .my-md-3 .my-lg-4 .my-xl-5 .my-xxl-6
              </div>
            </Row>
            <Row className="bg-danger-50 pattern-2">
              <div className="col bg-info text-white m-1 m-sm-2 m-md-3 m-lg-4 m-xl-5 m-xxl-6 pattern-1">
                .m-1 .m-sm-2 .m-md-3 .m-lg-4 .m-xl-5 .m-xxl-6
              </div>
            </Row>
          </div>
        </div>
      </div>
    </ComponentCard>;
};