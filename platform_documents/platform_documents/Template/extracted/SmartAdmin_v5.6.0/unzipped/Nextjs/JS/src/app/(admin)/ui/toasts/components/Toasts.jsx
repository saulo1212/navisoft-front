'use client';

import logo from '@/assets/img/logo.png';
import ComponentCard from '@/components/ComponentCard';
import { Toast, ToastBody, ToastContainer, ToastHeader } from 'react-bootstrap';
import { useToggle } from 'usehooks-ts';
export const BasicToasts = () => {
  const [show, ToggleShow] = useToggle(true);
  return <ComponentCard title={<h2>
          Basic
          <span className="fw-300">
            <i>Toasts</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Toasts are as flexible as you need and have very little required markup. At a minimum, we require a single element to contain your
            "toasted" content and strongly encourage a dismiss button.
          </div>
          <Toast show={show} onClose={ToggleShow} className="fade">
            <ToastHeader>
              <img src={logo.src} alt="brand-logo" height={16} className="me-2" />
              <strong className="me-auto">SmartAdmin</strong>
              <small>11 mins ago</small>
            </ToastHeader>
            <ToastBody>Hello, world! This is a toast message.</ToastBody>
          </Toast>
        </div>
      </div>
    </ComponentCard>;
};
export const PlacementToasts = () => {
  const [tostShow, ToggleShow] = useToggle(true);
  return <ComponentCard title={<h2>
          Placement
          <span className="fw-300">
            <i>Toasts</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Place toasts with custom CSS as you need them. The top right is often used for notifications, as is the top middle. If you're only ever
            going to show one toast at a time, put the positioning styles right on the <code>.toast</code>
          </div>
          <div aria-live="polite" aria-atomic="true" className="d-flex justify-content-center align-items-center height-lg bg-info pattern-1">
            <Toast className="fade" show={tostShow} onClose={ToggleShow}>
              <ToastHeader>
                <img src={logo.src} alt="brand-logo" height={16} className="me-2" />
                <strong className="me-auto">SmartAdmin</strong>
                <small>11 mins ago</small>
              </ToastHeader>
              <ToastBody>Hello, world! This is a toast message.</ToastBody>
            </Toast>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
export const TranslucentToasts = () => {
  const [isShow, ToggleShow] = useToggle(true);
  return <ComponentCard title={<h2>
          Translucent
          <span className="fw-300">
            <i>Toasts</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Toasts are slightly translucent, too, so they blend over whatever they might appear over. For browsers that support the backdrop-filter
            CSS property, we'll also attempt to blur the elements under a toast.
          </div>
          <div className="p-3 bg-secondary">
            <Toast className="fade" onClose={ToggleShow} autohide delay={8000} show={isShow} role="alert" aria-live="assertive" aria-atomic="true">
              <ToastHeader>
                <img src={logo.src} alt="brand-logo" height={16} className="me-2" />
                <strong className="me-auto">SmartAdmin</strong>
                <small>11 mins ago</small>
              </ToastHeader>
              <ToastBody>Hello, world! This is a toast message.</ToastBody>
            </Toast>
          </div>
        </div>
      </div>
    </ComponentCard>;
};
export const StackingToasts = () => {
  const [isShow1, ToggleShow1] = useToggle(true);
  const [isShow2, ToggleShow2] = useToggle(true);
  return <ComponentCard title={<h2>
          Stacking
          <span className="fw-300">
            <i>Toasts</i>
          </span>
        </h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">When you have multiple toasts, we default to vertically stacking them in a readable manner.</div>
          <div className="position-relative height-lg bg-primary pattern-1" aria-live="polite" aria-atomic="true">
            <ToastContainer style={{
            position: 'absolute',
            top: 0,
            right: 0
          }} className="mt-3 me-3">
              <Toast show={isShow1} onClose={ToggleShow1} className="fade">
                <ToastHeader>
                  <img src={logo.src} alt="brand-logo" height={16} className="me-2" />
                  <strong className="me-auto">SmartAdmin</strong>
                  <small className="text-muted">just now</small>
                </ToastHeader>
                <ToastBody>See? Just like this.</ToastBody>
              </Toast>
              <Toast delay={2000} show={isShow2} onClose={ToggleShow2} className="fade">
                <ToastHeader>
                  <img src={logo.src} alt="brand-logo" height={16} className="me-2" />
                  <strong className="me-auto">SmartAdmin</strong>
                  <small className="text-muted">2 seconds ago</small>
                </ToastHeader>
                <ToastBody>Heads up, toasts will stack automatically</ToastBody>
              </Toast>
            </ToastContainer>
          </div>
        </div>
      </div>
    </ComponentCard>;
};