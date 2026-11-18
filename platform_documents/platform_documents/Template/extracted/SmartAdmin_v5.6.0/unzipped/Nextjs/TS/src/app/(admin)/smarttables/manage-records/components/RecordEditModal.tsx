'use client'
import { basePath } from '@/helpers'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from 'react-bootstrap'

type NextJsModalProps = {
  modalId: string
  title: string
  submitButtonText: string
  cancelButtonText: string
  rowId: string | number
  show: boolean
  onHide: () => void
  initialData?: {
    name?: string
    email?: string
    phone?: string
    salary?: number
    department?: string
    status?: string
    active?: boolean
    joinDate?: string
  }
  onSubmit: (formData: any) => void
}

const RecordEditModal = ({
  modalId,
  title,
  submitButtonText,
  cancelButtonText,
  rowId,
  show,
  onHide,
  initialData = {},
  onSubmit,
}: NextJsModalProps) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    salary: initialData.salary || '',
    department: initialData.department || 'Engineering',
    status: initialData.status || 'Full-time',
    active: initialData.active ?? false,
    joinDate: initialData.joinDate || new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (show) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        salary: initialData.salary || '',
        department: initialData.department || 'Engineering',
        status: initialData.status || 'Full-time',
        active: initialData.active ?? false,
        joinDate: initialData.joinDate || new Date().toISOString().split('T')[0],
      })
    }
  }, [show, initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, rowId })
    onHide()
  }

  return (
    <Modal fade className="custom-edit-modal" show={show} onHide={onHide} id={modalId} centered aria-labelledby={`${modalId}-label`}>
      <ModalHeader className="border-secondary align-items-center">
        <ModalTitle id={`${modalId}-label`} className="fs-5 fw-medium m-0">
          {title}
        </ModalTitle>
        <button className="btn btn-system ms-auto p-0 border-0 bg-transparent text-secondary" type="button" onClick={onHide} aria-label="Close">
          <svg className="sa-icon sa-icon-2x" style={{ width: '24px', height: '24px', fill: 'currentColor' }}>
            <use href={`${basePath}/icons/sprite.svg#x`}></use>
          </svg>
        </button>
      </ModalHeader>

      <Form onSubmit={handleSubmit}>
        <ModalBody style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
          <input type="hidden" name="rowId" value={rowId} />
          <FormGroup className="mb-3">
            <FormLabel>
              Name <span className="fw-bold text-danger">*</span>
            </FormLabel>
            <FormControl type="text" name="name" required value={formData.name} onChange={handleInputChange} />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>
              Email <span className="fw-bold text-danger">*</span>
            </FormLabel>
            <FormControl type="email" name="email" required value={formData.email} onChange={handleInputChange} />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>
              Phone <span className="fw-bold text-danger">*</span>
            </FormLabel>
            <FormControl type="text" name="phone" required placeholder="(555) 555-5555" value={formData.phone} onChange={handleInputChange} />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Salary</FormLabel>
            <FormControl type="number" name="salary" value={formData.salary} onChange={handleInputChange} />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Department</FormLabel>
            <FormSelect name="department" value={formData.department} onChange={handleInputChange}>
              <option value="Engineering" className="bg-dark text-light">
                Engineering
              </option>
              <option value="Marketing" className="bg-dark text-light">
                Marketing
              </option>
              <option value="Sales" className="bg-dark text-light">
                Sales
              </option>
              <option value="Human Resources" className="bg-dark text-light">
                Human Resources
              </option>
            </FormSelect>
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Join Date</FormLabel>
            <input type="date" className="form-control" value={formData.joinDate} id="edit-field-joinDate" name="joinDate"></input>
          </FormGroup>

          <FormGroup className="mb-3">
            <FormCheck
              type="switch"
              id={`${modalId}-active-switch`}
              name="active"
              label="Active"
              checked={formData.active}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <FormLabel>Status</FormLabel>
            <FormSelect name="status" value={formData.status} onChange={handleInputChange}>
              <option value="Full-time" className="bg-dark text-light">
                Full-time
              </option>
              <option value="Part-time" className="bg-dark text-light">
                Part-time
              </option>
              <option value="Contract" className="bg-dark text-light">
                Contract
              </option>
            </FormSelect>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={onHide}>
            {cancelButtonText}
          </Button>
          <Button type="submit" className="btn-primary btn-success">
            <i className="fas fa-plus-circle me-1"></i>
            {submitButtonText}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default RecordEditModal
