'use client'
import ComponentCard from '@/components/ComponentCard'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Card, Col, Collapse, Row } from 'react-bootstrap'
import { useToggle } from 'usehooks-ts'

export const BasicExample = () => {
  const [isTrue, toggle] = useToggle()

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
          <div className="panel-tag">The most basic example of cards with enforced width</div>
          <p>Click the buttons below to show or hide elements using class changes:</p>
          <ul className="list-spaced mt-3">
            <li>
              <code>.collapse</code> hides content
            </li>
            <li>
              <code>.collapsing</code> is applied during transitions
            </li>
            <li>
              <code>.collapse.show</code> reveals content
            </li>
          </ul>
          <p>
            You can use a link with the <code>href</code> attribute or a button with the <code>data-bs-target</code> attribute. In both cases,{' '}
            <code>data-bs-toggle="collapse"</code> is required.
          </p>
          <div className="frame-wrap mt-3 mb-0 w-100">
            <p className="demo">
              <Button variant="primary" onClick={toggle}>
                Link with href
              </Button>
              <Button variant="primary" onClick={toggle}>
                Button with data-target
              </Button>
            </p>
            <Collapse in={isTrue}>
              <div>
                <Card className="card-body">
                  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft
                  beer labore wes anderson cred nesciunt sapiente ea proident.
                </Card>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const MultipleTargets = () => {
  const [isOpenFirst, toggleFirst] = useToggle(false)
  const [isOpenSecond, toggleSecond] = useToggle(false)
  const toggleBoth = () => {
    toggleFirst()
    toggleSecond()
  }
  return (
    <ComponentCard
      title={
        <h2>
          Multiple
          <span className="fw-300">
            <i>Targets</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              A <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code> can toggle multiple elements by referencing them with a selector in its{' '}
              <code>href</code> or <code>data-bs-target</code> attribute. Multiple <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code> elements can
              control the same element if they each reference it with <code>href</code> or <code>data-bs-target</code>.
            </p>
          </div>
          <div className="frame-wrap mb-0 w-100">
            <p className="demo">
              <Button variant="primary" onClick={toggleFirst}>
                Toggle first element
              </Button>
              &nbsp;
              <Button variant="primary" onClick={toggleSecond}>
                Toggle second element
              </Button>
              &nbsp;
              <Button variant="primary" onClick={toggleBoth}>
                Toggle both elements
              </Button>
            </p>
            <Row>
              <Col>
                <Collapse in={isOpenFirst} className="multi-collapse">
                  <div>
                    <Card className="card-body">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica,
                      craft beer labore wes anderson cred nesciunt sapiente ea proident.
                    </Card>
                  </div>
                </Collapse>
              </Col>
              <Col>
                <Collapse in={isOpenSecond} className="multi-collapse">
                  <div>
                    <Card className="card-body">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica,
                      craft beer labore wes anderson cred nesciunt sapiente ea proident.
                    </Card>
                  </div>
                </Collapse>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const AccordionExample = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Accordion
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
              Add navigation to a card’s header (or body) using Bootstrap's built-in nav components. You can show or hide elements when a{' '}
              <code>.collapse</code> state changes using the <code>.collapse-reveal</code> and <code>.collapse-hidden</code> classes.
            </p>
            <p>
              <strong>
                Ensure that the <code>.collapse-*</code> classes are placed inside the element with <code>data-bs-toggle="collapse"</code> or adjacent
                to it for proper functionality.
              </strong>
            </p>
          </div>
          <div className="frame-wrap w-100">
            <Accordion defaultActiveKey={'1'} id="accordionExample">
              <AccordionItem eventKey="1">
                <AccordionHeader as={'h2'} id="headingOne">
                  Collapsible Group Item #1
                  <span className="ms-auto">
                    <span className="collapsed-reveal">
                      <i className="sa sa-minus-circle text-danger" />
                    </span>
                    <span className="collapsed-hidden">
                      <i className="sa sa-plus-circle text-success" />
                    </span>
                  </span>
                </AccordionHeader>
                <AccordionBody>
                  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                  cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on
                  it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                  nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
                  synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </AccordionBody>
              </AccordionItem>
              <AccordionItem eventKey="2">
                <AccordionHeader as={'h2'} id="headingTwo">
                  Collapsible Group Item #2
                  <span className="ms-auto">
                    <span className="collapsed-reveal">
                      <i className="sa sa-minus-circle text-danger" />
                    </span>
                    <span className="collapsed-hidden">
                      <i className="sa sa-plus-circle text-success" />
                    </span>
                  </span>
                </AccordionHeader>
                <AccordionBody>
                  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                  cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on
                  it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                  nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
                  synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </AccordionBody>
              </AccordionItem>
              <AccordionItem eventKey="3">
                <AccordionHeader as={'h2'} id="headingThree">
                  Collapsible Group Item #3
                  <span className="ms-auto">
                    <span className="collapsed-reveal">
                      <i className="sa sa-minus-circle text-danger" />
                    </span>
                    <span className="collapsed-hidden">
                      <i className="sa sa-plus-circle text-success" />
                    </span>
                  </span>
                </AccordionHeader>
                <AccordionBody>
                  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                  cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on
                  it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                  nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
                  synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </AccordionBody>
              </AccordionItem>
              <AccordionItem eventKey="4">
                <AccordionHeader as={'h2'} id="headingFour">
                  Collapsible Group Item #4
                  <span className="ms-auto">
                    <span className="collapsed-reveal">
                      <i className="sa sa-minus-circle text-danger" />
                    </span>
                    <span className="collapsed-hidden">
                      <i className="sa sa-plus-circle text-success" />
                    </span>
                  </span>
                </AccordionHeader>
                <AccordionBody>
                  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                  cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on
                  it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                  nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
                  synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
