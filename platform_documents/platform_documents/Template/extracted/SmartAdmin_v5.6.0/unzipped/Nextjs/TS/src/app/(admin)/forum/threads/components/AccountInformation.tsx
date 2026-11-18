'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'
import ThreadModal from './ThreadModal'

const AccountInformation = () => {
  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  return (
    <>
      <Card className="mb-g border shadow-0">
        <CardHeader>
          <div className="d-flex align-items-center justify-content-between">
            <div className="flex-grow-1">
              <span className="h6 fw-bold text-uppercase d-flex align-items-center mb-0">
                <Link href="/forum/general" className="btn btn-icon btn-outline-default me-2">
                  <i className="fal fa-chevron-left" />
                </Link>
                Account information &amp; Security
              </span>
            </div>
            <div className="d-flex align-items-center">
              <Button onClick={handleOpenModal} variant="success" className="shadow-0 btn-sm ms-auto flex-shrink-0 waves-effect waves-themed">
                New Thread
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardHeader className="p-0">
          <Row className="g-0 row-grid align-items-stretch">
            <Col xs={12} className="col-md">
              <div className="text-uppercase text-muted py-2 px-3">Title</div>
            </Col>
            <Col sm={6} md={2} xl={1} className="d-none d-md-block">
              <div className="text-uppercase text-muted py-2 px-3">Replies</div>
            </Col>
            <Col sm={6} md={3} className="d-none d-md-block">
              <div className="text-uppercase text-muted py-2 px-3">Last update</div>
            </Col>
          </Row>
        </CardHeader>
        <CardBody className="p-0">
          <Row className="g-0 row-grid">
            <Col xs={12}>
              <Row className="g-0 row-grid align-items-stretch">
                <div className="col-md">
                  <div className="p-3">
                    <div className="d-flex flex-column">
                      <Link href="/forum/discussions" className="fs-lg fw-500 d-flex align-items-start">
                        Package location <span className="badge bg-warning ms-auto">Sticky</span>
                      </Link>
                      <div className="d-block text-muted fs-sm">
                        Started by <Link href="">c_lantern</Link> on January 21, 2019 @12:30PM
                      </div>
                    </div>
                    <div className="d-flex">
                      <ul className="pagination pagination-xs mb-0 mt-3 align-self-end">
                        <li className="page-item">
                          <a className="page-link" href="#">
                            1
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            2
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            3
                          </a>
                        </li>
                        <li className="paginate_button page-item disabled px-0">…</li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            7
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            25
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">Last page</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      72 <i>Replies</i>
                    </span>
                    <span className="d-block text-muted">
                      4314 <i>Views</i>
                    </span>
                  </div>
                </Col>
                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-1 min-width-0 fs-sm">
                        <Link href="" className="d-block text-truncate">
                          Nam at justo magna. Aenean facilisis ultricies turpis
                        </Link>
                        <div className="text-muted small text-truncate">
                          Today, 12:13 <Link href="">c_lantern</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs={12}>
              <Row className="g-0 row-grid align-items-stretch">
                <div className="col-md">
                  <div className="p-3">
                    <div className="d-flex flex-column">
                      <Link href="/forum/discussions" className="fs-lg fw-500 d-flex align-items-start">
                        Vestibulum molestie, ipsum vitae feugiat lacinia
                      </Link>
                      <div className="d-block text-muted fs-sm">
                        Started by <Link href="">jamie</Link> on January 12, 2019 @4:23PM
                      </div>
                    </div>
                  </div>
                </div>
                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      15 <i>Replies</i>
                    </span>
                    <span className="d-block text-muted">
                      4314 <i>Views</i>
                    </span>
                  </div>
                </Col>
                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-1 min-width-0 fs-sm">
                        <Link href="" className="d-block text-truncate">
                          Morbi id enim a ex gravida dignissim nec eu massa
                        </Link>
                        <div className="text-muted small text-truncate">
                          Today, 06:01 <Link href="">jamie</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs={12}>
              <Row className="g-0 row-grid align-items-stretch">
                <div className="col-md">
                  <div className="p-3">
                    <div className="d-flex flex-column">
                      <Link href="/forum/discussions" className="fs-lg fw-500 d-flex align-items-start">
                        Nam viverra diam magna, eget lobortis orci tincidunt sed
                        <span className="badge bg-danger ms-auto">
                          <i className="fal fa-lock" /> <span className="ms-1 d-none d-md-inline">Locked</span>
                        </span>
                      </Link>
                      <div className="d-block text-muted fs-sm">
                        Started by <Link href="">maggie</Link> on February 17, 2019 @8:01AM
                      </div>
                    </div>
                  </div>
                </div>
                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      764 <i>Replies</i>
                    </span>
                    <span className="d-block text-muted">
                      534 <i>Views</i>
                    </span>
                  </div>
                </Col>
                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-1 min-width-0 fs-sm">
                        <Link href="" className="d-block text-truncate">
                          Duis placerat in sapien et placerat. Duis quis feugiat leo. Curabitur laoreet ex nec odio interdum
                        </Link>
                        <div className="text-muted small text-truncate">
                          Today, 12:25 <Link href="">josekras_alma</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs={12} className="disabled">
              <Row className="g-0 row-grid align-items-stretch">
                <div className="col-md">
                  <div className="p-3">
                    <div className="d-flex flex-column">
                      <span className="fs-lg fw-500 d-flex align-items-start">
                        Proin vehicula nibh a nisl porta laoreet <span className="badge bg-secondary ms-auto">Disabled</span>
                      </span>
                      <div className="d-block text-muted fs-sm">
                        Started by <Link href="">larry85</Link> on December 12, 2019 @12:30PM
                      </div>
                    </div>
                  </div>
                </div>
                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      87 <i>Replies</i>
                    </span>
                    <span className="d-block text-muted">
                      674 <i>Views</i>
                    </span>
                  </div>
                </Col>
                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-1 min-width-0 fs-sm">
                        <span className="d-block text-truncate">
                          Praesent mollis congue bibendum. Etiam ipsum augue, sodales id metus a, molestie hendrerit felis.
                        </span>
                        <div className="text-muted small text-truncate">
                          Today, 05:25 <span>lambert</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs={12}>
              <Row className="g-0 row-grid align-items-stretch">
                <div className="col-md">
                  <div className="p-3">
                    <div className="d-flex flex-column">
                      <Link href="/forum/discussions" className="fs-lg fw-500 d-flex align-items-start">
                        Nulla auctor hendrerit purus, sit amet lacinia tellus placerat nec.
                      </Link>
                      <div className="d-block text-muted fs-sm">
                        Started by <Link href="">gi_34</Link> on January 01, 2019 @2:30PM
                      </div>
                    </div>
                  </div>
                </div>
                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      731<i>Replies</i>
                    </span>
                    <span className="d-block text-muted">
                      1246 <i>Views</i>
                    </span>
                  </div>
                </Col>
                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-1 min-width-0 fs-sm">
                        <Link href="" className="d-block text-truncate">
                          Proin non felis lobortis, porta arcu a, iaculis arcu. Morbi tincidunt non ante et fermentum
                        </Link>
                        <div className="text-muted small text-truncate">
                          Today, 05:25 <Link href="">elmo</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs={12}>
              <Row className="g-0 row-grid align-items-stretch">
                <div className="col-md">
                  <div className="p-3">
                    <div className="d-flex flex-column">
                      <Link href="/forum/discussions" className="fs-lg fw-500 d-flex align-items-start">
                        Donec tincidunt augue auctor, ullamcorper urna ac
                      </Link>
                      <div className="d-block text-muted fs-sm">
                        Started by <Link href="">zico03</Link> on August 25, 2019 @7:45PM
                      </div>
                    </div>
                  </div>
                </div>
                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      3943<i>Replies</i>
                    </span>
                    <span className="d-block text-muted">
                      9843 <i>Views</i>
                    </span>
                  </div>
                </Col>
                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-1 min-width-0 fs-sm">
                        <Link href="" className="d-block text-truncate">
                          Sed felis eros, facilisis eu cursus at, efficitur et felis
                        </Link>
                        <div className="text-muted small text-truncate">
                          Today, 05:25 <Link href="">katty60</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs={12}>
              <Row className="g-0 row-grid align-items-stretch">
                <div className="col-md">
                  <div className="p-3">
                    <div className="d-flex flex-column">
                      <Link href="/forum/discussions" className="fs-lg fw-500 d-flex align-items-start">
                        Nullam in dictum lacus. Nulla auctor hendrerit purus, sit amet lacinia tellus placerat nec
                      </Link>
                      <div className="d-block text-muted fs-sm">
                        Started by <Link href="">c_lantern</Link> on January 21, 2019 @12:30PM
                      </div>
                    </div>
                  </div>
                </div>
                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      38<i>Replies</i>
                    </span>
                    <span className="d-block text-muted">
                      55 <i>Views</i>
                    </span>
                  </div>
                </Col>
                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-1 min-width-0 fs-sm">
                        <Link href="" className="d-block text-truncate">
                          Phasellus quis sem diam. Sed commodo metus in ultrices consequat
                        </Link>
                        <div className="text-muted small text-truncate">
                          Today, 05:25 <Link href="">laigma76</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs={12}>
              <Row className="g-0 row-grid align-items-stretch">
                <div className="col-md">
                  <div className="p-3">
                    <div className="d-flex flex-column">
                      <Link href="/forum/discussions" className="fs-lg fw-500 d-flex align-items-start">
                        Sit amet lacinia tellus placerat nec. Nunc condimentum
                      </Link>
                      <div className="d-block text-muted fs-sm">
                        Started by <Link href="">lambert89</Link> on March 12, 2019 @7:30AM
                      </div>
                    </div>
                  </div>
                </div>
                <Col xs={4} md={2} xl={1} className="d-none d-md-block">
                  <div className="p-3 p-md-3 fs-sm">
                    <span className="d-block text-muted">
                      24<i>Replies</i>
                    </span>
                    <span className="d-block text-muted">
                      100 <i>Views</i>
                    </span>
                  </div>
                </Col>
                <Col xs={8} md={3} className="d-none d-md-block">
                  <div className="p-3 p-md-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-1 min-width-0 fs-sm">
                        <Link href="" className="d-block text-truncate">
                          ullamcorper cursus. Proin sodales odio sed aliquet pulvinar. Duis ipsum erat, ultricies a dolor non, tempor dictum ante
                        </Link>
                        <div className="text-muted small text-truncate">
                          Today, 05:25 <Link href="">laigma76</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <ThreadModal show={showModal} handleClose={handleCloseModal} />
    </>
  )
}

export default AccountInformation
