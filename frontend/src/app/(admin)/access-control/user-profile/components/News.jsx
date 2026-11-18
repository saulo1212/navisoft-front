import Image from 'next/image';
import { Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormControl, FormLabel, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import CommentThread from './CommentThread';
import { comments, profileVisitors, suggestedUsers } from './data';
import adminAvatar from '@/assets/img/demo/avatars/avatar-admin.png';
import peaceFullImg from '@/assets/img/demo/peace-full.jpg';
import { basePath } from '@/helpers';
import Feedback from 'react-bootstrap/Feedback';
import { useToggle } from 'usehooks-ts';
const ProfileViews = () => {
  return <div className="panel mb-4">
      <div className="panel-hdr">
        <h2>Profile Views</h2>
      </div>
      <div className="panel-container">
        <div className="panel-content">
          <div className="d-flex flex-column gap-3">
            {profileVisitors.map((visitor, idx) => <div className="d-flex align-items-center" key={idx}>
                <Image src={visitor.avatar} className="rounded-circle me-3" width="48" height="48" alt="Emily Chen" />
                <div>
                  <h6 className="mb-0">{visitor.name}</h6>
                  <small className="text-muted">{visitor.role}</small>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
const SuggestedUsers = () => {
  return <div className="panel mb-4">
      <div className="panel-hdr">
        <h2>People You Might Know</h2>
      </div>
      <div className="panel-container">
        <div className="panel-content">
          <div className="d-flex flex-column gap-3">
            {suggestedUsers.map((user, idx) => <div className="d-flex align-items-center" key={idx}>
                <Image src={user.avatar} className="rounded-circle me-3" width="48" height="48" alt="David Kim" />
                <div className="flex-grow-1">
                  <h6 className="mb-0">{user.name}</h6>
                  <small className="text-muted">{user.role}</small>
                </div>
                <Button variant="primary" type="button" className="btn btn-xs d-flex waves-effect">
                  {' '}
                  Connect
                </Button>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
const News = () => {
  const [show, toggle] = useToggle(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm();
  const onSubmit = data => {
    console.log('Form Data:', data);
  };
  return <Row>
      <Col lg={8}>
        <div className="panel mb-4">
          <div className="panel-hdr d-flex justify-content-between align-items-center pe-3">
            <h2>Latest Updates</h2>
            <button className="btn btn-xs btn-outline-default px-2" type="button" onClick={toggle}>
              Add News
            </button>
          </div>
          <div className="panel-container">
            <div className="panel-content">
              <div className="d-flex flex-column gap-4">
                <div className="border-bottom pb-4">
                  <div className="d-flex align-items-center mb-3">
                    <Image src={adminAvatar} className="profile-image profile-image-md rounded-circle me-2" alt="John Doe" />
                    <div>
                      <h6 className="mb-0">John Doe</h6>
                      <small className="text-muted">Posted 2 days ago</small>
                    </div>
                  </div>
                  <p className="mb-3">Excited to announce that our latest project has been successfully launched! 🚀</p>
                  <Image src={peaceFullImg} className="img-fluid rounded mb-3" alt="Project Launch" />
                  <div className="d-flex gap-2 mb-3">
                    <button type="button" className="btn btn-icon btn-default rounded-circle">
                      <svg className="sa-icon">
                        <use href={`${basePath}/icons/sprite.svg#heart`}></use>
                      </svg>
                    </button>
                    <button type="button" className="btn btn-icon btn-default rounded-circle">
                      <svg className="sa-icon">
                        <use href={`${basePath}/icons/sprite.svg#message-square`}></use>
                      </svg>
                    </button>
                    <button type="button" className="btn btn-icon btn-default rounded-circle">
                      <svg className="sa-icon">
                        <use href={`${basePath}/icons/sprite.svg#share-2`}></use>
                      </svg>
                    </button>
                  </div>

                  <div className="comments-section mt-3">
                    <div className="d-flex gap-2 mb-4 align-items-center">
                      <Image src={adminAvatar} className="profile-image profile-image-md rounded-circle me-2" alt="John Doe" />
                      <div className="flex-grow-1">
                        <div className="comment-input-wrapper position-relative">
                          <input type="text" className="form-control rounded-pill" placeholder="Add a comment..." />
                          <div className="comment-actions position-absolute end-0 top-50 translate-middle-y me-2 d-none">
                            <button type="button" className="btn btn-icon btn-sm">
                              <svg className="sa-icon">
                                <use href={`${basePath}/icons/sprite.svg#image`}></use>
                              </svg>
                            </button>
                            <button type="button" className="btn btn-primary btn-sm rounded-pill px-3">
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Dropdown className="mb-3">
                      <DropdownToggle variant="link" className="p-0 text-muted" type="button">
                        Most relevant
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Most relevant</DropdownItem>
                        <DropdownItem>Most recent</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    <CommentThread comments={comments} />
                  </div>
                </div>

                <div className="border-bottom pb-4">
                  <div className="d-flex align-items-center mb-3">
                    <Image src={adminAvatar} className="profile-image profile-image-md rounded-circle me-2" alt="John Doe" />
                    <div>
                      <h6 className="mb-0">John Doe</h6>
                      <small className="text-muted">Posted 1 week ago</small>
                    </div>
                  </div>
                  <p className="mb-3">Just completed a certification in Advanced React Development! 📚</p>
                  <div className="d-flex gap-2 mb-3">
                    <button type="button" className="btn waves-effect btn-icon btn-default rounded-circle">
                      <svg className="sa-icon">
                        <use href={`${basePath}/icons/sprite.svg#heart`}></use>
                      </svg>
                    </button>
                    <button type="button" className="btn waves-effect btn-icon btn-default rounded-circle">
                      <svg className="sa-icon">
                        <use href={`${basePath}/icons/sprite.svg#message-square`}></use>
                      </svg>
                    </button>
                    <button type="button" className="btn btn-icon btn-default rounded-circle waves-effect">
                      <svg className="sa-icon">
                        <use href={`${basePath}/icons/sprite.svg#share-2`}></use>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={show} size="lg" className="fade" id="addNewsModal" tabIndex={-1}>
          <Form noValidate onSubmit={handleSubmit(onSubmit)} className="needs-validation">
            <ModalHeader closeButton>
              <ModalTitle as={'h5'} id="addNewsModalLabel">
                Create News Update
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="mb-3">
                <FormLabel htmlFor="newsTitle">
                  Title <span className="text-danger">*</span>
                </FormLabel>
                <FormControl type="text" id="newsTitle" placeholder="Add a title for your news" isInvalid={!!errors.title} {...register('title', {
                required: 'Please provide a title for your news update.'
              })} />
                <Feedback type="invalid">{errors.title?.message}</Feedback>
              </div>
              <div className="mb-3">
                <FormLabel>
                  Content <span className="text-danger">*</span>
                </FormLabel>
                <FormControl as="textarea" id="newsContent" rows={4} placeholder="Write your news update..." isInvalid={!!errors.content} {...register('content', {
                required: 'Please provide content for your news update.'
              })} />
                <Feedback type="invalid">{errors.content?.message}</Feedback>
              </div>
              <div className="mb-3">
                <FormLabel>Image (Optional)</FormLabel>
                <FormControl type="file" id="newsImage" accept="image/*" {...register('file')} />
                <div className="form-text">Recommended image size: 1200x630 pixels</div>
              </div>
              <div className="mb-3">
                <FormLabel>
                  Visibility <span className="text-danger">*</span>
                </FormLabel>
                <Form.Check type="radio" label="Public - Anyone can see this news update" id="newsPublic" value="public" {...register('visibility', {
                required: 'Please select a visibility option.'
              })} isInvalid={!!errors.visibility} defaultChecked />
                <Form.Check type="radio" label="Connections only - Only your connections can see this news update" id="newsConnections" value="connections" {...register('visibility')} isInvalid={!!errors.visibility} />
                <Feedback type="invalid">{errors.visibility?.message}</Feedback>
              </div>
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-default waves-effect" onClick={toggle}>
                Cancel
              </button>
              <Button variant="primary" className="waves-effect" type="submit">
                Post Update
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Col>
      <Col lg={4}>
        <ProfileViews />

        <SuggestedUsers />
      </Col>
    </Row>;
};
export default News;