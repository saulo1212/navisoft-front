'use client';

import { basePath } from '@/helpers';
import Image from 'next/image';
import { Button, Modal, ModalBody } from 'react-bootstrap';
const PreviewModal = ({
  isOpen,
  currentItem,
  closeModal,
  handlePrev,
  handleNext
}) => {
  if (!isOpen || !currentItem) return null;
  return <Modal show={isOpen} onHide={closeModal} centered size="lg" className="image-preview-modal">
      <ModalBody className="p-0 position-relative d-flex align-items-center justify-content-center">
        <div className="d-flex flex-column flex-lg-row shadow rounded overflow-hidden border border-3 border-light">
          <div className="order-2 order-lg-1 flex-shrink-0" style={{
          width: 300
        }}>
            <div className="d-flex flex-column h-100 p-0">
              <div className="flex-grow-1 p-3">
                <h5 className="image-title fw-bold mb-3">{currentItem.title}</h5>
                <p className="image-description text-muted mb-4">{currentItem.description}</p>
                <div className="mb-3">
                  <div className="text-muted mb-1 fs-sm">Date</div>
                  <div className="image-date">{currentItem.date}</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted mb-1 fs-sm">Source</div>
                  <div className="image-source text-primary text-decoration-underline link-offset-1 link-underline link-underline-opacity-75">
                    {currentItem.source}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-muted mb-1 fs-sm">Tags</div>
                  <div className="image-category badge bg-secondary">{currentItem.category}</div>
                </div>
              </div>
              <div className="px-3 pt-2 pb-0">
                <p className="text-muted fs-nano mb-2">Images may be subject to copyright. Please check the source for more information.</p>
                <div className="d-flex gap-2 pb-3">
                  <Button variant="default" size="sm" className="flex-grow-1 border waves-effect">
                    Save
                  </Button>
                  <Button variant="default" size="sm" className="flex-grow-1 border waves-effect">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="position-relative bg-light order-1 order-lg-2" style={{
          width: 'auto',
          height: 'auto',
          maxHeight: '90vh'
        }}>
            <Button variant="danger" className="btn-icon border border-dark position-absolute top-0 end-0 m-2 z-1" onClick={closeModal} aria-label="Close">
              <svg className="sa-icon sa-bold sa-icon-2x sa-icon-light">
                <use href={`${basePath}/icons/sprite.svg#x`} />
              </svg>
            </Button>

            <div className="d-flex align-items-center justify-content-center h-100 p-0">
              <button type="button" className="btn btn-icon align-items-center justify-content-center text-light btn-dark bg-dark bg-opacity-50 rounded-circle position-absolute top-50 start-0 translate-middle-y ms-4 d-none d-sm-flex fs-3 z-1" onClick={handlePrev}>
                <i className="sa sa-chevron-left" />
              </button>

              <Image src={currentItem.src} className="img-preview" style={{
              maxHeight: '492px',
              maxWidth: '492px',
              objectFit: 'contain'
            }} alt={currentItem.title} />

              <button type="button" className="btn btn-icon align-items-center justify-content-center text-light btn-dark bg-dark bg-opacity-50 rounded-circle position-absolute top-50 end-0 translate-middle-y me-4 d-none d-sm-flex fs-3 z-1" onClick={handleNext}>
                <i className="sa sa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>;
};
export default PreviewModal;