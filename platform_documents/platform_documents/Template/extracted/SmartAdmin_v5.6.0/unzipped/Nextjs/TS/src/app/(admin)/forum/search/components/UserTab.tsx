import avatarA from '@/assets/img/demo/avatars/avatar-a.png'
import avatarB from '@/assets/img/demo/avatars/avatar-b.png'
import avatarC from '@/assets/img/demo/avatars/avatar-c.png'
import avatarD from '@/assets/img/demo/avatars/avatar-d.png'
import avatarE from '@/assets/img/demo/avatars/avatar-e.png'
import avatarF from '@/assets/img/demo/avatars/avatar-f.png'
import avatarG from '@/assets/img/demo/avatars/avatar-g.png'
import avatarH from '@/assets/img/demo/avatars/avatar-h.png'
import Link from 'next/link'
import { Card, CardBody, Col, DropdownItem, DropdownMenu, Row } from 'react-bootstrap'

const UserTab = () => {
  return (
    <>
      <Row id="js-contacts">
        <Col xl={4}>
          <Card
            id="c_1"
            className="border shadow-0 mb-g shadow-sm-hover"
            data-filter-tags="dr john smith +13174562564 john.smith@smartadminwebapp.com developer">
            <CardBody className="border-faded border-top-0 border-start-0 border-end-0 rounded-top">
              <div className="d-flex flex-row align-items-center">
                <span className="status status-success me-3">
                  <span
                    className="rounded-circle profile-image d-block"
                    style={{ backgroundImage: `url(${avatarA.src})`, backgroundSize: 'cover' }}
                  />
                </span>
                <div className="info-card-text flex-grow-1">
                  <Link href="" className="fs-xl text-truncate text-truncate-lg">
                    Dr. John Smith
                    <i className="fal fa-angle-down d-inline-block ms-1 fs-md" />
                  </Link>
                  <DropdownMenu>
                    <DropdownItem>Send Email</DropdownItem>
                    <DropdownItem>Create Appointment</DropdownItem>
                    <DropdownItem>Block User</DropdownItem>
                  </DropdownMenu>
                  <span className="d-block text-truncate text-truncate-lg">Senior Developer, Development Team</span>
                </div>
              </div>
            </CardBody>
            <CardBody className="p-0 collapse show">
              <div className="p-3">
                <Link href="tel:+13174562564" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mobile-alt text-muted me-2" /> +1 317-456-2564
                </Link>
                <Link href="mailto:john.smith@smartadminwebapp.com" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mouse-pointer text-muted me-2" /> john.smith@smartadminwebapp.com
                </Link>
                <address className="fs-sm fw-400 mt-4 text-muted mb-0">
                  <i className="fal fa-map-pin me-2" /> 15 Charist St, Detroit, MI, 48212, USA
                </address>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xl={4}>
          <Card
            id="c_2"
            className="border shadow-0 mb-g shadow-sm-hover"
            data-filter-tags="sarah connor +13134611347 sarah.connor@smartadminwebapp.com designer">
            <CardBody className="border-faded border-top-0 border-start-0 border-end-0 rounded-top">
              <div className="d-flex flex-row align-items-center">
                <span className="status status-warning me-3">
                  <span
                    className="rounded-circle profile-image d-block"
                    style={{ backgroundImage: `url(${avatarB.src})`, backgroundSize: 'cover' }}
                  />
                </span>
                <div className="info-card-text flex-grow-1">
                  <Link href="" className="fs-xl text-truncate text-truncate-lg" data-bs-toggle="dropdown" aria-expanded="false">
                    Sarah Connor
                    <i className="fal fa-angle-down d-inline-block ms-1 fs-md" />
                  </Link>
                  <DropdownMenu>
                    <DropdownItem>Send Email</DropdownItem>
                    <DropdownItem>Create Appointment</DropdownItem>
                    <DropdownItem>Block User</DropdownItem>
                  </DropdownMenu>
                  <span className="d-block text-truncate text-truncate-lg">UX Designer, Design Team</span>
                </div>
              </div>
            </CardBody>
            <CardBody className="p-0 collapse show">
              <div className="p-3">
                <Link href="tel:+13134611347" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mobile-alt text-muted me-2" /> +1 313-461-1347
                </Link>
                <Link href="mailto:sarah.connor@smartadminwebapp.com" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mouse-pointer text-muted me-2" /> sarah.connor@smartadminwebapp.com
                </Link>
                <address className="fs-sm fw-400 mt-4 text-muted mb-0">
                  <i className="fal fa-map-pin me-2" /> 134 Hamtrammac, Detroit, MI, 48314, USA
                </address>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xl={4}>
          <Card
            id="c_3"
            className="border shadow-0 mb-g shadow-sm-hover"
            data-filter-tags="james wilson +13137791347 james.wilson@smartadminwebapp.com manager">
            <CardBody className="border-faded border-top-0 border-start-0 border-end-0 rounded-top">
              <div className="d-flex flex-row align-items-center">
                <span className="status status-danger me-3">
                  <span
                    className="rounded-circle profile-image d-block"
                    style={{ backgroundImage: `url(${avatarC.src})`, backgroundSize: 'cover' }}
                  />
                </span>
                <div className="info-card-text flex-grow-1">
                  <Link href="" className="fs-xl text-truncate text-truncate-lg" data-bs-toggle="dropdown" aria-expanded="false">
                    James Wilson
                    <i className="fal fa-angle-down d-inline-block ms-1 fs-md" />
                  </Link>
                  <DropdownMenu>
                    <DropdownItem>Send Email</DropdownItem>
                    <DropdownItem>Create Appointment</DropdownItem>
                    <DropdownItem>Block User</DropdownItem>
                  </DropdownMenu>
                  <span className="d-block text-truncate text-truncate-lg">Project Manager, Management</span>
                </div>
              </div>
            </CardBody>
            <CardBody className="p-0 collapse show">
              <div className="p-3">
                <Link href="tel:+13137791347" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mobile-alt text-muted me-2" /> +1 313-779-1347
                </Link>
                <Link href="mailto:james.wilson@smartadminwebapp.com" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mouse-pointer text-muted me-2" /> james.wilson@smartadminwebapp.com
                </Link>
                <address className="fs-sm fw-400 mt-4 text-muted mb-0">
                  <i className="fal fa-map-pin me-2" /> 55 Smyth Rd, Detroit, MI, 48341, USA
                </address>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xl={4}>
          <Card
            id="c_4"
            className="border shadow-0 mb-g shadow-sm-hover"
            data-filter-tags="lisa anderson +13137793314 lisa.anderson@smartadminwebapp.com developer">
            <CardBody className="border-faded border-top-0 border-start-0 border-end-0 rounded-top">
              <div className="d-flex flex-row align-items-center">
                <span className="status status-success me-3">
                  <span
                    className="rounded-circle profile-image d-block"
                    style={{ backgroundImage: `url(${avatarD.src})`, backgroundSize: 'cover' }}
                  />
                </span>
                <div className="info-card-text flex-grow-1">
                  <Link href="" className="fs-xl text-truncate text-truncate-lg" data-bs-toggle="dropdown" aria-expanded="false">
                    Lisa Anderson
                    <i className="fal fa-angle-down d-inline-block ms-1 fs-md" />
                  </Link>
                  <DropdownMenu>
                    <DropdownItem>Send Email</DropdownItem>
                    <DropdownItem>Create Appointment</DropdownItem>
                    <DropdownItem>Block User</DropdownItem>
                  </DropdownMenu>
                  <span className="d-block text-truncate text-truncate-lg">Frontend Developer, Development Team</span>
                </div>
              </div>
            </CardBody>
            <CardBody className="p-0 collapse show">
              <div className="p-3">
                <a href="tel:+13137793314" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mobile-alt text-muted me-2" /> +1 313-779-3314
                </a>
                <a href="mailto:lisa.anderson@smartadminwebapp.com" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mouse-pointer text-muted me-2" /> lisa.anderson@smartadminwebapp.com
                </a>
                <address className="fs-sm fw-400 mt-4 text-muted mb-0">
                  <i className="fal fa-map-pin me-2" /> 134 Tasy Rd, Detroit, MI, 48212, USA
                </address>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xl={4}>
          <Card
            id="c_5"
            className="border shadow-0 mb-g shadow-sm-hover"
            data-filter-tags="michael brown +13137798134 michael.brown@smartadminwebapp.com developer">
            <CardBody className="border-faded border-top-0 border-start-0 border-end-0 rounded-top">
              <div className="d-flex flex-row align-items-center">
                <span className="status status-danger me-3">
                  <span
                    className="rounded-circle profile-image d-block"
                    style={{ backgroundImage: `url(${avatarE.src})`, backgroundSize: 'cover' }}
                  />
                </span>
                <div className="info-card-text flex-grow-1">
                  <Link href="" className="fs-xl text-truncate text-truncate-lg" data-bs-toggle="dropdown" aria-expanded="false">
                    Michael Brown
                    <i className="fal fa-angle-down d-inline-block ms-1 fs-md" />
                  </Link>
                  <DropdownMenu>
                    <DropdownItem>Send Email</DropdownItem>
                    <DropdownItem>Create Appointment</DropdownItem>
                    <DropdownItem>Block User</DropdownItem>
                  </DropdownMenu>
                  <span className="d-block text-truncate text-truncate-lg">Backend Developer, Development Team</span>
                </div>
              </div>
            </CardBody>
            <CardBody className="p-0 collapse show">
              <div className="p-3">
                <a href="tel:+13137798134" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mobile-alt text-muted me-2" /> +1 313-779-8134
                </a>
                <a href="mailto:michael.brown@smartadminwebapp.com" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mouse-pointer text-muted me-2" /> michael.brown@smartadminwebapp.com
                </a>
                <address className="fs-sm fw-400 mt-4 text-muted mb-0">
                  <i className="fal fa-map-pin me-2" /> 134 Gallery St, Detroit, MI, 46214, USA
                </address>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xl={4}>
          <Card
            id="c_6"
            className="border shadow-0 mb-g shadow-sm-hover"
            data-filter-tags="emma davis +13137797613 emma.davis@smartadminwebapp.com qa">
            <CardBody className="border-faded border-top-0 border-start-0 border-end-0 rounded-top">
              <div className="d-flex flex-row align-items-center">
                <span className="status status-success me-3">
                  <span
                    className="rounded-circle profile-image d-block"
                    style={{ backgroundImage: `url(${avatarF.src})`, backgroundSize: 'cover' }}
                  />
                </span>
                <div className="info-card-text flex-grow-1">
                  <Link href="" className="fs-xl text-truncate text-truncate-lg" data-bs-toggle="dropdown" aria-expanded="false">
                    Emma Davis
                    <i className="fal fa-angle-down d-inline-block ms-1 fs-md" />
                  </Link>
                  <DropdownMenu>
                    <DropdownItem>Send Email</DropdownItem>
                    <DropdownItem>Create Appointment</DropdownItem>
                    <DropdownItem>Block User</DropdownItem>
                  </DropdownMenu>
                  <span className="d-block text-truncate text-truncate-lg">QA Engineer, Testing Team</span>
                </div>
              </div>
            </CardBody>
            <CardBody className="p-0 collapse show">
              <div className="p-3">
                <a href="tel:+13137797613" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mobile-alt text-muted me-2" /> +1 313-779-7613
                </a>
                <a href="mailto:emma.davis@smartadminwebapp.com" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mouse-pointer text-muted me-2" /> emma.davis@smartadminwebapp.com
                </a>
                <address className="fs-sm fw-400 mt-4 text-muted mb-0">
                  <i className="fal fa-map-pin me-2" /> 13 Jamie Rd, Detroit, MI, 48313, USA
                </address>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xl={4}>
          <Card
            id="c_7"
            className="border shadow-0 mb-g shadow-sm-hover"
            data-filter-tags="david lee +13137794314 david.lee@smartadminwebapp.com devops">
            <CardBody className="border-faded border-top-0 border-start-0 border-end-0 rounded-top">
              <div className="d-flex flex-row align-items-center">
                <span className="status status-success me-3">
                  <span
                    className="rounded-circle profile-image d-block"
                    style={{ backgroundImage: `url(${avatarG.src})`, backgroundSize: 'cover' }}
                  />
                </span>
                <div className="info-card-text flex-grow-1">
                  <Link href="" className="fs-xl text-truncate text-truncate-lg" data-bs-toggle="dropdown" aria-expanded="false">
                    David Lee
                    <i className="fal fa-angle-down d-inline-block ms-1 fs-md" />
                  </Link>
                  <DropdownMenu>
                    <DropdownItem>Send Email</DropdownItem>
                    <DropdownItem>Create Appointment</DropdownItem>
                    <DropdownItem>Block User</DropdownItem>
                  </DropdownMenu>
                  <span className="d-block text-truncate text-truncate-lg">DevOps Engineer, Operations Team</span>
                </div>
              </div>
            </CardBody>
            <CardBody className="p-0 collapse show">
              <div className="p-3">
                <a href="tel:+13137794314" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mobile-alt text-muted me-2" /> +1 313-779-4314
                </a>
                <a href="mailto:david.lee@smartadminwebapp.com" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mouse-pointer text-muted me-2" /> david.lee@smartadminwebapp.com
                </a>
                <address className="fs-sm fw-400 mt-4 text-muted mb-0">
                  <i className="fal fa-map-pin me-2" /> 55 Smyth Rd, Detroit, MI, 48341, USA
                </address>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xs={4}>
          <Card
            id="c_8"
            className="border shadow-0 mb-g shadow-sm-hover"
            data-filter-tags="oliver wilson +13137793347 oliver.wilson@smartadminwebapp.com designer">
            <CardBody className="border-faded border-top-0 border-start-0 border-end-0 rounded-top">
              <div className="d-flex flex-row align-items-center">
                <span className="status status-warning me-3">
                  <span
                    className="rounded-circle profile-image d-block"
                    style={{ backgroundImage: `url(${avatarH.src})`, backgroundSize: 'cover' }}
                  />
                </span>
                <div className="info-card-text flex-grow-1">
                  <Link href="" className="fs-xl text-truncate text-truncate-lg" data-bs-toggle="dropdown" aria-expanded="false">
                    Oliver Wilson
                    <i className="fal fa-angle-down d-inline-block ms-1 fs-md" />
                  </Link>
                  <DropdownMenu>
                    <DropdownItem>Send Email</DropdownItem>
                    <DropdownItem>Create Appointment</DropdownItem>
                    <DropdownItem>Block User</DropdownItem>
                  </DropdownMenu>
                  <span className="d-block text-truncate text-truncate-lg">UI Designer, Design Team</span>
                </div>
              </div>
            </CardBody>
            <CardBody className="p-0 collapse show">
              <div className="p-3">
                <a href="tel:+13137793347" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mobile-alt text-muted me-2" /> +1 313-779-3347
                </a>
                <a href="mailto:oliver.wilson@smartadminwebapp.com" className="mt-1 d-block fs-sm fw-400">
                  <i className="fal fa-mouse-pointer text-muted me-2" /> oliver.wilson@smartadminwebapp.com
                </a>
                <address className="fs-sm fw-400 mt-4 text-muted mb-0">
                  <i className="fal fa-map-pin me-2" /> 798 Smyth Rd, Detroit, MI, 48341, USA
                </address>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default UserTab
