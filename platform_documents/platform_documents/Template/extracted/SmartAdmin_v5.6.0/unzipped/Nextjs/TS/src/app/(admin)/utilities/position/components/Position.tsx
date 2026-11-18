'use client'
import fixedGif from '@/assets/img/demo/position-fixed.gif'
import ComponentCard from '@/components/ComponentCard'
import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import { Button, OverlayTrigger, Popover, PopoverBody } from 'react-bootstrap'

export const PositionStatic = () => {
  const [isStatic, setIsStatic] = useState(true)

  const handleTogglePosition = () => {
    setIsStatic((prev) => !prev)
  }

  return (
    <ComponentCard
      title={
        <h2>
          Position
          <span className="fw-300">
            <i>Static</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Every element has a static position by default, so the element will stick to the normal page flow. So if there is a
            left/right/top/bottom/z-index set then there will be no effect on that element. Adding <code>.position-static</code> will generally
            'reset' these properties.
          </div>

          <div className="demo-window rounded shadow-1 mb-g">
            <div className="demo-window-content">
              <div className="d-flex flex-row" style={{ height: '15rem' }}>
                <div className="w-100 flex-grow-1 bg-highlight p-3 position-relative d-flex flex-column">
                  <div className="border border-danger flex-grow-1 p-5 position-relative d-flex flex-column">
                    <div className="position-absolute pos-top pos-left p-2 text-muted" style={{ fontSize: '0.8rem' }}>
                      .position-relative
                    </div>

                    <div className={clsx('border border-danger flex-grow-1 p-3 transition-all', isStatic ? 'position-static' : 'position-relative')}>
                      <strong className={clsx(isStatic ? 'text-danger' : 'text-success')}>
                        {isStatic ? '.position-static' : '.position-relative (Active Override)'}
                      </strong>

                      <p className="position-absolute pos-right pos-bottom p-2 bg-fusion-500 m-0 text-white rounded">.position-absolute</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className={clsx('btn', isStatic ? 'btn-outline-success' : 'btn-success')} type="button" onClick={handleTogglePosition}>
            {isStatic ? 'Change to RELATIVE' : 'Reset back to STATIC'}
          </button>
        </div>
      </div>
    </ComponentCard>
  )
}

export const PositionFixd = () => {
  const popoverContent = (props: any) => (
    <Popover id="position-fixed-popover" className="max-width-reset" {...props}>
      <PopoverBody className="p-3">
        <Image src={fixedGif} alt="Position Fixed Example" style={{ width: '360px', height: 'auto', display: 'block' }} />
      </PopoverBody>
    </Popover>
  )

  return (
    <ComponentCard
      title={
        <h2>
          Position
          <span className="fw-300">
            <i>Fixed</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            An element with <code>.position-fixed</code> is positioned relative to the viewport, which means it always stays in the same place even if
            the page is scrolled. The <code>top</code>, <code>right</code>, <code>bottom</code>, and <code>left</code> properties are used to position
            the element.
          </div>

          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverContent}>
            <Button variant="outline-danger" className="waves-effect hidden-sm-down d-inline-flex align-items-center">
              <i className="sa sa-control-play me-2" />
              Live example
            </Button>
          </OverlayTrigger>
        </div>
      </div>
    </ComponentCard>
  )
}
