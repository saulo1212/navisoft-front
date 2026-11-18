'use client'
import { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'react-bootstrap'

const ThreadReplySection = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggleCollapse = () => setIsOpen(!isOpen)

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button type="button" variant="primary" onClick={toggleCollapse} aria-controls="main-reply-form" aria-expanded={isOpen}>
          {isOpen ? 'Close Reply Form' : 'Reply to this thread'}
        </Button>
      </div>

      <Collapse in={isOpen}>
        <Card className="mb-g border shadow-0">
          <CardHeader>
            <h5 className="mb-0 fw-bold">Post a Reply</h5>
          </CardHeader>
          <CardBody>
            <form onSubmit={(e) => e.preventDefault()}>
              <Row className="mb-3">
                <Col lg={8}>
                  <div className="d-flex mb-2">
                    <div className="btn-group me-2">
                      <Button variant="outline-secondary" size="sm" className="waves-effect">
                        <i className="fal fa-bold" />
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="waves-effect">
                        <i className="fal fa-italic" />
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="waves-effect">
                        <i className="fal fa-underline" />
                      </Button>
                    </div>
                    <div className="btn-group me-2">
                      <Button variant="outline-secondary" size="sm" className="waves-effect">
                        <i className="fal fa-list-ul" />
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="waves-effect">
                        <i className="fal fa-list-ol" />
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="waves-effect">
                        <i className="fal fa-link" />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <div className="form-control p-3 mb-3 bg-light" id="quotePreview" style={{ display: 'none' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold">
                      Quoting <span id="quoteName">Sarah McBrook</span>
                    </span>
                    <button type="button" className="btn-close" aria-label="Close" />
                  </div>
                  <blockquote className="blockquote font-italic p-2 border-start border-3 border-primary ps-3 mb-0 fs-sm text-muted">
                    <p className="mb-0">
                      Curabitur sollicitudin eros eget nibh commodo posuere. Aenean non diam at massa accumsan elementum eget in arcu...
                    </p>
                  </blockquote>
                </div>

                <textarea className="form-control" rows={6} placeholder="Type your reply here..." />
              </div>

              <div className="d-flex justify-content-end align-items-center">
                <Button type="button" variant="outline-secondary" className="me-2 waves-effect">
                  Save Draft
                </Button>
                <Button type="submit" variant="success" className='waves-effect'>
                  Post
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </Collapse>
    </>
  )
}

export default ThreadReplySection
