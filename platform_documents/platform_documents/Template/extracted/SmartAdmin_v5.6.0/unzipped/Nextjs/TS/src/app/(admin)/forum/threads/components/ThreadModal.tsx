import { Button, Form, FormControl, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'

type ThreadModalProps = {
  show: boolean
  handleClose: () => void
}
const ThreadModal = ({ show, handleClose }: ThreadModalProps) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} fade size="lg">
        <ModalHeader closeButton>
          <ModalTitle as="h5">Create New Thread</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form>
            <div className="mb-3">
              <FormLabel>Thread Title</FormLabel>
              <FormControl type="text" id="threadTitle" placeholder="Enter a descriptive title for your thread" />
            </div>
            <div className="mb-3">
              <FormLabel>Category</FormLabel>
              <FormSelect>
                <option defaultChecked>Account information &amp; Security</option>
                <option>General Discussion</option>
                <option>Troubleshooting</option>
                <option>Feature Requests</option>
                <option>Product Announcements</option>
              </FormSelect>
            </div>
            <div className="mb-3">
              <FormLabel>Tags</FormLabel>
              <FormControl type="text" id="threadTags" placeholder="Add tags separated by commas" />
              <div className="form-text">Optional tags to help categorize your thread</div>
            </div>
            <div className="mb-3">
              <FormLabel>Thread Content</FormLabel>
              <textarea className="form-control" id="threadContent" rows={8} placeholder="Describe your topic in detail" />
            </div>
            <div className="mb-3">
              <FormLabel>Attachments</FormLabel>
              <input className="form-control" type="file" id="threadAttachments" multiple />
              <div className="form-text">Max file size: 2MB. Allowed formats: jpg, png, gif, pdf, doc, zip</div>
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="notifyReplies" />
              <label className="form-check-label" htmlFor="notifyReplies">
                Notify me when someone replies
              </label>
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="stickyThread" />
              <label className="form-check-label" htmlFor="stickyThread">
                Make this thread sticky
              </label>
              <div className="form-text">Admin approval required</div>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline-secondary" className="waves-effect">
            Cancel
          </Button>
          <Button variant="success" className="waves-effect">
            Create Thread
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default ThreadModal
