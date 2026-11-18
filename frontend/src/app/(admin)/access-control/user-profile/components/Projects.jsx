import Image from 'next/image';
import Link from 'next/link';
import { Button, Carousel, Col, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useToggle } from 'usehooks-ts';
import { carouselItems } from './data';
const FeaturedProject = () => {
  const [show, toggle] = useToggle();
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm();
  const onSubmit = data => {
    console.log('Form data:', data);
  };
  return <>
      <div className="panel">
        <div className="panel-hdr d-flex justify-content-between align-items-center pe-3">
          <h2>Featured Projects</h2>
          <Button type="button" variant="outline-default" className="btn-xs px-2" onClick={toggle}>
            Add Project
          </Button>
        </div>
        <div className="panel-container">
          <div className="panel-content">
            <Carousel>
              {carouselItems.map((item, idx) => <Carousel.Item key={idx}>
                  <Image src={item.image} alt="Project 1" className="d-block w-100" />
                  <Carousel.Caption>
                    <h5>{item.title}</h5>
                    <p>{item.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>)}
            </Carousel>
          </div>
        </div>
      </div>
      <Modal show={show} className="fade" size="lg" tabIndex={-1}>
        <form noValidate className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <ModalTitle as="h5" id="addProjectModalLabel">
              Add New Project
            </ModalTitle>
            <button type="button" className="btn-close" onClick={toggle}></button>
          </ModalHeader>
          <ModalBody>
            <div className="mb-3">
              <FormLabel>
                Project Title <span className="text-danger">*</span>
              </FormLabel>
              <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`} id="projectTitle" placeholder="Enter project title" {...register('title', {
              required: 'Please provide a project title.'
            })} />
              <div className="invalid-feedback">{errors.title?.message}</div>
            </div>

            <Row>
              <Col md={6} className=" mb-3">
                <FormLabel>
                  Project Type <span className="text-danger">*</span>
                </FormLabel>
                <FormSelect className={`${errors.type ? 'is-invalid' : ''}`} id="projectType" {...register('type', {
                required: 'Please select a project type.'
              })}>
                  <option value="">Select type</option>
                  <option value="website">Website</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop App</option>
                  <option value="library">Library/Framework</option>
                  <option value="other">Other</option>
                </FormSelect>
                <div className="invalid-feedback">{errors.type?.message}</div>
              </Col>

              <Col md={6} className="mb-3">
                <FormLabel>
                  Status <span className="text-danger">*</span>
                </FormLabel>
                <select className={`form-select ${errors.status ? 'is-invalid' : ''}`} id="projectStatus" {...register('status', {
                required: 'Please select a project status.'
              })}>
                  <option value="">Select status</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="planned">Planned</option>
                </select>
                <div className="invalid-feedback">{errors.status?.message}</div>
              </Col>
            </Row>

            <div className="mb-3">
              <FormLabel>
                Description <span className="text-danger">*</span>
              </FormLabel>
              <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} id="projectDescription" rows={3} placeholder="Describe your project" {...register('description', {
              required: 'Please provide a description.'
            })} />
              <div className="invalid-feedback">{errors.description?.message}</div>
            </div>

            <div className="mb-3">
              <FormLabel>
                Technologies Used <span className="text-danger">*</span>
              </FormLabel>
              <input type="text" className={`form-control ${errors.technologies ? 'is-invalid' : ''}`} id="projectTechnologies" placeholder="E.g., React, Node.js, MongoDB" {...register('technologies', {
              required: 'Please list the technologies used.'
            })} />
              <div className="invalid-feedback">{errors.technologies?.message}</div>
              <div className="form-text">Separate technologies with commas</div>
            </div>

            <div className="mb-3">
              <FormLabel>Featured Image</FormLabel>
              <input type="file" className="form-control" id="projectImage" accept="image/*" {...register('image')} />
              <div className="form-text">Recommended image size: 1200x630 pixels</div>
            </div>

            <Row>
              <Col md={6} className="mb-3">
                <FormLabel>Project URL (Optional)</FormLabel>
                <input type="url" className="form-control" id="projectLink" placeholder="https://example.com" {...register('link')} />
              </Col>
              <Col md={6} className="mb-3">
                <FormLabel>Repository URL (Optional)</FormLabel>
                <input type="url" className="form-control" id="projectRepo" placeholder="https://github.com/example" {...register('repo')} />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button variant="default" type="button" className="waves-effect" onClick={toggle}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="waves-effect">
              Save Project
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>;
};
const Projects = () => {
  return <Row>
      <Col xs={12} className="mb-4">
        <FeaturedProject />
      </Col>

      <Col md={6} xl={4} className="mb-4">
        <div className="panel h-100">
          <div className="panel-container">
            <div className="panel-content p-0">
              <div className="position-relative">
                <div className="w-100 height-sm bg-placeholder rounded-top overflow-hidden" style={{
                '--body-bg': '#b19e97',
                '--gp-color-1': '#6d5c53'
              }}></div>
                <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white">
                  <h5 className="mb-1">E-Commerce Platform</h5>
                  <p className="mb-0 small">React • Node.js • MongoDB</p>
                </div>
              </div>
              <div className="p-3">
                <p className="mb-3">A full-featured e-commerce platform with real-time inventory management and analytics.</p>
                <Link href="" className="btn btn-default btn-sm waves-effect">
                  View Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Col>

      <Col md={6} xl={4} className="mb-4">
        <div className="panel h-100">
          <div className="panel-container">
            <div className="panel-content p-0">
              <div className="position-relative">
                <div className="w-100 height-sm bg-placeholder rounded-top overflow-hidden" style={{
                '--body-bg': '#262a33',
                '--gp-color-1': '#a3a5ad'
              }}></div>
                <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white">
                  <h5 className="mb-1">Task Management App</h5>
                  <p className="mb-0 small">Vue.js • Express • PostgreSQL</p>
                </div>
              </div>
              <div className="p-3">
                <p className="mb-3">Intuitive task management application with team collaboration features.</p>
                <Link href="" className="btn btn-default btn-sm waves-effect">
                  View Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Col>

      <Col md={6} xl={4} className="mb-4">
        <div className="panel h-100">
          <div className="panel-container">
            <div className="panel-content p-0">
              <div className="position-relative">
                <div className="w-100 height-sm bg-placeholder rounded-top overflow-hidden" style={{
                '--body-bg': '#18a2c2',
                '--gp-color-1': '#624492'
              }}></div>
                <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white">
                  <h5 className="mb-1">Social Media Dashboard</h5>
                  <p className="mb-0 small">Angular • Firebase • Chart.js</p>
                </div>
              </div>
              <div className="p-3">
                <p className="mb-3">Comprehensive social media analytics and management dashboard.</p>
                <Link href="" className="btn btn-default btn-sm waves-effect">
                  View Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>;
};
export default Projects;