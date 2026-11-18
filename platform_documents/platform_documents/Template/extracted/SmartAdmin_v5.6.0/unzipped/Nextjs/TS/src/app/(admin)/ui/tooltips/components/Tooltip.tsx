'use client'
import ComponentCard from '@/components/ComponentCard'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'

export const Tooltipbasics = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Tooltip
          <span className="fw-300">
            <i>basics</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Hover over the links below to see tooltips:</div>
          <p className="text-muted">
            Tight pants next level keffiyeh&nbsp;
            <OverlayTrigger placement="top" overlay={<Tooltip className="danger-tooltip">Default tooltip</Tooltip>}>
              <Link href="" className="fw-500">
                you probably
              </Link>
            </OverlayTrigger>
            &nbsp;haven't heard of them. Photo booth beard raw denim letterpress vegan messenger bag stumptown. Farm-to-table seitan, mcsweeney's
            fixie sustainable quinoa 8-bit american apparel&nbsp;
            <OverlayTrigger placement="top" overlay={<Tooltip className="danger-tooltip">Another tooltip</Tooltip>}>
              <Link href="" className="fw-500">
                have a
              </Link>
            </OverlayTrigger>
            &nbsp;terry richardson vinyl chambray. Beard stumptown, cardigans banh mi lomo thundercats. Tofu biodiesel williamsburg marfa, four loko
            mcsweeney's cleanse vegan chambray. A really ironic artisan&nbsp;
            <OverlayTrigger placement="top" overlay={<Tooltip className="danger-tooltip">Another one here too</Tooltip>}>
              <Link href="" className="fw-500">
                whatever keytar
              </Link>
            </OverlayTrigger>
            &nbsp;, scenester farm-to-table banksy Austin&nbsp;
            <OverlayTrigger placement="top" overlay={<Tooltip className="danger-tooltip">The last tip!</Tooltip>}>
              <Link href="" className="fw-500">
                twitter handle
              </Link>
            </OverlayTrigger>
            &nbsp;freegan cred raw denim single-origin coffee viral.
          </p>
        </div>
      </div>
    </ComponentCard>
  )
}

