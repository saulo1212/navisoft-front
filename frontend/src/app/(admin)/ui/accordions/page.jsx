import ComponentCard from '@/components/ComponentCard';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { basePath } from '@/helpers';
import Link from 'next/link';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Row } from 'react-bootstrap';
import { NestedAccordion } from './components/FAQ';
export const metadata = {
  title: 'Accordion'
};
const Page = () => {
  return <>
      <div className="content-wrapper">
        <PageBreadcrumb title={'Accordions'} subTitle1={'Design'} subTitle2={'UI Components'} subText={'Boost user engagement and streamline content with a sleek, collapsible component that organizes information seamlessly with smooth animations and minimal code.'} />
        <div className="main-content">
          <div className="info-container">
            <p>
              Use the <code>.accordion</code> component to provide a way to toggle the visibility of content. Be sure to add
              <code>aria-expanded</code> to the control element. This attribute explicitly conveys the current state of the collapsible element tied
              to the control to screen readers and similar assistive technologies.
            </p>
            <p>
              If the collapsible element is closed by default, the attribute on the control element should have a value of
              <code>aria-expanded="false"</code>. If you've set the collapsible element to be open by default using the <code>show</code> class, set
              <code>aria-expanded="true"</code> on the control instead.
            </p>
            <p className="mb-0">
              Learn more about this plugin on Bootstrap's
              <Link href="https://getbootstrap.com/docs/5.3/components/collapse/#accordion-example" target="_blank">
                official documentation
              </Link>
              .
            </p>
          </div>

          <Row>
            <Col xl={6}>
              <DefaultAccordion />
              <AccordionOutline />
              <AccordionCleanLayout />
            </Col>
            <Col xl={6}>
              <AccordionActiveStateIcons />
              <HoverAccordion />
              <NestedAccordion />
            </Col>
          </Row>
        </div>
      </div>
    </>;
};
export default Page;
const DefaultAccordion = () => {
  return <>
      <ComponentCard title={<h2>
            Default
            <span className="fw-light">
              <i>Accordion</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Just add <code>data-bs-toggle="collapse"</code> and a <code>data-bs-target</code> to the element to automatically assign control of one
              or more collapsible elements. The <code>data-bs-target</code> attribute accepts a CSS selector to apply the collapse to. Be sure to add
              the class <code>collapse</code> to the collapsible element. If you'd like it to default open, add the additional class <code>show</code>
              .
              <br />
              <br />
              To add accordion-like group management to a collapsible area, add the data attribute <code>data-parent="#selector"</code>. Refer to the
              demo to see this in action.
            </div>
            <Accordion defaultActiveKey={'1'} id="bs5_demo_accordion">
              <AccordionItem eventKey="1">
                <AccordionHeader as={'h2'}>Collapsible Group Item #1</AccordionHeader>
                <AccordionBody>
                  <p>
                    Accordions work well inside <strong>forms and modals</strong>, helping break down complex inputs into manageable steps.
                  </p>
                  <p className="mb-0">
                    Instead of overwhelming users with long forms, collapsible sections allow for a more
                    <strong>progressive disclosure approach.</strong>
                  </p>
                </AccordionBody>
              </AccordionItem>
              <AccordionItem eventKey="2">
                <AccordionHeader as={'h2'}>Collapsible Group Item #2</AccordionHeader>
                <AccordionBody>
                  For example, sections like <strong>Billing Details</strong>, <strong>Shipping Address</strong>, and <strong>Payment Method</strong>
                  can be toggled individually.
                </AccordionBody>
              </AccordionItem>
              <AccordionItem eventKey="3">
                <AccordionHeader as={'h2'}>Collapsible Group Item #3</AccordionHeader>
                <AccordionBody>
                  This improves usability, reduces scrolling, and keeps the <strong>UI clean and focused.</strong>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </ComponentCard>
    </>;
};
const AccordionOutline = () => {
  return <ComponentCard title={<h2>
          Accordion
          <span className="fw-light">
            <i>Outline</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Change the style of your accordion by adding class <code>.accordion-outline</code> to <code>.accordion</code>
          </div>
          <Accordion defaultActiveKey={'1'} className="accordion-outline" id="js_demo_accordion-3">
            <AccordionItem eventKey="1">
              <AccordionHeader as={'h2'} className="custom-collapse">
                <i className="sa sa-book-open width-2 fs-xl" />
                Medical Records
                <span className="ms-auto">
                  <span className="collapsed-reveal">
                    <svg className="sa-icon">
                      <use href={`${basePath}/icons/sprite.svg#minus-square`} />
                    </svg>
                  </span>
                  <span className="collapsed-hidden">
                    <svg className="sa-icon">
                      <use href={`${basePath}/icons/sprite.svg#plus-square`} />
                    </svg>
                  </span>
                </span>
              </AccordionHeader>

              <AccordionBody>
                <p>The Bootstrap Accordion component allows users to toggle between sections of content in a collapsible manner.</p>
                <p className="mb-0">
                  Each accordion item contains a header and a body. The header triggers the collapse behavior, while the body contains the actual
                  content.
                </p>
              </AccordionBody>
            </AccordionItem>
            <AccordionItem eventKey="2">
              <AccordionHeader as={'h2'} className="custom-collapse">
                <i className="sa sa-camcorder width-2 fs-xl" />
                Video logs
                <span className="ms-auto">
                  <span className="collapsed-reveal">
                    <svg className="sa-icon">
                      <use href={`${basePath}/icons/sprite.svg#minus-square`} />
                    </svg>
                  </span>
                  <span className="collapsed-hidden">
                    <svg className="sa-icon">
                      <use href={`${basePath}/icons/sprite.svg#plus-square`} />
                    </svg>
                  </span>
                </span>
              </AccordionHeader>
              <AccordionBody>
                Developers can use Bootstrap’s JavaScript API to control accordion behavior dynamically. Accessibility is also considered, with proper
                ARIA attributes ensuring screen reader compatibility.
              </AccordionBody>
            </AccordionItem>
            <AccordionItem eventKey="3">
              <AccordionHeader as={'h3'} className="custom-collapse">
                <i className="sa sa-briefcase width-2 fs-xl" />
                Medical history
                <span className="ms-auto">
                  <span className="collapsed-reveal">
                    <svg className="sa-icon">
                      <use href={`${basePath}/icons/sprite.svg#minus-square`} />
                    </svg>
                  </span>
                  <span className="collapsed-hidden">
                    <svg className="sa-icon">
                      <use href={`${basePath}/icons/sprite.svg#plus-square`} />
                    </svg>
                  </span>
                </span>
              </AccordionHeader>

              <AccordionBody>
                Each accordion consists of a parent container with multiple accordion items. Each item has a header that users can click to expand or
                collapse the content inside.
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </ComponentCard>;
};
const AccordionCleanLayout = () => {
  return <ComponentCard title={<h2>
          Accordion
          <span className="fw-light">
            <i>Clean Layout</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Give your accordion a clean look by adding class <code>.accordion-clean</code> to <code>.accordion</code>
          </div>
          <Accordion defaultActiveKey={'1'} className="accordion-clean" id="js_demo_accordion-1">
            <AccordionItem eventKey="1">
              <AccordionHeader className="custom-collapse">
                <span className="me-2">
                  <span className="collapsed-reveal">
                    <i className="sa sa-arrow-up text-danger fs-xxl me-2" />
                  </span>
                  <span className="collapsed-hidden">
                    <i className="sa sa-arrow-down text-success fs-xxl me-2" />
                  </span>
                </span>
                Application settings
              </AccordionHeader>
              <AccordionBody>
                By default, Bootstrap uses the <code>collapse.js</code> plugin to manage this behavior, ensuring smooth transitions and accessibility.
                The accordion structure supports <strong>custom styles</strong>, such as different background colors, border-radius adjustments, and
                shadow effects.
              </AccordionBody>
            </AccordionItem>
            <AccordionItem eventKey="2">
              <AccordionHeader className="custom-collapse">
                <span className="me-2">
                  <span className="collapsed-reveal">
                    <i className="sa sa-arrow-up text-danger fs-xxl me-2" />
                  </span>
                  <span className="collapsed-hidden">
                    <i className="sa sa-arrow-down text-success fs-xxl me-2" />
                  </span>
                </span>
                User management
              </AccordionHeader>
              <AccordionBody>
                You can also integrate <strong>strong icons or animations</strong> to indicate when a section is opened or closed, improving user
                experience.
              </AccordionBody>
            </AccordionItem>
            <AccordionItem eventKey="3">
              <AccordionHeader className="custom-collapse">
                <span className="me-2">
                  <span className="collapsed-reveal">
                    <i className="sa sa-arrow-up text-danger fs-xxl me-2" />
                  </span>
                  <span className="collapsed-hidden">
                    <i className="sa sa-arrow-down text-success fs-xxl me-2" />
                  </span>
                </span>
                User groups
              </AccordionHeader>
              <AccordionBody>
                However, developers can tweak the settings to allow multiple sections to stay open simultaneously using
                <code>data-bs-parent="false"</code>.
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </ComponentCard>;
};
const AccordionActiveStateIcons = () => {
  return <ComponentCard title={<h2>
          Accordion
          <span className="fw-light">
            <i>active state icons</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add some navigation to a card's header (or block) with built-in nav components. You can reveal or hide elements during
            <code>.collapse</code> state using the classes <code>.collapsed-reveal</code> and <code>.collapsed-hidden</code>
            <br />
            <br />
            <strong>
              Make sure the <code>.collapsed-*</code> classes are inside the <code>data-toggle="collapse"</code> element or adjacent to it
            </strong>
          </div>
          <div className="frame-wrap w-100">
            <Accordion defaultActiveKey={'1'} id="js_demo_accordion-4">
              <AccordionItem eventKey="1">
                <AccordionHeader className="custom-collapse">
                  Email marketing
                  <span className="ms-auto">
                    <span className="collapsed-reveal">
                      <i className="sa sa-envelope-open text-danger fs-xl" />
                    </span>
                    <span className="collapsed-hidden">
                      <i className="sa sa-envelope text-success fs-xl" />
                    </span>
                  </span>
                </AccordionHeader>
                <AccordionBody>
                  In addition to its built-in styling, the accordion can be controlled programmatically using Bootstrap’s
                  <strong>JavaScript API</strong>. Functions like <code>.collapse('toggle')</code> allow developers to open, close, or update
                  accordion elements dynamically via JavaScript.
                </AccordionBody>
              </AccordionItem>
              <AccordionItem eventKey="2">
                <AccordionHeader className="custom-collapse">
                  Online compaign
                  <span className="ms-auto">
                    <span className="collapsed-reveal">
                      <i className="sa sa-envelope-open text-danger fs-xl" />
                    </span>
                    <span className="collapsed-hidden">
                      <i className="sa sa-envelope text-success fs-xl" />
                    </span>
                  </span>
                </AccordionHeader>
                <AccordionBody>
                  For accessibility, Bootstrap includes <strong>strong ARIA attributes</strong> such as <code>aria-expanded</code> and
                  <code>aria-controls</code>, ensuring screen readers can navigate the accordion efficiently.
                </AccordionBody>
              </AccordionItem>
              <AccordionItem eventKey="3">
                <AccordionHeader className="custom-collapse">
                  Electronic Data Management
                  <span className="ms-auto">
                    <span className="collapsed-reveal">
                      <i className="sa sa-envelope-open text-danger fs-xl" />
                    </span>
                    <span className="collapsed-hidden">
                      <i className="sa sa-envelope text-success fs-xl" />
                    </span>
                  </span>
                </AccordionHeader>
                <AccordionBody>
                  This makes it an excellent choice for creating responsive, <strong> mobile-friendly interfaces</strong> with a clean and structured
                  layout.
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
const HoverAccordion = () => {
  return <ComponentCard title={<h2>
          Accordion
          <span className="fw-light">
            <i>hover</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Adding a hover effect adds nice element to your accordion. Achieve this by adding class <code>.accordion-hover</code> to
            <code>.accordion</code>
          </div>
          <Accordion defaultActiveKey={'1'} className="accordion-hover" id="js_demo_accordion-5">
            <AccordionItem eventKey="1">
              <AccordionHeader>
                <i className="sa sa-calendar-fine width-2 me-2 fs-xxl" />
                Report settings
              </AccordionHeader>
              <AccordionBody>
                <p>
                  Bootstrap Accordion allows extensive customization using CSS variables and utility classes. You can modify backgrounds, borders,
                  typography, and spacing to match your website’s design system.
                </p>
                <p className="mb-0">
                  For example, applying <code>bg-primary text-white</code> to an accordion header gives it a bold, standout appearance. Additionally,
                  you can tweak <code>data-bs-theme="dark"</code> to create a sleek, modern dark mode version.
                </p>
              </AccordionBody>
            </AccordionItem>
            <AccordionItem eventKey="2">
              <AccordionHeader>
                <i className="sa sa-layers width-2 fs-xxl me-2" />
                Merge reports
              </AccordionHeader>
              <AccordionBody>
                <p>
                  Icons can be added to accordion headers to <strong>indicate expansion and collapse actions</strong>. Bootstrap provides built-in
                  icons from Bootstrap Icons, Font Awesome, or custom SVGs for this purpose.
                </p>
                <p className="mb-0">
                  For instance, using <code>bi-chevron-down</code> and toggling classes dynamically can enhance user interaction. These visual
                  indicators improve clarity and provide a <strong>better UX for touch-based navigation</strong>.
                </p>
              </AccordionBody>
            </AccordionItem>
            <AccordionItem eventKey="3">
              <AccordionHeader>
                <i className="sa sa-cloud-upload width-2 fs-xxl me-2" />
                Backup reports
              </AccordionHeader>
              <AccordionBody>
                <p>
                  Placing an accordion inside a Bootstrap Card can enhance the structure and readability of content. This combination is often used
                  for pricing tables, user profiles, or expandable content sections.
                </p>
                if you feel like adding any songs to this then add them
                <p className="mb-0">
                  Cards provide additional padding, shadows, and borders, making the accordion feel more polished and refined. Applying
                  <code>card-header</code> styles to the accordion title further integrates the two seamlessly.
                </p>
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </ComponentCard>;
};