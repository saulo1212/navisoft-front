'use client';

import adimin from '@/assets/img/demo/avatars/avatar-admin.png';
import avatar1 from '@/assets/img/demo/avatars/avatar-j.png';
import ComponentCard from '@/components/ComponentCard';
import Image from 'next/image';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Alert } from 'react-bootstrap';
export const NestedAccordion = () => {
  return <ComponentCard title={<h2>
          Nested
          <span className="fw-light">
            <i>accordions</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <strong>Caution!</strong> Nested accordions will inherit the properties of its parent. In the example below we use the default accordion
            for parent and a different style for children.
          </div>

          <Accordion defaultActiveKey="0" id="js_demo_accordion-6">
            <AccordionItem eventKey="0">
              <AccordionHeader>
                <div className="d-flex flex-row align-items-center">
                  <span className="me-2">
                    <Image src={adimin} className="rounded-circle profile-image" alt="Sunn A." />
                  </span>
                  <div className="info-card-text">
                    <div className="text-truncate text-truncate-lg">Sunny A.</div>
                    <span className="text-truncate text-truncate-md fw-300">sunnya@getwebora.com</span>
                  </div>
                </div>
              </AccordionHeader>
              <AccordionBody>
                <Accordion defaultActiveKey="0" id="js_demo_accordion-7">
                  <AccordionItem eventKey="0">
                    <AccordionHeader className="custom-collapse bg-success-600 text-white">
                      Bloodworks
                      <span className="ms-auto">
                        <span className="collapsed-reveal">
                          <i className="sa sa-arrow-up fs-xl" />
                        </span>
                        <span className="collapsed-hidden">
                          <i className="sa sa-arrow-down fs-xl" />
                        </span>
                      </span>
                    </AccordionHeader>
                    <AccordionBody className="bg-success-50 p-3">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                      cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                    </AccordionBody>
                  </AccordionItem>

                  <AccordionItem eventKey="1">
                    <AccordionHeader className="custom-collapse bg-warning-500 text-white">
                      Xray reports
                      <span className="ms-auto">
                        <span className="collapsed-reveal">
                          <i className="sa sa-arrow-up fs-xl" />
                        </span>
                        <span className="collapsed-hidden">
                          <i className="sa sa-arrow-down fs-xl" />
                        </span>
                      </span>
                    </AccordionHeader>
                    <AccordionBody className="bg-warning-50 p-3">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                      cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                    </AccordionBody>
                  </AccordionItem>

                  <AccordionItem eventKey="2">
                    <AccordionHeader className="custom-collapse bg-info-700 text-white ">
                      ECG
                      <span className="ms-auto">
                        <span className="collapsed-reveal">
                          <i className="sa sa-arrow-up fs-xl" />
                        </span>
                        <span className="collapsed-hidden">
                          <i className="sa sa-arrow-down fs-xl" />
                        </span>
                      </span>
                    </AccordionHeader>
                    <AccordionBody className="bg-info-50 p-3">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                      cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                    </AccordionBody>
                  </AccordionItem>
                </Accordion>
              </AccordionBody>
            </AccordionItem>

            <AccordionItem eventKey="1">
              <AccordionHeader>
                <div className="d-flex flex-row align-items-center">
                  <span className="me-2">
                    <Image src={avatar1} className="rounded-circle profile-image" alt="Jessica Milano" />
                  </span>
                  <div className="info-card-text">
                    <div className="text-truncate text-truncate-lg">Jessica Milano</div>
                    <span className="text-truncate text-truncate-md">jmilano@getwebora.com</span>
                  </div>
                </div>
              </AccordionHeader>
              <AccordionBody>
                <Alert variant="danger" className="mb-0">
                  <strong>Oops!</strong> Looks like there are no reports available for this user
                </Alert>
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </ComponentCard>;
};