'use client'
import { useState } from 'react'
import { Col } from 'react-bootstrap'
import { Breakpoints, DisplayType, GeneratedClasses, VisibilityMode } from './Visibility'

const VisibilityPage = () => {
  const [visibility, setVisibility] = useState('hidden')

  return (
    <>
      <Col lg={5}>
        <VisibilityMode visibility={visibility} onChange={setVisibility} />
        <DisplayType visibility={visibility} />
        <Breakpoints  />
      </Col>
      <Col lg={7}>
        <GeneratedClasses />
      </Col>
    </>
  )
}

export default VisibilityPage
