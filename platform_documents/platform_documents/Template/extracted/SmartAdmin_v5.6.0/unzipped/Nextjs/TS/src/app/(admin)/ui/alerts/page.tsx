import ComponentCard from '@/components/ComponentCard'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { basePath } from '@/helpers'
import { Metadata } from 'next'
import Link from 'next/link'
import { Alert, Button, Col, Row } from 'react-bootstrap'
import { AlternativeBackground } from './components/Alerts'

export const metadata: Metadata = { title: 'Alerts' }

const BasicAlert = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Basic
            <span className="fw-light">
              <i>Alerts</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container" id="panel1Content">
          <div className="panel-content">
            <div className="demo-v-spacing gap-3">
              <Alert variant="primary" role="alert">
                <strong>Heads up!</strong> This alert needs your attention, but it's not super important.
              </Alert>
              <Alert variant="success" role="alert">
                <strong>Well Done!</strong> You successfully read this important alert message.
              </Alert>
              <Alert variant="danger" role="alert">
                <strong>Oh snap!</strong> Change a few things up and try submitting again.
              </Alert>
              <Alert variant="warning" role="alert">
                <strong>Holy guacamole!</strong> You should check in on some of those fields below.
              </Alert>
              <Alert variant="info" role="alert">
                <strong>Info!</strong> Alert for passing information to user.
              </Alert>
              <Alert variant="secondary" role="alert">
                <strong>Hello World!</strong> This is default alert message box.
              </Alert>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

const DismissableAlert = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Dismissable
            <span className="fw-light">
              <i>Alerts</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container" id="panel2Content">
          <div className="panel-content">
            <div className="demo-v-spacing gap-3">
              <Alert variant="primary" dismissible className="fade show" role="alert">
                <strong>Heads up!</strong> This alert needs your attention, but it's not super important.
              </Alert>
              <Alert variant="success" dismissible className="fade show" role="alert">
                <strong>Well Done!</strong> You successfully read this important alert message.
              </Alert>
              <Alert variant="danger" dismissible className="fade show" role="alert">
                <strong>Oh snap!</strong> Change a few things up and try submitting again.
              </Alert>
              <Alert variant="warning" dismissible className="fade show" role="alert">
                <strong>Holy guacamole!</strong> You should check in on some of those fields below.
              </Alert>
              <Alert variant="info" dismissible className="fade show" role="alert">
                <strong>Info!</strong> Alert for passing information to user.
              </Alert>
              <Alert variant="secondary" dismissible className="fade show" role="alert">
                <strong>Hello World!</strong> This is default alert message box.
              </Alert>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

