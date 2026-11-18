import Link from 'next/link'
import { Button, Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar } from 'react-bootstrap'

type LeftSidePanelProps = {
  onComposeClick: () => void
  isOpen: boolean
  onClose: (e: React.MouseEvent) => void
}

const EmailSidebar = ({ onComposeClick, isOpen, onClose }: LeftSidePanelProps) => {
  return (
    <>
      <div
        id="js-slide-left"
        className={`flex-wrap flex-shrink-0 position-relative slide-on-mobile slide-on-mobile-left ${isOpen ? 'slide-on-mobile-left-show' : ''}`}
        style={isOpen ? { zIndex: 999 } : {}}>
        <div className="position-absolute top-0 bottom-0 w-100">
          <div className="d-flex h-100 flex-column px-2">
            <div className="px-4 py-3 align-items-center">
              <div className="btn-group btn-group-sm w-100" role="group" aria-label="Button group with nested dropdown">
                <Button variant="danger" onClick={onComposeClick} className="fs-lg waves-effect waves-themed">
                  Compose
                </Button>
                <Dropdown className="btn-group" role="group">
                  <DropdownToggle as={'button'} id="btnGroupDrop1" className="btn btn-danger px-2 js-waves-off" />
                  <DropdownMenu className="p-0">
                    <DropdownItem>Work group A</DropdownItem>
                    <DropdownItem>New page</DropdownItem>
                    <DropdownItem>Edit signature</DropdownItem>
                    <DropdownDivider className="m-0" />
                    <DropdownItem>
                      <i className="fas fa-plus width-1" /> Add more
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div className="flex-grow-1 px-4">
              <Link className="dropdown-item fw-bold d-flex justify-content-between rounded-pill p-2 fw-600" href="/email/systemmail">
                <div>
                  <i className="fas fa-folder-open width-1" />
                  Inbox
                </div>
                <div className="fw-normal badge bg-primary align-self-center rounded-circle if-empty-display-none">7</div>
              </Link>
              <Link className="dropdown-item d-flex justify-content-between rounded-pill p-2" href="/email/systemmail">
                <div>
                  <i className="fas fa-star width-1" />
                  Starred
                </div>
                <div className="fw-normal badge bg-primary align-self-center rounded-circle if-empty-display-none" />
              </Link>
              <Link className="dropdown-item d-flex justify-content-between rounded-pill p-2" href="/email/systemmail">
                <div>
                  <i className="fas fa-edit width-1" />
                  Drafts
                </div>
                <div className="fw-normal badge bg-primary align-self-center rounded-circle if-empty-display-none">5</div>
              </Link>
              <Link className="dropdown-item d-flex justify-content-between rounded-pill p-2" href="/email/systemmail">
                <div>
                  <i className="fas fa-paper-plane width-1" />
                  Sent
                </div>
                <div className="fw-normal badge bg-primary align-self-center rounded-circle if-empty-display-none" />
              </Link>
              <Link className="dropdown-item d-flex justify-content-between rounded-pill p-2" href="/email/systemmail">
                <div>
                  <i className="fas fa-trash width-1" />
                  Trash
                </div>
                <div className="fw-normal badge bg-primary align-self-center rounded-circle if-empty-display-none" />
              </Link>
              <Link className="dropdown-item d-flex justify-content-between rounded-pill p-2" href="/email/systemmail">
                <div>
                  <i className="fas fa-exclamation-triangle width-1" />
                  Junk
                </div>
                <div className="fw-normal badge bg-primary align-self-center rounded-circle if-empty-display-none" />
              </Link>
            </div>
            <div className="px-4 fs-xs py-3 fw-300">
              1.5 GB (10%) of 15 GB used
              <ProgressBar className="mt-1" style={{ height: 7 }}>
                <ProgressBar now={11} min={0} max={100} className="bg-primary" role="progressbar" style={{ height: 7 }} />
              </ProgressBar>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="slide-backdrop"
          onClick={onClose}
          style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998, background: 'rgba(0,0,0,0.4)' }}
        />
      )}
    </>
  )
}

export default EmailSidebar
