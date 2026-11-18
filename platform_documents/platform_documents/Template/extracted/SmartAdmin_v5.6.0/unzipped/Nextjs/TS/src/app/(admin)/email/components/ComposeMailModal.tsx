'use client'
import avatar from '@/assets/img/demo/avatars/avatar-admin.png'
import Image from 'next/image'
import { useState } from 'react'
import { Alert, Button, FormControl, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, OverlayTrigger, Tooltip } from 'react-bootstrap'

type ComposeMailModalProps = {
  show: boolean
  onHide: () => void
}

type Attachment = {
  id: number
  name: string
}

const ComposeMailModal = ({ show, onHide }: ComposeMailModalProps) => {
  const [showCc, setShowCc] = useState<boolean>(false)

  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: 1, name: 'security_codes.pdf' },
    { id: 2, name: 'agreement.pdf' },
  ])

  const renderTooltip = (text: string) => <Tooltip id={`tooltip-${text.toLowerCase().replace(/\s+/g, '-')}`}>{text}</Tooltip>

  const removeAttachment = (id: number) => {
    setAttachments(attachments.filter((item) => item.id !== id))
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      scrollable
      size="lg"
      className="fade"
      dialogClassName="modal-fullscreen-sm-down">
      <ModalHeader closeButton className="bg-danger-500 text-white">
        <ModalTitle className="fw-600 text-white">Compose Mail</ModalTitle>
      </ModalHeader>

      <div className="border-bottom-0 p-0">
        <div className="px-3 w-100 position-relative">
          <FormControl
            id="message-to"
            type="text"
            placeholder="Recipients"
            className="bg-transparent border-top-0 border-start-0 border-end-0 px-0 rounded-0 fs-md mt-2 pe-5"
            tabIndex={2}
            defaultValue="carlie@gmail.com"
          />

          <OverlayTrigger placement="bottom" overlay={renderTooltip('Add Cc recipients')}>
            <button
              type="button"
              onClick={() => setShowCc(!showCc)}
              className="btn btn-link position-absolute end-0 top-0 mt-3 me-4 p-0 text-decoration-none text-secondary fs-sm">
              Cc
            </button>
          </OverlayTrigger>

          {showCc && (
            <FormControl
              id="message-to-cc"
              type="text"
              placeholder="Cc"
              className="bg-transparent border-top-0 border-start-0 border-end-0 px-0 rounded-0 fs-md mt-2"
              tabIndex={3}
            />
          )}

          <FormControl
            type="text"
            placeholder="Subject"
            className="bg-transparent fw-bold border-top-0 border-start-0 border-end-0 px-0 rounded-0 fs-md mt-2"
            tabIndex={4}
            defaultValue="Re: New security codes (2)"
          />

          {attachments.length > 0 && (
            <div id="message-attachments" className="d-flex flex-wrap align-items-center gap-2 py-3 position-relative">
              {attachments.map((file) => (
                <Alert key={file.id} className="m-0 p-0 badge bg-primary-50 border-primary ps-2 d-flex align-items-center text-primary">
                  <span className="px-1">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(file.id)}
                    className="btn btn-icon btn-xs ms-1 rounded-0 border border-primary border-top-0 border-bottom-0 border-end-0 waves-effect waves-themed text-primary"
                    aria-label={`Remove ${file.name}`}>
                    <i className="fas fa-times" />
                  </button>
                </Alert>
              ))}

              <button type="button" className="btn btn-link p-0 fs-xs text-secondary ms-1 text-decoration-none">
                show 3 more
              </button>

              <OverlayTrigger placement="top" overlay={renderTooltip('Attach files')}>
                <button type="button" className="btn btn-link position-absolute end-0 top-0 mt-3 me-2 p-0 text-secondary">
                  <i className="fas fa-paperclip" />
                </button>
              </OverlayTrigger>
            </div>
          )}
        </div>
      </div>

      <ModalBody className="custom-scrollbar p-0">
        <div className="panel-container show rounded-0 flex-1 d-flex flex-column">
          <div className="flex-1" style={{ overflowY: 'auto' }}>
            <div
              id="fake_textarea"
              className="form-control rounded-0 w-100 h-100 border-0 py-3 height-sm"
              contentEditable="true"
              tabIndex={5}
              suppressContentEditableWarning={true}>
              <p>Hi Carlie,</p>
              <p>
                I'm writing to you about the new security codes. Please find the updated codes attached for your reference. Ensure you update your
                system with these codes by tomorrow to maintain security compliance. Let me know if you encounter any issues during the process.
              </p>
              <p>Best regards,</p>

              <div className="d-flex align-items-start mb-3 gap-2">
                <Image src={avatar} alt="SmartAdmin WebApp" className="mt-1 rounded-circle width-2" />
                <div className="border-start ps-3">
                  <span className="fw-500 fs-lg d-block l-h-n">Sunny A.</span>
                  <span className="fw-400 fs-nano d-block l-h-n mb-1">Software Engineer</span>
                </div>
              </div>

              <div className="text-muted fs-nano">
                PRIVATE AND CONFIDENTIAL. This e-mail, its contents and attachments are private and confidential and is intended for the recipient
                only. Any disclosure, copying or unauthorized use of such information is prohibited. If you receive this message in error, please
                notify us immediately and delete the original and any copies and attachments.
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="d-flex align-items-center flex-wrap flex-shrink-0 me-auto gap-2 flex-grow-1">
          <OverlayTrigger placement="top" overlay={renderTooltip('Formatting options')}>
            <button type="button" className="btn btn-icon fs-xl" aria-label="Formatting options">
              <i className="fas fa-font color-fusion-300" />
            </button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={renderTooltip('Attach files')}>
            <button type="button" className="btn btn-icon fs-xl" aria-label="Attach files">
              <i className="fas fa-paperclip color-fusion-300" />
            </button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={renderTooltip('Insert photo')}>
            <button type="button" className="btn btn-icon fs-xl hidden-mobile" aria-label="Insert photo">
              <i className="fas fa-camera color-fusion-300" />
            </button>
          </OverlayTrigger>

          <div className="ms-auto d-flex gap-1">
            <OverlayTrigger placement="top" overlay={renderTooltip('Disregard draft')}>
              <button type="button" className="btn btn-icon" aria-label="Disregard draft">
                <i className="fas fa-trash color-fusion-300" />
              </button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={renderTooltip('More options')}>
              <button type="button" className="btn btn-icon width-1" aria-label="More options">
                <i className="fas fa-ellipsis-v-alt color-fusion-300" />
              </button>
            </OverlayTrigger>
          </div>

          <Button variant="secondary" size="sm" className="waves-effect" onClick={onHide}>
            Save Draft
          </Button>
          <Button variant="primary" size="sm" className="waves-effect">
            Send
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default ComposeMailModal