const LargeAlert = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Large
            <span className="fw-light">
              <i>Alerts</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show" id="panel3Content">
          <div className="panel-content">
            <div className="demo-v-spacing gap-3">
              <Alert dismissible variant="success" className="fade show" role="alert">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3">
                    <i className="bi bi-arrow-repeat fs-4 spin" />
                  </div>
                  <div className="flex-grow-1">
                    <span className="h6 mb-0 fw-bold">Task 55% Complete</span>
                    <div className="progress mt-2" style={{ height: 4 }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                        role="progressbar"
                        style={{ width: '55%' }}
                        aria-valuenow={55}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </div>
              </Alert>
              <Alert dismissible className="bg-success text-white fade show" role="alert">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3">
                    <i className="bi bi-check-lg fs-4" />
                  </div>
                  <div className="flex-grow-1">
                    <span className="h6 mb-0 fw-bold">Task 100% Complete</span>
                    <div className="progress mt-2" style={{ height: 4 }}>
                      <div
                        className="progress-bar progress-bar-striped bg-warning"
                        role="progressbar"
                        style={{ width: '100%' }}
                        aria-valuenow={100}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </div>
              </Alert>
              <Alert className="border border-info bg-transparent text-info fade show" role="alert">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3">
                    <i className="bi bi-exclamation-triangle" />
                  </div>
                  <div className="flex-grow-1">
                    <span className="h5 mb-0 fw-bold">Compilation error occured!</span>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="info" size="sm" className="rounded-pill">
                      Repair
                    </Button>
                    <Button variant="danger" size="sm" className="rounded-pill" data-bs-dismiss="alert" aria-label="Close">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </Alert>
              <Alert className="border border-danger bg-transparent text-secondary fade show" role="alert">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3">
                    <div className="bg-danger rounded-circle p-2 d-flex align-items-center justify-content-center position-relative">
                      <svg className="sa-icon sa-icon-2x sa-bold sa-icon-light">
                        <use href={`${basePath}/icons/sprite.svg#alert-triangle`} />
                      </svg>
                      <span className="position-absolute border border-light top-0 start-100 translate-middle badge rounded-pill bg-fusion-500 mt-1">
                        19+
                        <span className="visually-hidden">9+ unread messages</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <span className="h5 text-danger">This branch is out-of-date with the base branch</span>
                  </div>
                  <Link href="" className="btn btn-outline-danger btn-sm flex-shrink-0">
                    Report
                  </Link>
                </div>
              </Alert>
              <Alert className="border bg-transparent text-secondary fade show" role="alert">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3">
                    <div className="bg-success rounded-circle p-2 d-flex align-items-center justify-content-center position-relative">
                      <svg className="sa-icon sa-icon-2x sa-bold sa-icon-light">
                        <use href={`${basePath}/icons/sprite.svg#check-circle`} />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <span className="h5 text-success">All checks have passed!</span>
                    <br />2 successful checks
                  </div>
                  <Link href="" className="btn btn-outline-success btn-sm flex-shrink-0">
                    Review
                  </Link>
                </div>
              </Alert>
              <Alert className="bg-info text-white fade show" role="alert">
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle p-2 d-flex align-items-center justify-content-center position-relative me-3">
                    <svg className="sa-icon sa-icon-2x sa-bold sa-icon-dark">
                      <use href={`${basePath}/icons/sprite.svg#frown`} />
                    </svg>
                  </div>
                  <div className="flex-grow-1">
                    <span className="h5">This branch is out-of-date with the base branch</span>
                    <br />
                    Some pipes failed during build.
                  </div>
                  <Link href="" className="btn btn-warning btn-sm rounded-pill px-4 flex-shrink-0">
                    Fix
                  </Link>
                </div>
              </Alert>
              <Alert className="bg-dark text-white border-0 fade show">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3">
                    <div className="bg-success rounded-circle p-2 d-flex align-items-center justify-content-center position-relative">
                      <svg className="sa-icon sa-icon-2x sa-bold sa-icon-light">
                        <use href={`${basePath}/icons/sprite.svg#check-square`} />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <span className="h5">Download complete</span>
                    <br />
                    Install the latest version
                  </div>
                  <Link href="" className="btn btn-warning btn-sm fw-medium" data-bs-dismiss="alert" aria-label="Close">
                    Install
                  </Link>
                </div>
              </Alert>
              <Alert dismissible className="bg-warning text-dark fade show">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3">
                    <div className="bg-info rounded-circle p-2 d-flex align-items-center justify-content-center position-relative">
                      <svg className="sa-icon sa-icon-4x sa-bold sa-icon-light">
                        <use href={`${basePath}/icons/sprite.svg#database`} />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <span className="h5">Large Icon</span>
                    <br />
                    Custom alert background with <strong>large</strong> sized icon.
                  </div>
                </div>
              </Alert>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

const AlertOutline = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Alert
            <span className="fw-light">
              <i>Outline</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show" id="panel4Content">
          <div className="panel-content">
            <div className="demo-v-spacing gap-3">
              <Alert className="border-primary bg-transparent text-primary" role="alert">
                <strong>Heads up!</strong> This alert needs your attention, but it's not super important.
              </Alert>
              <Alert className="alert border-success bg-transparent text-success" role="alert">
                <strong>Well Done!</strong> You successfully read this important alert message.
              </Alert>
              <Alert className="border-danger bg-transparent text-danger" role="alert">
                <strong>Oh snap!</strong> Change a few things up and try submitting again.
              </Alert>
              <Alert className="border-warning bg-transparent text-warning" role="alert">
                <strong>Holy guacamole!</strong> You should check in on some of those fields below.
              </Alert>
              <Alert className="border-info bg-transparent text-info" role="alert">
                <strong>Info!</strong> Alert for passing information to user.
              </Alert>
              <Alert className="border-secondary bg-transparent text-secondary" role="alert">
                <strong>Hello World!</strong> This is default alert message box.
              </Alert>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

const StackIcon = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Stack
            <span className="fw-light">
              <i>Icon</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show" id="panel6Content">
          <div className="panel-content">
            <div className="demo-v-spacing gap-3">
              <Alert dismissible className="bg-primary bg-opacity-10 border-primary fade show" role="alert">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3" style={{ width: '3rem' }}>
                    <div className="stack-icon" style={{ fontSize: '3rem' }}>
                      <div className="icon-layers">
                        <i className="sa sa-base-2 stack-3x text-success" />
                      </div>
                      <div className="icon-layers">
                        <i className="sa sa-base-10 stack-1x text-dark" />
                      </div>
                      <div className="icon-layers">
                        <svg className="sa-icon sa-bold stack-1x sa-icon-danger">
                          <use href={`${basePath}/icons/sprite.svg#alert-triangle`} />
                        </svg>
                      </div>
                      <div className="icon-layers">
                        <svg className="sa-icon sa-bold sa-icon-warning stack-1x">
                          <use href={`${basePath}/icons/sprite.svg#sun`} />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <strong>Custom stack icon size! </strong> You can change the stack icon size with font-size style property.
                  </div>
                </div>
              </Alert>
              <Alert dismissible className="bg-success bg-opacity-10 border-success fade show" role="alert">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3" style={{ width: '4rem' }}>
                    <div className="stack-icon" style={{ fontSize: '4rem' }}>
                      <div className="icon-layers">
                        <i className="sa sa-base-2 stack-3x text-success" />
                      </div>
                      <div className="icon-layers">
                        <i className="sa sa-base-10 stack-1x text-dark" />
                      </div>
                      <div className="icon-layers">
                        <svg className="sa-icon sa-bold stack-1x sa-icon-danger">
                          <use href={`${basePath}/icons/sprite.svg#alert-triangle`} />
                        </svg>
                      </div>
                      <div className="icon-layers">
                        <svg className="sa-icon sa-bold sa-icon-warning stack-1x">
                          <use href={`${basePath}/icons/sprite.svg#sun`} />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <p className="h5 mb-1 fw-bold">A slightly larger icon</p> Custom alert background with <strong>small</strong> sized icon stack.
                  </div>
                </div>
              </Alert>
              <Alert dismissible className="bg-warning bg-opacity-10 border-warning fade show">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3" style={{ width: '6rem' }}>
                    <div className="stack-icon" style={{ fontSize: '6rem' }}>
                      <div className="icon-layers">
                        <i className="sa sa-base-2 stack-3x text-success" />
                      </div>
                      <div className="icon-layers">
                        <i className="sa sa-base-10 stack-1x text-dark" />
                      </div>
                      <div className="icon-layers">
                        <svg className="sa-icon sa-bold stack-1x sa-icon-danger">
                          <use href={`${basePath}/icons/sprite.svg#alert-triangle`} />
                        </svg>
                      </div>
                      <div className="icon-layers">
                        <svg className="sa-icon sa-bold sa-icon-warning stack-1x">
                          <use href={`${basePath}/icons/sprite.svg#sun`} />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow-1 text-inverse">
                    <span className="h3">Large Icon Stack</span>
                    <br /> Custom alert background with <strong>large</strong> sized icon stack.
                  </div>
                </div>
              </Alert>
              <Alert dismissible className="bg-danger bg-opacity-10 border-danger text-danger fade show">
                <div className="d-flex align-items-center">
                  <div className="alert-icon flex-shrink-0 me-3" style={{ width: '8rem' }}>
                    <div className="stack-icon" style={{ fontSize: '8rem' }}>
                      <div className="icon-layers">
                        <i className="sa sa-base-2 stack-3x text-success" />
                      </div>
                      <div className="icon-layers">
                        <i className="sa sa-base-10 stack-1x text-dark" />
                      </div>
                      <div className="icon-layers">
                        <svg className="sa-icon sa-bold stack-1x sa-icon-danger">
                          <use href={`${basePath}/icons/sprite.svg#alert-triangle`} />
                        </svg>
                      </div>
                      <div className="icon-layers">
                        <svg className="sa-icon sa-bold sa-icon-warning stack-1x">
                          <use href={`${basePath}/icons/sprite.svg#sun`} />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow-1 ps-2">
                    <span className="h2 mb-0"> Hold on there Sparky! </span>
                    <br /> Better fix those errors before you can complete this request
                  </div>
                </div>
              </Alert>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

const Page = () => {
  return (
    <>
      <div className="content-wrapper">
        <PageBreadcrumb
          title={'Alerts'}
          subTitle1={'Design'}
          subTitle2={'UI Components'}
          subText={'Provide contextual feedback messages for common user actions with a variety of customizable and flexible alert options.'}
        />
        <div className="main-content">
          <Row id="sortable-grid">
            <Col md={12} xl={6}>
              <BasicAlert />
              <DismissableAlert />
              <LargeAlert />
            </Col>

            <Col md={12} xl={6}>
              <AlertOutline />
              <AlternativeBackground />
              <StackIcon />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Page
