'use client'
import { basePath } from '@/helpers'
import { useState } from 'react'
import ImportModal from './ImportModal'

type ImportExportProps = {
  onDataLoaded: (data: any[]) => void
}

const Importexport = ({ onDataLoaded }: ImportExportProps) => {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <button onClick={handleShow} id="importBtn" type="button" className="btn btn-default btn-lg d-flex align-items-center mb-2">
        <svg className="sa-icon sa-icon-success sa-thin sa-icon-4x me-2">
          <use href={`${basePath}/icons/sprite.svg#upload-cloud`} />
        </svg>
        Import Data
      </button>

      <ImportModal show={show} handleClose={handleClose} onImportSuccess={onDataLoaded} />
    </>
  )
}

export default Importexport
