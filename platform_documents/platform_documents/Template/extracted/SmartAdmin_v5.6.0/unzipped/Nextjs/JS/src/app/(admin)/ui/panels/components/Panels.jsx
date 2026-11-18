'use client';

import ComponentCard from '@/components/ComponentCard';
import { basePath } from '@/helpers';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle, FormControl, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, OverlayTrigger, Tooltip } from 'react-bootstrap';
export const DefaultPanel = () => {
  return <ComponentCard title={<h2>
          Blank
          <span className="fw-light">
            <i>Panel</i>
          </span>
        </h2>}>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">All panels needs to have an unique ID in order to use the panel sorting funtions.</div>
          <p className="mb-0">Panel content goes here...</p>
        </div>
      </div>
    </ComponentCard>;
};
export const FormInput = () => {
  return <ComponentCard title={<h2>
          Form
          <span className="fw-light">
            <i>Inputs</i>
          </span>
        </h2>} toolbar={<>
          <FormSelect className="form-select-sm">
            <option defaultChecked>Select</option>
            <option value={1}>One</option>
            <option value={2}>Two</option>
            <option value={3}>Three</option>
          </FormSelect>
          <div className="d-flex position-relative ms-auto width-sm">
            <svg className="sa-icon sa-icon-1x translate-middle position-absolute top-50 ms-3">
              <use href={`${basePath}/icons/sprite.svg#search`} />
            </svg>
            <FormControl type="text" className="form-control-sm" placeholder="Search" style={{
        paddingLeft: '1.7rem'
      }} />
          </div>
        </>}>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            You can add form inputs to <code>.panel-hdr</code> with moderation. Adding too many elements may break the design on mobile viewport
          </div>
        </div>
      </div>
    </ComponentCard>;
};
export const IconPanel = () => {
  const [useSimpleDots, setUseSimpleDots] = useState(true);
  const handleToggleIconStyle = () => {
    setUseSimpleDots(prev => !prev);
  };
  return <ComponentCard title={<h2>
          Classic
          <span className="fw-light">
            <i>Icons</i>
          </span>
        </h2>} simpleDots={useSimpleDots} toolbox={!useSimpleDots} showToggleBtn={true} showFullscreenBtn={true} showCloseBtn={true}>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Looking for a less cluttered panel? Add <code>.panel-icon</code> class to your <code>.panel</code> to remove panel buttons and keep only
            the icons.
          </div>

          <Button variant="outline-secondary" className="waves-effect" onClick={handleToggleIconStyle}>
            Switch to {useSimpleDots ? 'Toolbox Style' : 'Simple Dots Style'}
          </Button>
        </div>
      </div>
    </ComponentCard>;
};
export const getRandomGraphUrl = () => {
  const chartConfig = {
    type: 'bar',
    data: {
      labels: ['A', 'B', 'C', 'D', 'E', 'F'],
      datasets: [{
        label: 'Random Data',
        data: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        backgroundColor: ['rgba(33, 150, 243, 0.5)', 'rgba(29, 201, 183, 0.5)', 'rgba(170, 134, 209, 0.5)', 'rgba(255, 194, 65, 0.5)', 'rgba(253, 57, 149, 0.5)', 'rgba(158, 158, 158, 0.5)'],
        borderColor: ['rgba(33, 150, 243, 1)', 'rgba(29, 201, 183, 1)', 'rgba(170, 134, 209, 1)', 'rgba(255, 194, 65, 1)', 'rgba(253, 57, 149, 1)', 'rgba(158, 158, 158, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
  const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
  return `https://quickchart.io/chart?c=${encodedConfig}`;
};
export const RefreshPanel = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [lastRefresh, setLastRefresh] = useState('');
  const handleRefreshGraph = useCallback(() => {
    setImageUrl(getRandomGraphUrl());
    setLastRefresh(`Last update: ${new Date().toLocaleTimeString()}`);
  }, []);
  useEffect(() => {
    handleRefreshGraph();
  }, [handleRefreshGraph]);
  return <ComponentCard title={<h2>
          Panel
          <span className="fw-light">
            <i>Refresh</i>
          </span>
        </h2>} isRefreshable={true}>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Refresh panels with a simple button. Use the <code>data-action="panel-refresh"</code> to activate the refresh feature. The
            <code>data-refresh-duration</code> attribute sets the refresh interval and the <code>data-refresh-callback="functionName"</code> attribute
            sets the callback function.
          </div>

          <div className="d-flex align-items-center justify-content-center my-4" style={{
          minHeight: '200px'
        }}>
            {imageUrl && <img src={imageUrl} alt="Random Colorful Bar Graph" style={{
            maxWidth: '100%',
            width: 350,
            height: 200,
            objectFit: 'contain'
          }} />}
          </div>

          <div className="d-flex justify-content-between align-items-end mt-3">
            <span className="js-last-refresh fs-xs text-muted">{lastRefresh || 'Loading...'}</span>
            <Button variant="outline-secondary" onClick={handleRefreshGraph}>
              Refresh Panel
            </Button>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
export const InsertIcon = () => {
  return <ComponentCard title={<h2>
          <svg className="sa-icon panel-icon">
            <use href={`${basePath}/icons/sprite.svg#package`} />
          </svg>
          Insert
          <span className="fw-light">
            <i>Icon</i>
          </span>
        </h2>} toolbar={<>
          <div className="progress bg-warning-200 width-sm">
            <div className="progress-bar bg-info-700 progress-bar-striped progress-bar-animated fw-700" role="progressbar" style={{
        width: '75%'
      }} aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
              75%
            </div>
          </div>
        </>}>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Insert sleek icons—with over
            <a href="" target="_blank">
              2,500 options
            </a>
            to choose from—and dynamic progress bars to bring your panel to life, making data clearer, faster, and more engaging than ever! You can
            also add stylish progress bars to enhance your design.
          </div>
        </div>
        <div className="panel-content py-2 rounded-bottom border-faded border-start-0 border-end-0 border-bottom-0 text-muted">
          <div className="progress progress-sm w-100 shadow-inset-2">
            <div className="progress-bar bg-info-300 bg-info-gradient" role="progressbar" style={{
            width: '75%'
          }} aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </div>
      </div>
    </ComponentCard>;
};
export const PanelPills = () => {
  return <ComponentCard title={<h2>
          Panel
          <span className="fw-light">
            <i>Locked</i>
          </span>
        </h2>} panelLocked>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            This panel is locked from drag and drop. We use the class <code>.panel-locked</code> to lock the panel. Go ahead and try to drag it, it
            won't budge!
          </div>
          <button type="button" className="btn btn-outline-secondary me-2" data-action="panel-toggle" data-panel-toggle="panel-locked">
            <span className="panel-locked-text">
              <i className="sa sa-lock me-1" /> Unlock panel
            </span>
            <span className="panel-unlock-text">
              <i className="sa sa-lock-open me-1" /> Lock panel
            </span>
          </button>
          <a href="" data-action="panel-reset">
            Reset panel
          </a>
          will also unlock the panel.
        </div>
      </div>
    </ComponentCard>;
};
export const PanelTabs = () => {
  const [loopStep, setLoopStep] = useState(0);
  const handleNextLoopStep = () => {
    setLoopStep(prevStep => (prevStep + 1) % 3);
  };
  const getTabClass = () => {
    if (loopStep === 1) {
      return 'nav-tabs-clean';
    }
    return '';
  };
  return <div id="panel-12" className="panel panel-icon">
      <div className="panel-hdr border-bottom">
        <h2>
          Panel
          <span className="fw-light">
            <i>Tabs</i>
          </span>
        </h2>
        <div className="panel-toolbar pr-3 align-self-end">
          <ul id="demo_panel-tabs" className={`nav nav-tabs border-bottom-0 js-demo-panel-tabs ${getTabClass()}`} role="tablist">
            <li className="nav-item">
              <a className="nav-link active" data-bs-toggle="tab" href="#tab_default-1" role="tab">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#tab_default-2" role="tab">
                Set
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" data-bs-toggle="tab" href="#" role="tab">
                Disabled
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              You can easily add <code>.nav-tabs</code> to <code>.panel-hdr</code>, consider adding dropdown panel button if you have a lot of panel
              tabs. Check out the Tabs &amp; pills page for more details
            </p>
          </div>

          <div id="js_change_tab_direction" className="btn-group" role="group" aria-label="Loop tab layout navigation style selection">
            <button type="button" className={`btn btn-sm ${loopStep === 0 || loopStep === 2 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={handleNextLoopStep}>
              Default {loopStep === 2 && ''}
            </button>

            <button type="button" className={`btn btn-sm ${loopStep === 1 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={handleNextLoopStep}>
              Clean
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export const PanelButtons = () => {
  return <ComponentCard title={<h2>
          Panel
          <span className="fw-light">
            <i>Buttons</i>
          </span>
        </h2>} toolbar={<Dropdown className="btn-group">
          <button type="button" className="btn btn-sm btn-outline-secondary">
            Small split button
          </button>
          <DropdownToggle as={'button'} className="btn btn-sm btn-outline-secondary dropdown-toggle-split">
            <span className="visually-hidden">Toggle Dropdown</span>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Action</DropdownItem>
            <DropdownItem>Another action</DropdownItem>
            <DropdownItem>Something else here</DropdownItem>
            <DropdownDivider />
            <DropdownItem>Separated link</DropdownItem>
          </DropdownMenu>
        </Dropdown>}>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            Add panel buttons to <code>.panel-hdr</code> and footer area. Keep in mind of your panel title size as distortion can occur with too many
            buttons overflowing.
          </div>
        </div>
        <div className="panel-content py-2 rounded-bottom bg-faded border-faded border-start-0 border-end-0 border-bottom-0 text-muted d-flex">
          <ul className="pagination pagination-sm justify-content-start mb-0">
            <li className="page-item disabled">
              <a className="page-link">Prev</a>
            </li>
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
            <li className="page-item">
              <a className="page-link" href="#">
                Next
              </a>
            </li>
          </ul>
        </div>
      </div>
    </ComponentCard>;
};
export const FormElements = () => {
  return <ComponentCard title={<h2>
          Form
          <span className="fw-light">
            <i>elements</i>
          </span>
        </h2>} toolbar={<div className="form-check form-check-reverse form-switch mb-0">
          <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
            Panel switch
          </label>
        </div>}>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            You can add form elements to <code>.panel-hdr</code> and any other parts of the <code>.panel</code>
          </div>
        </div>
        <div className="panel-content py-2 rounded-bottom border-faded border-end-0 border-start-0 border-bottom-0 text-muted d-flex">
          <div className="form-check mb-0">
            <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Panel checkbox
              <label></label>
            </label>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
export const LabelPanel = () => {
  return <ComponentCard title={<h2>
          Label
          <span className="fw-light">
            <i>Panel</i>
          </span>
          <sup>
            <span className="badge text-bg-warning ms-2">sup</span>
          </sup>
        </h2>} toolbar={<div className="panel-toolbar">
          <span className="badge text-bg-primary fw-400">Panel Badge</span>
        </div>}>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            You may place badge inside <code>.panel-toolbar</code>, <code>.panel-content</code> and <code>.panel-hdr</code>. Check out the <br />
            <a href="/ui/badges" target="_blank">
              badges page&nbsp;
            </a>
            to learn more about badges
          </div>
        </div>

        <div className="panel-content py-2 rounded-bottom border-faded border-left-0 border-right-0 border-bottom-0 text-muted d-flex" style={{
        gap: 5
      }}>
          <span className="badge text-bg-danger">Footer badge</span>
          <span className="badge rounded-pill text-bg-success">Pill badge</span>
          <span className="badge rounded-pill rounded-circle text-bg-secondary ms-auto">1</span>
          <span className="badge text-bg-warning px-1">22</span>
        </div>
      </div>
    </ComponentCard>;
};
export const MasterButton = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [panelStyleClass, setPanelStyleClass] = useState('');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTimestamp, setRefreshTimestamp] = useState('6/26/2026, 11:08:46 AM');
  const handleRefreshAction = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setRefreshTimestamp(now.toLocaleString('en-US'));
    }, 2000);
  };
  if (!isPanelVisible) return null;
  return <div id="panel-7" className={`panel panel-icon ${isFullscreen ? 'panel-fullscreen' : ''} ${isLocked ? 'panel-locked' : ''} ${isRefreshing ? 'panel-refreshing' : ''} ${isPanelCollapsed ? 'panel-collapsed' : ''}`}>
      <div className={`panel-hdr ${panelStyleClass}`}>
        <h2>
          Master
          <span className="fw-light">
            <i>Button</i>
          </span>
        </h2>

        <div className="panel-toolbar">
          <OverlayTrigger placement="top" overlay={<Tooltip id="toggle-tooltip">Toggle</Tooltip>}>
            <button type="button" className="btn btn-panel" onClick={() => setIsPanelCollapsed(!isPanelCollapsed)} data-action="panel-collapse">
              <svg className="sa-icon">
                {isPanelCollapsed ? <use className="panel-expand-icon d-block" href={`${basePath}/icons/sprite.svg#plus-circle`} /> : <use className="panel-collapsed-icon" href={`${basePath}/icons/sprite.svg#minus-circle`} />}
              </svg>
            </button>
          </OverlayTrigger>

          <Dropdown className="panel-toolbar d-inline-block">
            <DropdownToggle as="button" className="btn btn-toolbar-master px-0 waves-effect border-0 bg-transparent content-none">
              <i className="ellipsis-icon" />
            </DropdownToggle>

            <DropdownMenu align="end" className="dropdown-menu-animated rounded-top rounded-bottom p-0">
              <DropdownItem as="button" type="button" onClick={handleRefreshAction}>
                <span data-i18n="drpdwn.refreshpanel">Refresh Content</span>
              </DropdownItem>

              <DropdownItem as="button" type="button" onClick={() => setIsLocked(!isLocked)}>
                {isLocked ? <span data-i18n="drpdwn.lockpanel" className="panel-locked-text">
                    Unlock panel
                  </span> : <span data-i18n="drpdwn.unlockpanel" className="panel-unlock-text">
                    Lock panel
                  </span>}
              </DropdownItem>

              <div className="dropdown-multilevel dropdown-multilevel-left">
                <div className="dropdown-item d-flex justify-content-between align-items-center">
                  <span data-i18n="drpdwn.panelcolor">Panel Style</span>
                  <i className="sa sa-chevron-right" />
                </div>
                <div className="dropdown-menu">
                  <div className="d-flex flex-wrap align-items-center justify-content-center px-2 py-1 width-sm gap-1">
                    {['bg-primary-700 bg-success-gradient', 'bg-primary-500 bg-info-gradient', 'bg-primary-600 bg-primary-gradient', 'bg-info-600 bg-primray-gradient', 'bg-info-600 bg-info-gradient', 'bg-info-700 bg-success-gradient', 'bg-success-900 bg-info-gradient', 'bg-success-700 bg-primary-gradient', 'bg-success-600 bg-success-gradient', 'bg-danger-900 bg-info-gradient', 'bg-fusion-400 bg-fusion-gradient', 'bg-faded'].map((styleString, index) => <OverlayTrigger key={index} placement="top" overlay={<Tooltip id={`style-tt-${index}`}>Apply Theme</Tooltip>}>
                        <button type="button" className={`btn d-inline-block ${styleString} width-2 height-2 p-0 rounded-0 hover-effect-dot`} onClick={() => setPanelStyleClass(styleString)} />
                      </OverlayTrigger>)}
                  </div>
                </div>
              </div>

              <div className="dropdown-multilevel dropdown-multilevel-left">
                <div className="dropdown-item d-flex justify-content-between align-items-center">
                  <span data-i18n="drpdwn.actions">Actions</span>
                  <i className="sa sa-chevron-right" />
                </div>
                <div className="dropdown-menu">
                  <DropdownItem as="button" type="button" className="px-3" onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}>
                    <div className="d-flex align-items-center">
                      <svg className="sa-icon sa-icon-success me-2">
                        {isPanelCollapsed ? <use className="panel-expand-icon d-block" href={`${basePath}/icons/sprite.svg#plus-circle`} /> : <use className="panel-collapsed-icon" href={`${basePath}/icons/sprite.svg#minus-circle`} />}
                      </svg>
                      Toggle
                    </div>
                  </DropdownItem>
                  <DropdownItem as="button" type="button" className="px-3" onClick={() => setIsFullscreen(!isFullscreen)}>
                    <div className="d-flex align-items-center">
                      <svg className="sa-icon sa-icon-warning me-2">
                        <use href={`${basePath}/icons/sprite.svg#stop-circle`} />
                      </svg>
                      Fullscreen
                    </div>
                  </DropdownItem>
                  <DropdownItem as="button" type="button" className="px-3 text-danger" onClick={() => setIsPanelVisible(false)}>
                    <div className="d-flex align-items-center">
                      <svg className="sa-icon sa-icon-danger me-2">
                        <use href={`${basePath}/icons/sprite.svg#x-circle`} />
                      </svg>
                      Close
                    </div>
                  </DropdownItem>
                </div>
              </div>

              <DropdownItem as="button" type="button">
                <span data-i18n="drpdwn.custombutton">Custom Button</span>
              </DropdownItem>
              <DropdownItem as="button" type="button">
                <span data-i18n="drpdwn.iconstyle">Icon Style</span>
              </DropdownItem>
              <div className="dropdown-divider m-0" />
              <DropdownItem as="button" type="button" className="fw-500 text-danger" onClick={() => {
              setPanelStyleClass('');
              setIsLocked(false);
              setIsPanelCollapsed(false);
              setIsFullscreen(false);
            }}>
                <span data-i18n="drpdwn.resetpanel">Reset Panel</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {!isPanelCollapsed && <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              The <code>.btn-toolbar-master</code> class enhances <code>.panel-toolbar</code> by integrating dropdown functionality and additional
              actions while optimizing space. It supports icons, grouped actions, submenus, and input fields, making panels more interactive and
              organized.
            </div>
            <div className="d-flex">
              <div className="dropdown-menu dropdown-menu-end rounded-top rounded-bottom show position-relative border" style={{
            boxShadow: 'none',
            width: '10rem'
          }}>
                <button type="button" className="dropdown-item" onClick={handleRefreshAction} data-action="panel-refresh">
                  <span data-i18n="drpdwn.refreshpanel">Refresh Content</span>
                </button>
                <button type="button" className="dropdown-item" onClick={() => setIsLocked(!isLocked)} data-action="panel-toggle">
                  {isLocked ? <span data-i18n="drpdwn.lockpanel" className="panel-locked-text">
                      Unlock panel
                    </span> : <span data-i18n="drpdwn.unlockpanel" className="panel-unlock-text">
                      Lock panel
                    </span>}
                </button>
                <div className="dropdown-multilevel dropdown-multilevel-right">
                  <div className="dropdown-item d-flex justify-content-between align-items-center">
                    <span data-i18n="drpdwn.panelcolor">Panel Style</span>
                    <i className="sa sa-chevron-right" />
                  </div>
                  <div className="dropdown-menu">
                    <div className="d-flex flex-wrap align-items-center justify-content-center px-2 py-1 width-sm gap-1">
                      {['bg-primary-700 bg-success-gradient', 'bg-primary-500 bg-info-gradient', 'bg-primary-600 bg-primary-gradient', 'bg-info-600 bg-primray-gradient', 'bg-info-600 bg-info-gradient', 'bg-info-700 bg-success-gradient', 'bg-success-900 bg-info-gradient', 'bg-success-700 bg-primary-gradient', 'bg-success-600 bg-success-gradient', 'bg-danger-900 bg-info-gradient', 'bg-fusion-400 bg-fusion-gradient', 'bg-faded'].map((styleString, index) => <OverlayTrigger key={index} placement="top" overlay={<Tooltip id={`body-style-tt-${index}`}>Apply Theme</Tooltip>}>
                          <button type="button" className={`btn d-inline-block ${styleString} width-2 height-2 p-0 rounded-0 hover-effect-dot`} onClick={() => setPanelStyleClass(styleString)} />
                        </OverlayTrigger>)}
                    </div>
                  </div>
                </div>
                <div className="dropdown-multilevel dropdown-multilevel-right">
                  <div className="dropdown-item d-flex justify-content-between align-items-center">
                    <span data-i18n="drpdwn.actions">Actions</span>
                    <i className="sa sa-chevron-right" />
                  </div>
                  <div className="dropdown-menu">
                    <button type="button" className="dropdown-item px-3" onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}>
                      <div className="d-flex align-items-center">
                        <svg className="sa-icon sa-icon-success me-2">
                          {isPanelCollapsed ? <use className="panel-expand-icon d-block" href={`${basePath}/icons/sprite.svg#plus-circle`} /> : <use className="panel-collapsed-icon" href={`${basePath}/icons/sprite.svg#minus-circle`} />}
                        </svg>
                        Toggle
                      </div>
                    </button>
                    <button type="button" className="dropdown-item px-3" onClick={() => setIsFullscreen(!isFullscreen)}>
                      <div className="d-flex align-items-center">
                        <svg className="sa-icon sa-icon-warning me-2">
                          <use href={`${basePath}/icons/sprite.svg#stop-circle`} />
                        </svg>
                        Fullscreen
                      </div>
                    </button>
                    <button type="button" className="dropdown-item px-3 text-danger" onClick={() => setIsPanelVisible(false)}>
                      <div className="d-flex align-items-center">
                        <svg className="sa-icon sa-icon-danger me-2">
                          <use href={`${basePath}/icons/sprite.svg#x-circle`} />
                        </svg>
                        Close
                      </div>
                    </button>
                  </div>
                </div>
                <button type="button" className="dropdown-item">
                  <span data-i18n="drpdwn.custombutton">Custom Button</span>
                </button>
                <button type="button" className="dropdown-item">
                  <span data-i18n="drpdwn.iconstyle">Icon Style</span>
                </button>
                <div className="dropdown-divider m-0" />
                <button type="button" className="dropdown-item fw-500 text-danger" onClick={() => {
              setPanelStyleClass('');
              setIsLocked(false);
              setIsPanelCollapsed(false);
              setIsFullscreen(false);
            }}>
                  <span data-i18n="drpdwn.resetpanel">Reset Panel</span>
                </button>
              </div>
            </div>

            <div className="js-refreshed-content badge bg-primary mt-3">Refreshed content - {refreshTimestamp}</div>
          </div>
        </div>}
    </div>;
};
export const PanelColors = () => {
  const [panelStyleClass, setPanelStyleClass] = useState('');
  const themeColors = ['bg-primary-700 bg-success-gradient', 'bg-primary-500 bg-info-gradient', 'bg-primary-600 bg-primary-gradient', 'bg-info-600 bg-primray-gradient', 'bg-info-600 bg-info-gradient', 'bg-info-700 bg-success-gradient', 'bg-success-900 bg-info-gradient', 'bg-success-700 bg-primary-gradient', 'bg-success-600 bg-success-gradient', 'bg-danger-900 bg-info-gradient', 'bg-success-500 bg-danger-gradient', 'bg-success-300 bg-warning-gradient', 'bg-success-200 bg-fusion-gradient', 'bg-primary-800 bg-danger-gradient', 'bg-primary-400 bg-warning-gradient', 'bg-primary-300 bg-fusion-gradient', 'bg-info-500 bg-danger-gradient', 'bg-info-800 bg-warning-gradient', 'bg-info-200 bg-success-gradient', 'bg-danger-700 bg-primary-gradient', 'bg-danger-500 bg-info-gradient', 'bg-danger-300 bg-success-gradient', 'bg-warning-700 bg-primary-gradient', 'bg-warning-500 bg-info-gradient', 'bg-warning-300 bg-danger-gradient', 'bg-faded bg-primary-gradient', 'bg-faded bg-info-gradient', 'bg-faded bg-danger-gradient', 'bg-fusion-400 bg-fusion-gradient', 'bg-faded'];
  return <div id="panel-6" className="panel panel-icon">
      <div className={`panel-hdr ${panelStyleClass}`}>
        <h2>
          Panel
          <span className="fw-light">
            <i>Colors</i>
          </span>
        </h2>
        <div className="panel-toolbar"></div>
      </div>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">You can mix and match any color styles, below is what we were found to be an interesting match.</div>

          <div className="d-flex flex-wrap justify-content-evenly gap-2 mb-3">
            {themeColors.map((styleString, index) => <button key={index} type="button" className={`btn d-inline-block ${styleString} width-3 height-3 p-0 rounded-0 hover-effect-dot waves-effect`} onClick={() => setPanelStyleClass(styleString)} data-action="panel-style" data-panel-style={styleString} />)}
          </div>

          <div className="d-flex pt-3">
            <Button variant="outline-secondary" className="waves-effect" onClick={() => setPanelStyleClass('')} data-action="panel-reset">
              Reset Styles
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export const ClosePanel = () => {
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleOpenModal = () => setShowDeleteModal(true);
  const handleCloseModal = () => setShowDeleteModal(false);
  const handleConfirmDelete = () => {
    setIsPanelVisible(false);
    setShowDeleteModal(false);
  };
  if (!isPanelVisible) return null;
  return <>
      <ComponentCard title={<h2>
            Close
            <span className="fw-light">
              <i>Panel</i>
            </span>
          </h2>} toolbox showToggleBtn={false} showFullscreenBtn={false} showCloseBtn={true}>
        <div className="panel-container">
          <div className="panel-content">
            <div className="panel-tag">
              Panel is closed by using the attribute <code>data-action="panel-close"</code>, and can be placed anywhere inside <code>.panel</code>
            </div>
            <p>
              You can also place the collapse action inside the <code>.panel-content</code> as button or link
            </p>

            <Button variant="danger" className="me-2 waves-effect" onClick={handleOpenModal}>
              close button
            </Button>

            <Link href="" className="text-danger" onClick={e => {
            e.preventDefault();
            handleOpenModal();
          }}>
              close link
            </Link>
          </div>
        </div>
      </ComponentCard>

      <ClosePanelModal show={showDeleteModal} onHide={handleCloseModal} onConfirm={handleConfirmDelete} />
    </>;
};
export const ClosePanelModal = ({
  show,
  onHide,
  onConfirm
}) => {
  return <Modal show={show} onHide={onHide} centered contentClassName="bg-dark bg-opacity-50 shadow-5 translucent-dark border-0">
      <ModalHeader closeButton className="border-bottom-0">
        <ModalTitle as={'h4'} className="text-white d-flex align-items-center">
          Delete Panel?
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Alert variant="danger" className="bg-danger border-danger text-white border-opacity-50 bg-opacity-10 mb-0">
          You are about to delete <span className="fw-700">Close Panel.</span> Are you sure you want to delete this panel?
        </Alert>
      </ModalBody>

      <ModalFooter className="border-top-0">
        <Button variant="light" className="waves-effect" onClick={onHide}>
          No, cancel
        </Button>
        <Button variant="danger" className="waves-effect" onClick={onConfirm}>
          Yes, delete
        </Button>
      </ModalFooter>
    </Modal>;
};
export const FullscreenPanel = () => {
  const hiddenFullscreenBtnRef = useRef(null);
  const triggerFullscreenToggle = () => {
    if (hiddenFullscreenBtnRef.current) {
      hiddenFullscreenBtnRef.current.click();
    }
  };
  return <div className="position-relative">
      <button ref={hiddenFullscreenBtnRef} type="button" className="d-none" onClick={e => {
      const parentPanel = e.currentTarget.closest('.position-relative');
      const realToolbarBtn = parentPanel?.querySelector('button[data-action="panel-fullscreen"]');
      if (realToolbarBtn && realToolbarBtn !== e.currentTarget) {
        realToolbarBtn.click();
      }
    }} />

      <ComponentCard title={<h2>
            Fullscreen
            <span className="fw-light">
              <i>Panel</i>
            </span>
          </h2>} toolbox showToggleBtn={false} showFullscreenBtn={true} showCloseBtn={false}>
        <div className="panel-container">
          <div className="panel-content">
            <div className="panel-tag">
              Panel is closed by using the attribute <code>data-action="panel-fullscreen"</code>, and can be placed anywhere inside
              <code>.panel</code>
            </div>
            <p>
              You can also place the collapse action inside the <code>.panel-content</code> as button or link
            </p>

            <Button variant="warning" className="me-2" onClick={triggerFullscreenToggle}>
              fullscreen button
            </Button>

            <Link href="" className="text-warning" onClick={e => {
            e.preventDefault();
            triggerFullscreenToggle();
          }}>
              fullscreen link
            </Link>
          </div>
        </div>
      </ComponentCard>
    </div>;
};
export const CollapsablePanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleToggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };
  return <div id="panel-3" className={`panel panel-icon ${isCollapsed ? 'panel-collapsed' : ''}`}>
      <div className="panel-hdr">
        <h2>
          Collapsable
          <span className="fw-light">
            <i>Panel</i>
          </span>
        </h2>
        <div className="panel-toolbar">
          <button type="button" className="btn btn-panel" onClick={handleToggleCollapse} data-action="panel-collapse">
            <svg className="sa-icon">
              {isCollapsed ? <use className="panel-expand-icon d-block" href={`${basePath}/icons/sprite.svg#plus-circle`} /> : <use className="panel-collapsed-icon" href={`${basePath}/icons/sprite.svg#minus-circle`} />}
            </svg>
          </button>
        </div>
      </div>

      <div className={`panel-container ${isCollapsed ? 'd-none' : 'show'}`}>
        <div className="panel-content">
          <div className="panel-tag">
            Panel is closed by using the attribute <code>data-action="panel-collapse"</code>, and can be placed anywhere inside <code>.panel</code>
          </div>
          <p>
            You can also place the collapse action inside the <code>.panel-content</code> as button or link
          </p>

          <Button variant="success" className="me-2" onClick={handleToggleCollapse}>
            collapse button
          </Button>

          <Link href="" className="text-success" onClick={e => {
          e.preventDefault();
          handleToggleCollapse();
        }}>
            collapse link
          </Link>
        </div>
      </div>
    </div>;
};
export const CollapsedPanel = () => {
  return <ComponentCard title={<h2>
          Collapsed
          <span className="fw-light">
            <i>Panel</i>
          </span>
        </h2>} toolbox showToggleBtn={true} showFullscreenBtn={false} showCloseBtn={false}>
      <div className="panel-container">
        <div className="panel-content">
          <div className="panel-tag">
            This panel is closed by default. To close a panel we add the class <code>.panel-collapsed</code> to <code>.panel</code>
          </div>
          <p className="mb-0">Default panel text.</p>
        </div>
      </div>
    </ComponentCard>;
};