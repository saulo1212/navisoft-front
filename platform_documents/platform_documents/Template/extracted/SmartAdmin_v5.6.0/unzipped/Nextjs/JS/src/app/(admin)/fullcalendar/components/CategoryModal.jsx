'use client';

import { Button, Col, Form, FormControl, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from 'react-bootstrap';
const CategoryModal = () => {
  return <>
      <Modal fade id="categoryModal">
        <ModalHeader closeButton>
          <ModalTitle as={'h5'} id="categoryModalLabel">
            Manage Categories
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form id="categoryForm" className="mb-4">
            <Row>
              <Col md={6} className="mb-3">
                <FormLabel>Category Name</FormLabel>
                <FormControl type="text" id="categoryName" required />
              </Col>
              <Col md={6} className="mb-3">
                <FormLabel>Color</FormLabel>
                <FormSelect id="categoryColor">
                  <option value="var(--primary-500)">Blue</option>
                  <option value="var(--success-500)">Green</option>
                  <option value="var(--danger-500)">Red</option>
                  <option value="var(--warning-500)">Yellow</option>
                  <option value="var(--info-500)">Cyan</option>
                  <option value="var(--secondary-900)">Dark</option>
                  <option value="var(--secondary-300)">Secondary</option>
                  <option value="var(--bs-purple)">Purple</option>
                  <option value="var(--bs-indigo)">Indigo</option>
                  <option value="var(--bs-teal)">Teal</option>
                </FormSelect>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="waves-effect">
              Add Category
            </Button>
          </Form>
          <h6>Existing Categories</h6>
          <ul className="list-group" id="categoryList"></ul>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" className="waves-effect">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>;
};
export default CategoryModal;