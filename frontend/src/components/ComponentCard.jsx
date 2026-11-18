'use client';

import { basePath } from '@/helpers';
import clsx from 'clsx';
import { useState } from 'react';
import { Alert, Button, Collapse, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useToggle } from 'usehooks-ts';
const ComponentCard = ({
  children,
  panelLocked,
  title,
  containerClass,
  toolbar,
  toolbox,
  isRefreshable,
  simpleDots,
  showToggleBtn = true,
  showFullscreenBtn = true,
  showCloseBtn = true
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, modalToggle] = useToggle(false);
  const [fullShow, fullToggle] = useToggle(false);
  const [isRefreshing, refreshToggle] = useToggle(false);
  const handleClose = () => {
    setIsVisible(false);
  };
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleRefresh = () => {
    refreshToggle();
    setTimeout(() => {
      refreshToggle();
    }, 2000);
  };
  if (!isVisible) return null;
  return <div id="panel-2" className={clsx(`panel panel-icon ${fullShow && 'panel-fullscreen'} `, {
    'panel-locked': panelLocked
  }, {
    'panel-refreshing': isRefreshing
  })}>
      <div className="panel-hdr">
        {title}

        {isRefreshable && <div className="panel-toolbar">
            <button type="button" className="btn btn-xs btn-outline-default waves-effect waves-themed" data-action="panel-refresh" data-refresh-duration="2000" data-refresh-callback="loadRandomGraph" onClick={handleRefresh}>
              Refresh
            </button>
          </div>}

        {simpleDots && <div className="panel-toolbar d-flex align-items-center">
            {showToggleBtn && <OverlayTrigger overlay={<Tooltip>Toggle</Tooltip>}>
                <span className="rounded-circle" onClick={handleToggle} style={{
            width: '16px',
            marginLeft: '4px',
            height: '16px',
            opacity: '.8',
            backgroundColor: '#1dc9b7',
            cursor: 'pointer'
          }} />
              </OverlayTrigger>}

            {showFullscreenBtn && <OverlayTrigger overlay={<Tooltip>Fullscreen</Tooltip>}>
                <span className="rounded-circle" onClick={fullToggle} style={{
            width: '16px',
            marginLeft: '4px',
            height: '16px',
            opacity: '.8',
            backgroundColor: '#fcc266',
            cursor: 'pointer'
          }} />
              </OverlayTrigger>}

            {showCloseBtn && <OverlayTrigger overlay={<Tooltip>Close</Tooltip>}>
                <span className="rounded-circle" onClick={modalToggle} style={{
            width: '16px',
            marginLeft: '4px',
            height: '16px',
            opacity: '.8',
            backgroundColor: '#fc5a8d',
            cursor: 'pointer'
          }} />
              </OverlayTrigger>}
          </div>}

        {toolbox && !simpleDots && <div className="panel-toolbar">
            {showToggleBtn && <OverlayTrigger overlay={<Tooltip>Toggle</Tooltip>}>
                <button type="button" onClick={handleToggle} className="btn btn-panel" data-action="panel-collapse">
                  <svg className="sa-icon">
                    {isCollapsed ? <use className="panel-expand-icon d-block" href={`${basePath}/icons/sprite.svg#plus-circle`} /> : <use className="panel-collapsed-icon" href={`${basePath}/icons/sprite.svg#minus-circle`} />}
                  </svg>
                </button>
              </OverlayTrigger>}

            {showFullscreenBtn && <OverlayTrigger overlay={<Tooltip>Fullscreen</Tooltip>}>
                <button type="button" onClick={fullToggle} className="btn btn-panel" data-action="panel-fullscreen">
                  <svg className="sa-icon">
                    <use href={`${basePath}/icons/sprite.svg#stop-circle`} />
                  </svg>
                </button>
              </OverlayTrigger>}

            {showCloseBtn && <OverlayTrigger overlay={<Tooltip>Close</Tooltip>}>
                <button type="button" onClick={modalToggle} className="btn btn-panel" data-action="panel-close">
                  <svg className="sa-icon">
                    <use href={`${basePath}/icons/sprite.svg#x-circle`} />
                  </svg>
                </button>
              </OverlayTrigger>}
          </div>}
        {toolbar && !simpleDots && <div className="panel-toolbar">{toolbar}</div>}
      </div>
      <Collapse in={!isCollapsed}>
        <div className={clsx('panel-container', containerClass)}>{children}</div>
      </Collapse>

      <Modal show={showModal} contentClassName={'bg-dark bg-opacity-50 shadow-5 translucent-dark'} centered onHide={modalToggle} className="bg-dark bg-opacity-50 shadow-5 translucent-dark" aria-hidden="true">
        <ModalHeader className="border-bottom-0">
          <ModalTitle as={'h4'} className="text-white d-flex align-items-center">
            Delete Panel?
          </ModalTitle>
          <button type="button" onClick={modalToggle} className="btn btn-system btn-system-light ms-auto" data-bs-dismiss="modal" aria-label="Close">
            <svg className="sa-icon sa-icon-2x">
              <use href={`${basePath}/icons/sprite.svg#x`} />
            </svg>
          </button>
        </ModalHeader>
        <ModalBody>
          <Alert variant="danger" className="bg-danger border-danger text-white border-opacity-50 bg-opacity-10 mb-0">
            Are you sure you want to delete this panel?
          </Alert>
        </ModalBody>
        <ModalFooter className="border-top-0">
          <Button variant="light" onClick={modalToggle} className="waves-effect" data-bs-dismiss="modal">
            No, cancel
          </Button>
          <Button variant="danger" onClick={handleClose} className="waves-effect" id="confirmPanelDelete">
            Yes, delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>;
};
export default ComponentCard;