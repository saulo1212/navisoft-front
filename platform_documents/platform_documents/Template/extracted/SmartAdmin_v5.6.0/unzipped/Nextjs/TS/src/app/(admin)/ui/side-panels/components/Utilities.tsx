'use client'
import sidePanelGif from '@/assets/img/demo/pages/side-panel-demo.gif'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Alert, Button, Col, Row } from 'react-bootstrap'

const Utilities = () => {
  const [showLeftPanel, setShowLeftPanel] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)

  const [isTrimmed, setIsTrimmed] = useState(false)
  const [isMinified, setIsMinified] = useState(false)

  useEffect(() => {
    const htmlElement = document.documentElement
    if (isMinified) {
      htmlElement.classList.add('set-nav-minified')
    } else {
      htmlElement.classList.remove('set-nav-minified')
    }

    return () => {
      htmlElement.classList.remove('set-nav-minified')
    }
  }, [isMinified])

  return (
    <>
      <div className={`main-content d-flex ${isTrimmed ? 'sortable-inactive layout-trimmed' : ''}`}>
        <div className="d-flex flex-grow-1 p-0 w-100">
          <div
            id="js-slide-left"
            className={`flex-wrap flex-shrink-0 position-relative slide-on-mobile slide-on-mobile-left bg-primary-200 pattern-0 p-3 ${
              showLeftPanel ? 'slide-on-mobile-left-show' : ''
            }`}>
            <div className="alert alert-primary">
              These side panels slide out on mobile view port and can be activated by a button as an "slide in/out" mode.
            </div>
          </div>

          {showLeftPanel && <div className="slide-backdrop" onClick={() => setShowLeftPanel(false)} />}

          <div className="d-flex flex-column flex-grow-1 flex-0 overflow-x-auto bg-faded">
            <div className="p-3">
              <Row className="d-lg-none d-xl-none d-xxl-none mb-g">
                <Col xs={12}>
                  <div className="alert alert-info">
                    These buttons below can be placed anywhere on your screen. Applying the responsive utility classes, you control the visibility of
                    the buttons, for only when they are needed.
                  </div>
                </Col>
                <Col xs={6}>
                  <Button variant="primary" className="waves-effect btn-block btn-lg w-100" onClick={() => setShowLeftPanel(true)}>
                    left panel
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button variant="primary" className="waves-effect btn-block btn-lg w-100" onClick={() => setShowRightPanel(true)}>
                    right panel
                  </Button>
                </Col>
              </Row>
              <div className="panel-tag">
                <p>
                  These side panels slide out on mobile viewports and can be toggled using a button in "slide in/out" mode. To enable this
                  functionality, apply the <code>.slide-on-mobile</code> class along with
                  <code>
                    .slide-on-mobile-{'{'}left,right{'}'}
                  </code>
                  to the panels. When activated, the
                  <code>
                    .slide-on-mobile-{'{'}left,right{'}'}-show
                  </code>
                  class is toggled to reveal the panel.
                </p>
                <p>
                  A backdrop is automatically inserted right after the closing tag of the <code>.slide-on-mobile</code> container. Typically, this
                  slide panel is paired with <code>.layout-trimmed</code> and <code>.set-nav-minified</code> for a clean and streamlined appearance.
                </p>
              </div>
              <div className="d-flex gap-2">
                <Button variant="secondary" className="waves-effect" onClick={() => setIsTrimmed(!isTrimmed)}>
                  Trimmed Layout
                </Button>

                <Button
                  variant="secondary"
                  className="waves-effect d-none d-sm-block d-md-block d-lg-block"
                  onClick={() => setIsMinified(!isMinified)}>
                  Minified Nav
                </Button>
              </div>
              <div className="d-none d-sm-block d-md-none d-lg-flex mt-3">
                <Image src={sidePanelGif} alt="Side Panel Demo Animation" className="m-auto shadow rounded" />
              </div>
            </div>
          </div>

          <div
            id="js-slide-right"
            className={`flex-wrap flex-shrink-0 position-relative slide-on-mobile slide-on-mobile-right bg-primary-200 pattern-0 p-3 ${
              showRightPanel ? 'slide-on-mobile-right-show' : ''
            }`}>
            <Alert variant="primary">You can place any content in these side panels, making it a secondary optional navigation panel.</Alert>
          </div>

          {showRightPanel && <div className="slide-backdrop" onClick={() => setShowRightPanel(false)} />}
        </div>
      </div>
    </>
  )
}

export default Utilities
