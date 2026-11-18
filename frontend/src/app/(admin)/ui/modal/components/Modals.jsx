'use client';

import ComponentCard from '@/components/ComponentCard';
import { basePath } from '@/helpers';
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { useToggle } from 'usehooks-ts';
export const BasicModals = () => {
  const [isSmallOpen, toggleSmall] = useToggle(false);
  const [isNormalOpen, toggleNormal] = useToggle(false);
  const [isLargeOpen, toggleLarge] = useToggle(false);
  const [isXlOpen, toggleXl] = useToggle(false);
  const [isSmallCenterOpen, toggleSmallCenter] = useToggle(false);
  const [isNormalCenterOpen, toggleNormalCenter] = useToggle(false);
  const [isLargeCenterOpen, toggleLargeCenter] = useToggle(false);
  const [isXlCenterOpen, toggleXlCenter] = useToggle(false);
  return <>
      <ComponentCard title={<h2>
            Basic
            <span className="fw-300">
              <i>Modals</i>
            </span>
          </h2>} toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Below is a static modal example (meaning its position and display have been overridden). Included are the modal header, modal body
              (required for padding), and modal footer (optional). We ask that you include modal headers with dismiss actions whenever possible, or
              provide another explicit dismiss action.
            </div>

            <Modal size="sm" show={isSmallOpen} onHide={toggleSmall}>
              <ModalHeader closeButton>
                <ModalTitle as="h5">Modal Small</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Alert variant="danger" className="m-0">
                  This is the content area of the modal.
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" className="waves-effect" onClick={toggleSmall}>
                  Close
                </Button>
                <Button variant="primary" className="waves-effect">Save changes</Button>
              </ModalFooter>
            </Modal>

            <Modal show={isNormalOpen} onHide={toggleNormal}>
              <ModalHeader closeButton>
                <ModalTitle as="h5">Modal Default</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Alert variant="danger" className="m-0">
                  This is the content area of the modal.
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button onClick={toggleNormal} variant="secondary" className="waves-effect">
                  Close
                </Button>
                <Button variant="primary" className="waves-effect">Save changes</Button>
              </ModalFooter>
            </Modal>

            <Modal size="lg" show={isLargeOpen} onHide={toggleLarge}>
              <ModalHeader closeButton>
                <ModalTitle as="h5">Modal Large</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Alert variant="danger" className="m-0">
                  This is the content area of the modal.
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button onClick={toggleLarge} variant="secondary" className="waves-effect">
                  Close
                </Button>
                <Button variant="primary" className="waves-effect">Save changes</Button>
              </ModalFooter>
            </Modal>

            <Modal size="xl" show={isXlOpen} onHide={toggleXl}>
              <ModalHeader closeButton>
                <ModalTitle as="h5">Modal XL</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Alert variant="danger" className="m-0">
                  This is the content area of the modal.
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button className="waves-effect" onClick={toggleXl} variant="secondary">
                  Close
                </Button>
                <Button variant="primary" className="waves-effect">
                  Save changes
                </Button>
              </ModalFooter>
            </Modal>

            <Modal size="sm" centered show={isSmallCenterOpen} onHide={toggleSmallCenter}>
              <ModalHeader closeButton>
                <ModalTitle as="h5">Modal Small Center</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Alert variant="danger" className="m-0">
                  This is the content area of the modal.
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" className="waves-effect" onClick={toggleSmallCenter}>
                  Close
                </Button>
                <Button variant="primary" className="waves-effect">
                  Save changes
                </Button>
              </ModalFooter>
            </Modal>

            <Modal centered show={isNormalCenterOpen} onHide={toggleNormalCenter}>
              <ModalHeader closeButton>
                <ModalTitle as="h5">Modal Center</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Alert variant="danger" className="m-0">
                  This is the content area of the modal.
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" className="waves-effect" onClick={toggleNormalCenter}>
                  Close
                </Button>
                <Button variant="primary" className="waves-effect">
                  Save changes
                </Button>
              </ModalFooter>
            </Modal>

            <Modal size="lg" centered show={isLargeCenterOpen} onHide={toggleLargeCenter}>
              <ModalHeader closeButton>
                <ModalTitle as="h5">Modal Large Center</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Alert variant="danger" className="m-0">
                  This is the content area of the modal.
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" className="waves-effect" onClick={toggleLargeCenter}>
                  Close
                </Button>
                <Button variant="primary" className="waves-effect">
                  Save changes
                </Button>
              </ModalFooter>
            </Modal>

            <Modal size="xl" centered show={isXlCenterOpen} onHide={toggleXlCenter}>
              <ModalHeader closeButton>
                <ModalTitle as="h5">Modal XL Center</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Alert variant="danger" className="m-0">
                  This is the content area of the modal.
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" className="waves-effect" onClick={toggleXlCenter}>
                  Close
                </Button>
                <Button variant="primary" className="waves-effect">
                  Save changes
                </Button>
              </ModalFooter>
            </Modal>

            <h5 className="frame-heading">Default</h5>
            <div className="frame-wrap">
              <div className="demo">
                <Button onClick={toggleSmall} variant="default" className="waves-effect">
                  Small
                </Button>
                <Button onClick={toggleNormal} variant="default" className="waves-effect">
                  Normal
                </Button>
                <Button onClick={toggleLarge} variant="default" className="waves-effect">
                  Large
                </Button>
                <Button onClick={toggleXl} variant="default" className="waves-effect">
                  XL
                </Button>
              </div>
            </div>
            <h5 className="frame-heading">Centered</h5>
            <div className="frame-wrap mb-0">
              <div className="demo">
                <Button onClick={toggleSmallCenter} variant="default" className="waves-effect">
                  Small
                </Button>
                <Button onClick={toggleNormalCenter} variant="default" className="waves-effect">
                  Normal
                </Button>
                <Button onClick={toggleLargeCenter} variant="default" className="waves-effect">
                  Large
                </Button>
                <Button onClick={toggleXlCenter} variant="default" className="waves-effect">
                  XL
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>;
};
export const SideModals = () => {
  const [isEndOpen, toggleEnd] = useToggle(false);
  const [isEndSmOpen, toggleEndSm] = useToggle(false);
  const [isEndLgOpen, toggleEndLg] = useToggle(false);
  const [isEndXlOpen, toggleEndXl] = useToggle(false);
  const [isStartOpen, toggleStart] = useToggle(false);
  const [isStartSmOpen, toggleStartSm] = useToggle(false);
  const [isStartLgOpen, toggleStartLg] = useToggle(false);
  const [isStartXlOpen, toggleStartXl] = useToggle(false);
  const [isTopOpen, toggleTop] = useToggle(false);
  const [isBottomOpen, toggleBottom] = useToggle(false);
  return <ComponentCard title={<h2>
          Side
          <span className="fw-300">
            <i>Modals</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Modals can be positioned on different sides of the page using modifier classes like <code>.modal-dialog-start</code>,{' '}
            <code>.modal-dialog-end</code>, <code>.modal-dialog-top</code>, and <code>.modal-dialog-bottom</code> on <code>.modal-dialog</code>. These
            side modals also support size classes.
          </div>

          <Modal dialogClassName="modal-dialog-end" show={isEndOpen} onHide={toggleEnd}>
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal End</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="danger" className="m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={toggleEnd} className="waves-effect">
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal dialogClassName="modal-dialog-end" size="sm" show={isEndSmOpen} onHide={toggleEndSm}>
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal End Small</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="danger" className="m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" className="waves-effect" onClick={toggleEndSm}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal dialogClassName="modal-dialog-end" size="lg" show={isEndLgOpen} onHide={toggleEndLg}>
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal End Large</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="danger" className="m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={toggleEndLg} className="waves-effect">
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal dialogClassName="modal-dialog-end" size="xl" show={isEndXlOpen} onHide={toggleEndXl}>
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal End XL</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="danger" className="m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" className="waves-effect" onClick={toggleEndXl}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal dialogClassName="modal-dialog-start" show={isStartOpen} onHide={toggleStart}>
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal Start</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="danger" className="m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" className="waves-effect" onClick={toggleStart}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal dialogClassName="modal-dialog-start" size="sm" show={isStartSmOpen} onHide={toggleStartSm}>
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal Start Small</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="danger" className="m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" className="waves-effect" onClick={toggleStartSm}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal dialogClassName="modal-dialog-start" size="lg" show={isStartLgOpen} onHide={toggleStartLg}>
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal Start Large</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="danger" className="m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" className="waves-effect" onClick={toggleStartLg}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal dialogClassName="modal-dialog-start" size="xl" show={isStartXlOpen} onHide={toggleStartXl}>
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal Start XL</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="danger" className="m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" className="waves-effect" onClick={toggleStartXl}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal dialogClassName="modal-dialog-top" show={isTopOpen} onHide={toggleTop}>
            <ModalBody>
              <Alert variant="warning" className="m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
          </Modal>

          <Modal dialogClassName="modal-dialog-bottom" show={isBottomOpen} onHide={toggleBottom}>
            <ModalBody>
              <Alert variant="success" className="m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
          </Modal>

          <h5 className="frame-heading">End</h5>
          <div className="frame-wrap">
            <div className="demo">
              <Button onClick={toggleEndSm} variant="default" className="waves-effect">
                Small
              </Button>
              <Button onClick={toggleEnd} variant="default" className="waves-effect">
                Normal
              </Button>
              <Button onClick={toggleEndLg} variant="default" className="waves-effect">
                Large
              </Button>
              <Button onClick={toggleEndXl} variant="default" className="waves-effect">
                XL
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Start</h5>
          <div className="frame-wrap">
            <div className="demo">
              <Button onClick={toggleStartSm} variant="default" className="waves-effect">
                Small
              </Button>
              <Button onClick={toggleStart} variant="default" className="waves-effect">
                Normal
              </Button>
              <Button onClick={toggleStartLg} variant="default" className="waves-effect">
                Large
              </Button>
              <Button onClick={toggleStartXl} variant="default" className="waves-effect">
                XL
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Top &amp; Bottom</h5>
          <div className="frame-wrap">
            <div className="demo">
              <Button onClick={toggleTop} variant="default" className="waves-effect">
                Top
              </Button>
              <Button onClick={toggleBottom} variant="default" className="waves-effect">
                Bottom
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
export const Modifications = () => {
  const [isFullscreenOpen, toggleFullscreen] = useToggle(false);
  const [isAlertOpen, toggleAlert] = useToggle(false);
  const [isAlertAltOpen, toggleAlertAlt] = useToggle(false);
  const [isNoBackdropOpen, toggleNoBackdrop] = useToggle(false);
  const [isStaticBackdropOpen, toggleStaticBackdrop] = useToggle(false);
  return <ComponentCard title={<h2>
          Modifications
          <span className="fw-300">
            <i>for modals</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Modal fullscreen uses combination of utility classes and the modifier class <code>.modal-fullscreen</code>. Using the modifer class{' '}
            <code>.modal-backdrop-transparent</code> makes the backdrop transparent. You can also translate the modals to cast as an alert by using
            the modifier class <code>.modal-alert</code>
          </div>
          <h5 className="frame-heading">Fullscreen</h5>
          <div className="frame-wrap">
            <Button onClick={toggleFullscreen} variant="default" className="waves-effect" size="lg">
              Modal Fullscreen
            </Button>
          </div>

          <Modal fullscreen show={isFullscreenOpen} onHide={toggleFullscreen}>
            <ModalHeader closeButton>
              <ModalTitle as="h1" className="fs-4">
                Full screen modal
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p>
                Another override is the option to pop up a modal that covers the user viewport, available via modifier classes that are placed on a{' '}
                <code>.modal-dialog</code>.
              </p>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>.modal-fullscreen</code>
                      </td>
                      <td>Always</td>
                    </tr>
                    <tr>
                      <td>
                        <code>.modal-fullscreen-sm-down</code>
                      </td>
                      <td>
                        <code>576px</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>.modal-fullscreen-md-down</code>
                      </td>
                      <td>
                        <code>768px</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>.modal-fullscreen-lg-down</code>
                      </td>
                      <td>
                        <code>992px</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>.modal-fullscreen-xl-down</code>
                      </td>
                      <td>
                        <code>1200px</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>.modal-fullscreen-xxl-down</code>
                      </td>
                      <td>
                        <code>1400px</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={toggleFullscreen}>
                Close
              </Button>
            </ModalFooter>
          </Modal>

          <h5 className="frame-heading">Alert</h5>
          <div className="frame-wrap">
            <div className="demo">
              <Button onClick={toggleAlert} variant="default" className="waves-effect d-flex-inline align-items-center">
                <i className="sa sa-bell me-1" />
                Modal Alert (with sound)
              </Button>
              <Button onClick={toggleAlertAlt} variant="default" className="waves-effect d-flex-inline align-items-center">
                Modal Alert Alt
              </Button>
            </div>
          </div>

          <Modal dialogClassName="modal-alert" fade contentClassName="bg-dark bg-opacity-75 shadow-5 border-left-0 border-right-0" show={isAlertOpen} onHide={toggleAlert} centered>
            <ModalHeader closeButton className="border-bottom-0">
              <ModalTitle as="h5">
                <svg className="sa-icon me-2 sa-icon-warning sa-icon-2x sa-bold">
                  <use href={`${basePath}/icons/sprite.svg#alert-triangle`} />
                </svg>
                Big Modal Alert
              </ModalTitle>
            </ModalHeader>
            <ModalBody className="border-bottom-0 fw-300 fs-sm">
              <span className="fw-bold">Warning:</span> With a bold stern warning message to get your attention.
            </ModalBody>
            <ModalFooter className="border-top-0">
              <Button variant="light" onClick={toggleAlert} className="waves-effect">
                Close
              </Button>
              <Button variant="warning" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal dialogClassName="modal-alert" contentClassName="bg-success bg-opacity-75 border-left-0 border-right-0" show={isAlertAltOpen} onHide={toggleAlertAlt} centered>
            <ModalHeader className="border-bottom-0" closeButton>
              <ModalTitle as="h5">Modal title</ModalTitle>
            </ModalHeader>
            <ModalBody className="border-bottom-0">We use bootstrap utilities to create a cutomized alert modal</ModalBody>
            <ModalFooter className="border-top-0">
              <Button variant="secondary" onClick={toggleAlertAlt}>
                Cancel
              </Button>
              <Button variant="danger">Delete</Button>
            </ModalFooter>
          </Modal>

          <h5 className="frame-heading">No backdrops</h5>
          <div className="frame-wrap">
            <Button onClick={toggleNoBackdrop} variant="default" className="waves-effect">
              Modal No Backdrop
            </Button>
          </div>

          <Modal backdrop={false} show={isNoBackdropOpen} onHide={toggleNoBackdrop} centered size="lg">
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal title</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="alert alert-danger">Notice how there is no backdrop to this modal.</div>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" className="waves-effect" onClick={toggleNoBackdrop}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <h5 className="frame-heading">Static backdrop</h5>
          <div className="frame-wrap">
            <Button onClick={toggleStaticBackdrop} variant="default" className="waves-effect">
              Modal Static Backdrop
            </Button>
          </div>

          <Modal backdrop="static" keyboard={false} show={isStaticBackdropOpen} onHide={toggleStaticBackdrop} centered size="lg">
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal Static Backdrop</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="alert alert-danger">Notice how there is a static backdrop to this modal.</div>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" className="waves-effect" onClick={toggleStaticBackdrop}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </ComponentCard>;
};
export const TransparentModal = () => {
  const [isDefaultTransOpen, toggleDefaultTrans] = useToggle(false);
  const [isCenteredTransOpen, toggleCenteredTrans] = useToggle(false);
  const [isStartTransOpen, toggleStartTrans] = useToggle(false);
  const [isEndTransOpen, toggleEndTrans] = useToggle(false);
  const [isTopTransOpen, toggleTopTrans] = useToggle(false);
  const [isBottomTransOpen, toggleBottomTrans] = useToggle(false);
  return <ComponentCard title={<h2>
          Transparent
          <span className="fw-300">
            <i>Modal (Tinted)</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Give modals a 'transparent tinted glass' feel using only utility classes.</div>

          <Modal dialogClassName="modal-dialog-top" contentClassName="bg-dark bg-opacity-75 shadow-5" show={isTopTransOpen} onHide={toggleTopTrans}>
            <ModalBody>
              <Alert variant="primary" className="bg-primary border-primary text-primary border-opacity-50 bg-opacity-10 m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
          </Modal>

          <Modal dialogClassName="modal-dialog-bottom" contentClassName="bg-dark bg-opacity-75 shadow-5" show={isBottomTransOpen} onHide={toggleBottomTrans}>
            <ModalBody>
              <Alert variant="warning" className="bg-warning border-warning text-warning border-opacity-50 bg-opacity-10 m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
          </Modal>

          <Modal dialogClassName="modal-dialog-end" size="sm" contentClassName="bg-dark bg-opacity-75 shadow-5" show={isEndTransOpen} onHide={toggleEndTrans}>
            <ModalHeader className="border-bottom-0" closeButton>
              <ModalTitle as="h4" className="text-white">
                Transparent End
                <small className="m-0 text-white opacity-70">Below is a static modal example</small>
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="danger" className="bg-danger border-danger text-danger border-opacity-50 bg-opacity-10">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter className="border-top-0">
              <Button variant="secondary" className="waves-effect" onClick={toggleEndTrans}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal dialogClassName="modal-dialog-start" size="sm" contentClassName="bg-dark bg-opacity-75 shadow-5" show={isStartTransOpen} onHide={toggleStartTrans}>
            <ModalHeader className="border-bottom-0" closeButton>
              <ModalTitle as="h5" className="text-white">
                Large start side modal
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="danger" className="bg-danger border-danger text-danger border-opacity-50 bg-opacity-10 m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter className="border-top-0">
              <Button variant="secondary" className="waves-effect" onClick={toggleStartTrans}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal centered contentClassName="bg-dark bg-opacity-75 shadow-5" show={isCenteredTransOpen} onHide={toggleCenteredTrans}>
            <ModalHeader className="border-bottom-0" closeButton>
              <ModalTitle as="h4" className="text-white">
                Transparent Centered
                <small className="m-0 text-white opacity-70">Below is a static modal example</small>
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="success" className="bg-success border-success text-success border-opacity-50 bg-opacity-10 m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter className="border-top-0">
              <Button variant="secondary" className="waves-effect" onClick={toggleCenteredTrans}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <Modal contentClassName="bg-dark bg-opacity-75 shadow-5" show={isDefaultTransOpen} onHide={toggleDefaultTrans}>
            <ModalHeader className="border-bottom-0" closeButton>
              <ModalTitle as="h4" className="text-white">
                Transparent Default
                <small className="m-0 text-white opacity-70">Below is a static modal example</small>
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Alert variant="success" className="bg-success border-success text-success border-opacity-50 bg-opacity-10 m-0">
                This is the content area of the modal.
              </Alert>
            </ModalBody>
            <ModalFooter className="border-top-0">
              <Button variant="secondary" className="waves-effect" onClick={toggleDefaultTrans}>
                Close
              </Button>
              <Button variant="primary" className="waves-effect">Save changes</Button>
            </ModalFooter>
          </Modal>

          <h5 className="frame-heading">Default</h5>
          <div className="frame-wrap">
            <div className="demo">
              <Button onClick={toggleDefaultTrans} variant="dark" className="waves-effect">
                Default
              </Button>
              <Button onClick={toggleCenteredTrans} variant="dark" className="waves-effect">
                Centered
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Start &amp; End</h5>
          <div className="frame-wrap">
            <div className="demo">
              <Button onClick={toggleStartTrans} variant="dark" className="waves-effect">
                Start
              </Button>
              <Button onClick={toggleEndTrans} variant="dark" className="waves-effect">
                End
              </Button>
            </div>
          </div>
          <h5 className="frame-heading">Top &amp; Bottom</h5>
          <div className="frame-wrap">
            <div className="demo">
              <Button onClick={toggleTopTrans} variant="dark" className="waves-effect">
                Top
              </Button>
              <Button onClick={toggleBottomTrans} variant="dark" className="waves-effect">
                Bottom
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>;
};