export const OffsetTooltip = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Tooltip
          <span className="fw-300">
            <i>Offset</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Offset of the tooltip relative to its target. When a function is used to determine the offset, it is called with an object containing the
            offset data as its first argument. The function must return an object with the same structure. The triggering element DOM node is passed
            as the second argument.
          </div>
          <div className="demo">
            <OverlayTrigger
              placement="top"
              popperConfig={{ modifiers: [{ name: 'offset', options: { offset: [0, 25] } }] }}
              overlay={<Tooltip>Offset by x=0, y=25</Tooltip>}>
              <Button variant="outline-default" className="waves-effect">
                Top placement (0,25)
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              popperConfig={{ modifiers: [{ name: 'offset', options: { offset: [0, 25] } }] }}
              overlay={<Tooltip>Offset by x=0, y=25</Tooltip>}>
              <Button variant="outline-default" className="waves-effect">
                Bottom placement (0,25)
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const TriggersTooltip = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Tooltip
          <span className="fw-300">
            <i>Triggers</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>How tooltip is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space.</p>
            <p>
              <code>'manual'</code> indicates that the tooltip will be triggered programmatically via the <code>.tooltip('show')</code>,
              <code>.tooltip('hide')</code> and <code>.tooltip('toggle')</code> methods; this value cannot be combined with any other trigger.
            </p>
            <p>
              <code>'hover'</code> on its own will result in tooltips that cannot be triggered via the keyboard, and should only be used if
              alternative methods for conveying the same information for keyboard users is present.
            </p>
          </div>
          <div className="demo">
            <OverlayTrigger trigger="click" placement="top" overlay={<Tooltip>Displayed on click</Tooltip>}>
              <Button variant="outline-default" className="waves-effect">
                Click event
              </Button>
            </OverlayTrigger>
            <OverlayTrigger trigger="focus" placement="top" overlay={<Tooltip>Displayed on focus</Tooltip>}>
              <Button variant="outline-default" className="waves-effect">
                Focus event
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const TemplatingTooltip = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Tooltip
          <span className="fw-300">
            <i>Templating</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Base HTML to use when creating the tooltip. The tooltip's title will be injected into the <code>.tooltip-inner</code>. The outermost
            wrapper element should have the <code>.tooltip</code> class and <code>role="tooltip"</code>
          </div>
          <h5 className="frame-heading">Backgrounds</h5>
          <div className="frame-wrap">
            <div className="demo">
              <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-primary">This top tooltip is themed via CSS variables.</Tooltip>}>
                <Button variant="outline-primary" className="waves-effect">
                  Primary
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip className="tooltip-secondary">This top tooltip is themed via CSS variables.</Tooltip>}>
                <Button variant="outline-secondary" className="waves-effect">
                  Fusion
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-success">This top tooltip is themed via CSS variables.</Tooltip>}>
                <Button variant="outline-success" className="waves-effect">
                  Success
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-info">This top tooltip is themed via CSS variables.</Tooltip>}>
                <Button variant="outline-info" className="waves-effect">
                  Info
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-warning">This top tooltip is themed via CSS variables.</Tooltip>}>
                <Button variant="outline-warning" className="waves-effect">
                  Wraning
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-danger">This top tooltip is themed via CSS variables.</Tooltip>}>
                <Button variant="outline-danger" className="waves-effect">
                  Danger
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-dark">This top tooltip is themed via CSS variables.</Tooltip>}>
                <Button variant="outline-dark" className="waves-effect">
                  Dark
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip className="tooltip-secondary">This top tooltip is themed via CSS variables.</Tooltip>}>
                <Button variant="outline-secondary" className="waves-effect">
                  Secondary
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-light">This top tooltip is themed via CSS variables.</Tooltip>}>
                <Button variant="outline-default" className="waves-effect">
                  Light
                </Button>
              </OverlayTrigger>
            </div>
          </div>
          <h5 className="frame-heading">
            Sizing with <u>HTML</u>
          </h5>
          <div className="frame-wrap">
            <div className="demo demo-h-spacing d-flex align-items-end">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    <span className="fs-xl">Large Font</span>
                  </Tooltip>
                }>
                <Button variant="outline-default" size="lg">
                  Large Font
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    <span className="fs-xs">Small Font</span>
                  </Tooltip>
                }>
                <Button variant="outline-default" className="btn-xs">
                  Small Font
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const DelayedTooltip = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Delayed
          <span className="fw-300">
            <i>Tooltip</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Delay showing and hiding the tooltip (ms) - does not apply to manual trigger type. If a number is supplied, delay is applied to both
            hide/show. Object structure is:
            <code>
              delay: {'{'} "show": 500, "hide": 100 {'}'}
            </code>
          </div>
          <div className="demo demo-h-spacing d-flex align-items-end">
            <OverlayTrigger placement="top" delay={{ show: 1000, hide: 1000 }} overlay={<Tooltip>1s delay</Tooltip>}>
              <Button variant="outline-default" size="lg" className="waves-effect">
                1s delay
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" delay={{ show: 500, hide: 500 }} overlay={<Tooltip>0.5sec delay</Tooltip>}>
              <Button variant="outline-default" className="waves-effect">
                0.5sec delay
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" delay={{ show: 0, hide: 0 }} overlay={<Tooltip>No delay</Tooltip>}>
              <Button variant="outline-default" size="sm" className="waves-effect">
                No delay
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const TooltipContainer = () => {
  const [show, setShow] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <ComponentCard
      title={
        <h2>
          Tooltip
          <span className="fw-300">
            <i>Container</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Appends the tooltip to a specific element. Example: container: 'body'. This option is particularly useful in that it allows you to
            position the tooltip in the flow of the document near the triggering element - which will prevent the tooltip from floating away from the
            triggering element during a window resize.
          </div>
          <div className="d-flex">
            <OverlayTrigger placement="top" container={containerRef} overlay={<Tooltip>I am not really here...</Tooltip>}>
              <Link href="" className="me-auto fs-md fw-500">
                &gt;&gt; Hover to display tooltip
              </Link>
            </OverlayTrigger>
            <Button variant="danger" className="btn-xs ms-auto waves-effect" onClick={() => setShow(!show)}>
              hide container
            </Button>
          </div>
          {show && (
            <div ref={containerRef} className="p-3 rounded bg-primary-500 text-light mt-3 js-test-container">
              Toolip is nested in this container but displayed on the hovered element above. Once this container is hidden the tooltip will not be
              visible. Try hiding the container by pressing the "hide" button above
            </div>
          )}
        </div>
      </div>
    </ComponentCard>
  )
}

export const TooltipPlacement = () => {
  const getTooltip = (text: string) => <Tooltip>{text}</Tooltip>

  return (
    <ComponentCard
      title={
        <h2>
          Tooltip
          <span className="fw-300">
            <i>Placement</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            <p>
              How to position the tooltip - auto | top | bottom | left | right. When <code>auto</code> is specified, it will dynamically reorient the
              tooltip.
            </p>
            <p className="m-0">
              When a function is used to determine the placement, it is called with the tooltip DOM node as its first argument and the triggering
              element DOM node as its second. The <code>this</code> context is set to the tooltip instance.
            </p>
          </div>
          <div className="demo">
            <OverlayTrigger placement="auto" overlay={getTooltip('Tooltip on auto')}>
              <Button variant="outline-default">Auto</Button>
            </OverlayTrigger>
            <OverlayTrigger placement="left" overlay={getTooltip('Tooltip on left')}>
              <Button variant="outline-default">Left</Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={getTooltip('Tooltip on top')}>
              <Button variant="outline-default">Top</Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={getTooltip('Tooltip on bottom')}>
              <Button variant="outline-default">Bottom</Button>
            </OverlayTrigger>
            <OverlayTrigger placement="right" overlay={getTooltip('Tooltip on right')}>
              <Button variant="outline-default">Right</Button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const TooltipAnimation = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Tooltip
          <span className="fw-300">
            <i>animation</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Disable the CSS fade transition to the tooltip by using <code>data-bs-animation="false"</code>
          </div>
          <div className="demo">
            <OverlayTrigger placement="top" overlay={<Tooltip>Animated</Tooltip>}>
              <Button variant="default" className="waves-effect">Animated</Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Not Animated</Tooltip>}>
              <Button variant="default" className="waves-effect">Not Animated</Button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
