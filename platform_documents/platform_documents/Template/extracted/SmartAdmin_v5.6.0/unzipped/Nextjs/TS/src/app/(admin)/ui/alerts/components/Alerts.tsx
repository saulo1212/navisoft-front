'use client'
import ComponentCard from '@/components/ComponentCard'
import { useState } from 'react'
import { Alert } from 'react-bootstrap'

export const AlternativeBackground = () => {
  const [showInfo, setShowInfo] = useState(true)
  const [showHeadsUp, setShowHeadsUp] = useState(true)
  const [showDanger, setShowDanger] = useState(true)
  const [showDark, setShowDark] = useState(true)
  const [showWarning, setShowWarning] = useState(true)
  const [showSuccess, setShowSuccess] = useState(true)

  return (
    <>
      <ComponentCard
        title={
          <h2>
            Alternative
            <span className="fw-light">
              <i>Backgrounds</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show" id="panel5Content">
          <div className="panel-content">
            <div className="demo-v-spacing gap-3">
              {showInfo && (
                <Alert dismissible onClose={() => setShowInfo(false)} className="bg-info text-white show d-flex align-items-center">
                  <p className="mb-0">
                    <strong>Info!</strong> Alert for passing information to user.
                  </p>
                </Alert>
              )}

              {showHeadsUp && (
                <Alert
                  variant="primary"
                  className="bg-opacity-25 text-primary d-flex align-items-center"
                  dismissible
                  onClose={() => setShowHeadsUp(false)}>
                  <p className="mb-0">
                    <strong>Heads up!</strong> This alert needs your attention, but it's not super important.
                  </p>
                </Alert>
              )}

              {showDanger && (
                <Alert variant="danger" dismissible onClose={() => setShowDanger(false)} className="d-flex align-items-center">
                  <p className="mb-0">
                    <strong>Oh snap!</strong> Change a few things up and try submitting again.
                  </p>
                </Alert>
              )}

              {showDark && (
                <Alert variant="dark" dismissible onClose={() => setShowDark(false)} className="d-flex align-items-center">
                  <p className="mb-0">
                    <strong>Hello World!</strong> This is default alert message box.
                  </p>
                </Alert>
              )}

              {showWarning && (
                <Alert variant="warning" dismissible onClose={() => setShowWarning(false)} className="d-flex align-items-center">
                  <p className="mb-0">
                    <strong>Holy guacamole!</strong> You should check in on some of those fields below.
                  </p>
                </Alert>
              )}

              {showSuccess && (
                <Alert variant="success" dismissible onClose={() => setShowSuccess(false)} className="d-flex align-items-center">
                  <p className="mb-0">
                    <strong>Well Done!</strong> You successfully read this important alert message.
                  </p>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}
