'use client'
import ComponentCard from '@/components/ComponentCard'
import { useState } from 'react'
import { Button, ProgressBar } from 'react-bootstrap'

export const DefaultProgress = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Default
          <span className="fw-300">
            <i>Progressbar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            The <code>.progress</code> is a wrapper to indicate the max value of the progress bar. We use the inner <code>.progress-bar</code> to
            indicate the progress so far. The <code>.progress-bar</code> requires an inline style, utility class, or custom CSS to set their width.
            You can add some role and aria attributes to make it accessible.
          </div>

          <ProgressBar now={65} min={0} max={100} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const AnimatedBars = () => {
  const [isAnimated, setIsAnimated] = useState(true)

  const handleToggleAnimation = () => {
    setIsAnimated((prev) => !prev)
  }
  return (
    <ComponentCard
      title={
        <h2>
          Animated
          <span className="fw-300">
            <i>bars</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            The striped gradient can also be animated. Add <code>.progress-bar-animated</code> to <code>.progress-bar</code> to animate the stripes
            right to left via CSS3 animations.
          </div>
          <div className="demo js-progress-animated">
            <ProgressBar now={60} min={0} max={100} animated={isAnimated} striped variant="primary" style={{ height: 30 }} />
          </div>
          <Button variant="secondary" active={isAnimated} onClick={handleToggleAnimation}>
            Toggle animation
          </Button>
        </div>
      </div>
    </ComponentCard>
  )
}

export const StripedBackrounds = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Striped
          <span className="fw-300">
            <i>backrounds</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add <code>.progress-bar-striped</code> to any <code>.progress-bar</code> to apply a stripe via CSS gradient over the progress bar’s
            background color
          </div>
          <div className="demo-v-spacing">
            <ProgressBar now={20} min={0} max={100} striped variant="secondary" />
            <ProgressBar now={30} min={0} max={100} striped variant="primary" />
            <ProgressBar now={40} min={0} max={100} striped variant="success" />
            <ProgressBar now={50} min={0} max={100} striped variant="info" />
            <ProgressBar now={60} min={0} max={100} striped variant="warning" />
            <ProgressBar now={80} min={0} max={100} striped variant="danger" />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const GradientBackgrounds = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Gradient
          <span className="fw-300">
            <i>backgrounds</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Control the background by adding avaialble
            <a href="/utilities/colorpalette" target="_blank">
              color pallets
            </a>
            to <code>.progress</code> class
          </div>
          <div className="demo-v-spacing">
            <ProgressBar>
              <ProgressBar now={20} min={0} max={100} className="bg-primary-700 bg-success-gradient" />
            </ProgressBar>
            <ProgressBar>
              <ProgressBar now={30} min={0} max={100} className="bg-primary-300 bg-primary-gradient" />
            </ProgressBar>
            <ProgressBar>
              <ProgressBar now={40} min={0} max={100} className="bg-success-700 bg-primary-gradient" />
            </ProgressBar>
            <ProgressBar>
              <ProgressBar now={50} min={0} max={100} className="bg-info bg-info-gradient" />
            </ProgressBar>
            <ProgressBar>
              <ProgressBar now={60} min={0} max={100} className="bg-danger-300 bg-warning-gradient" />
            </ProgressBar>
            <ProgressBar>
              <ProgressBar now={80} min={0} max={100} className="bg-success-500 bg-danger-gradient" />
            </ProgressBar>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const MultipleBars = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Multiple
          <span className="fw-300">
            <i>bars</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">Include multiple progress bars in a progress component if you need</div>
          <ProgressBar className="progress">
            <ProgressBar now={10} min={0} max={100} />
            <ProgressBar now={20} min={0} max={100} variant="success" />
            <ProgressBar now={15} min={0} max={100} variant="info" />
          </ProgressBar>
        </div>
      </div>
    </ComponentCard>
  )
}

export const SolidBackgrounds = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Solid
          <span className="fw-300">
            <i>backgrounds</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Control the background by adding avaialble
            <a href="/utilities/colorpalette" target="_blank">
              color pallets
            </a>
            to <code>.progress</code> class
          </div>
          <div className="demo-v-spacing">
            <ProgressBar variant="secondary" now={20} min={0} max={100} />
            <ProgressBar variant="primary" now={30} min={0} max={100} />
            <ProgressBar variant="success" now={40} min={0} max={100} />
            <ProgressBar variant="info" now={50} min={0} max={100} />
            <ProgressBar variant="warning" now={60} min={0} max={100} />
            <ProgressBar variant="danger" now={80} min={0} max={100} />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const LabelDisplay = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Label
          <span className="fw-300">
            <i>display</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Add labels to your progress bars by placing text within the <code>.progress-bar</code>
          </div>
          <ProgressBar now={25} label="25%" />
        </div>
      </div>
    </ComponentCard>
  )
}

export const VariousHeight = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Various
          <span className="fw-300">
            <i>height</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Control the height by adding style <code>height:"value"</code> to <code>.progress</code> element or you could use the prebuilt classes for
            a more uniform structure, <code>.progress-xs</code>, <code>.progress-sm</code>, <code>.progress-md</code>, <code>.progress-lg</code>,
            <code>.progress-xl</code>
          </div>
          <div className="demo-v-spacing">
            <ProgressBar now={75} min={0} max={100} style={{ height: 5 }} />
            <ProgressBar now={55} min={0} max={100} style={{ height: 8 }} />
            <ProgressBar now={35} min={0} max={100} style={{ height: 14 }} />
            <ProgressBar now={25} min={0} max={100} style={{ height: 20 }} />
            <ProgressBar now={15} min={0} max={100} style={{ height: 30 }} />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
