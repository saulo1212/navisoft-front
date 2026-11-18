'use client'
import { basePath } from '@/helpers'
import { useState } from 'react'
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'

type ImportModalProps = {
  show: boolean
  handleClose: () => void
  onImportSuccess: (parsedData: any[]) => void
}

const ImportModal = ({ show, handleClose, onImportSuccess }: ImportModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [validatedData, setValidatedData] = useState<any[] | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles, rejectedFiles) => {
      setErrorMessage(null)
      setSuccessMessage(null)
      setSelectedFile(null)
      setValidatedData(null)

      if (rejectedFiles.length > 0) {
        const file = rejectedFiles[0].file
        setErrorMessage(`Unsupported file format: ${file.name}. Please use JSON.`)
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]

        if (!file.name.endsWith('.json')) {
          setErrorMessage(`Unsupported file format: ${file.name}. Please use JSON.`)
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string)

            if (Array.isArray(json) && json.length > 0 && typeof json[0] === 'object' && json[0] !== null) {
              setSelectedFile(file)
              setValidatedData(json)
              setSuccessMessage(`JSON file ${file.name} loaded successfully. Ready to import.`)
            } else {
              setErrorMessage(`Invalid JSON structure: File must contain a valid array of items.`)
            }
          } catch (err) {
            setErrorMessage(`Failed to parse JSON file syntax errors.`)
          }
        }
        reader.readAsText(file)
      }
    },
  })

  const handleCancel = () => {
    setSelectedFile(null)
    setErrorMessage(null)
    setSuccessMessage(null)
    setValidatedData(null)
    handleClose()
  }

  const handleImportSubmit = () => {
    if (validatedData) {
      onImportSuccess(validatedData)
      handleCancel()
    }
  }

  return (
    <Modal show={show} onHide={handleCancel} centered id="importModal">
      <ModalHeader closeButton>
        <ModalTitle as={'h5'} id="importModalLabel">
          Import Data
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        {errorMessage && (
          <Alert variant="danger" className="mb-3 py-2 border-danger text-danger bg-danger bg-opacity-10 text-center fw-medium">
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" className="mb-3 py-2 border-info text-dark bg-info bg-opacity-20 text-center fw-medium">
            {successMessage}
          </Alert>
        )}

        <div
          {...getRootProps()}
          className="st-dropzone p-5 text-center d-flex flex-column align-items-center border border-2 border-dashed rounded bg-faded cursor-pointer">
          <input {...getInputProps()} />
          <svg className="sa-icon sa-icon-success sa-thin sa-icon-5x mb-2">
            <use href={`${basePath}/icons/sprite.svg#upload-cloud`} />
          </svg>
          {selectedFile ? (
            <div>
              <p className="mb-0 fw-500 text-success">{selectedFile.name}</p>
              <small className="text-muted">{(selectedFile.size / 1024).toFixed(2)} KB</small>
            </div>
          ) : (
            <p className="mb-0 text-muted">
              {isDragActive ? (
                'Drop the file here ...'
              ) : (
                <>
                  Drag and drop your JSON file here
                  <br />
                  or <b className="text-primary fw-500">click to browse</b>
                </>
              )}
            </p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="danger" className="px-4" style={{ backgroundColor: '#ff337c', borderColor: '#ff337c' }} onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="success"
          className="px-4"
          style={{ backgroundColor: '#33d6c4', borderColor: '#33d6c4', color: '#fff' }}
          disabled={!validatedData}
          onClick={handleImportSubmit}>
          Import
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ImportModal
