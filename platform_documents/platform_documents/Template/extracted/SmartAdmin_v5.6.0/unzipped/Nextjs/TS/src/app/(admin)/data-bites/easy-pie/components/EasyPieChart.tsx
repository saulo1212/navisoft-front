'use client'
import avatar from '@/assets/img/demo/avatars/avatar-admin.png'
import EasyPieChart from '@/components/client-wrappers/PieChartClient'
import ComponentCard from '@/components/ComponentCard'
import Image from 'next/image'
import { useState } from 'react'

export const ColorChange = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Color
            <span className="fw-300">
              <i>Change</i>
            </span>
          </h2>
        }
        simpleDots={true}>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Colors are inherited from the parent font color, so you could literally change the any of the font colors available within this WebApp
              <code>.js-easy-pie-chart.color-danger-500</code>
            </div>
            <div className="demo">
              <EasyPieChart className="text-danger d-inline-flex" percent={30} piesize={95} scalelength={3} />
              <EasyPieChart className="text-success d-inline-flex" percent={60} piesize={95} scalelength={3} />
              <EasyPieChart className="text-primary d-inline-flex" percent={90} piesize={95} scalelength={3} />
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const ScaleColor = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Scale
          <span className="fw-300">
            <i>& Color</i>
          </span>
        </h2>
      }
      simpleDots={true}>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Change the size of the chart using <code>data-piesize</code> and the line width by using <code>data-linewidth</code>
          </div>
          <div className="demo">
            <EasyPieChart className="text-danger d-inline-flex" percent={30} piesize={95} linewidth={40} scalelength={2} />
            <EasyPieChart className="text-success d-inline-flex" percent={60} piesize={80} linewidth={20} scalelength={2} />
            <EasyPieChart className="text-primary d-inline-flex" percent={75} piesize={50} linewidth={5} scalelength={2} />
            <EasyPieChart className="text-info d-inline-flex" percent={95} piesize={30} linewidth={3} scalelength={2} />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const DataPercentage = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Data
          <span className="fw-300">
            <i>Percentage</i>
          </span>
        </h2>
      }
      simpleDots={true}>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Data percentage is displayed by using various class utilities and a container with the class <code>.js-percent</code>
          </div>
          <div className="demo">
            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: 95, height: 95 }}>
              <EasyPieChart
                className="text-primary position-relative d-inline-flex align-items-center justify-content-center"
                percent={86}
                piesize={95}
                linewidth={5}
                scalelength={7}
                linecap="round"
              />
              <div className="d-flex flex-column align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-xl pointer-events-none">
                <span className="d-block text-dark">{86}</span>
                <div className="d-block fs-xs text-dark opacity-70">
                  <small>Memory</small>
                </div>
              </div>
            </div>
            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
              <EasyPieChart
                className="text-primary position-relative d-inline-flex align-items-center justify-content-center"
                percent={46}
                piesize={80}
                linewidth={5}
                scalelength={5}
                linecap="round"
              />
              <div className="d-flex flex-column align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-lg pointer-events-none">
                <span className="d-block text-dark">{46}</span>
                <div className="d-block fs-xs text-dark opacity-70">
                  <small>CPU</small>
                </div>
              </div>
            </div>
            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: 70, height: 70 }}>
              <EasyPieChart
                className="text-primary position-relative d-inline-flex align-items-center justify-content-center"
                percent={56}
                piesize={70}
                linewidth={5}
                scalelength={4}
                linecap="round"
              />
              <div className="d-flex align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fs-md pointer-events-none">
                <span className="d-block text-primary">{56}</span>
              </div>
            </div>
            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
              <EasyPieChart
                className="text-primary position-relative d-inline-flex align-items-center justify-content-center"
                percent={36}
                piesize={60}
                linewidth={5}
                scalelength={3}
                linecap="round"
              />
              <div className="d-flex align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-xs pointer-events-none">
                <span className="text-primary">{36}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const AvatarUsage = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Avatar
          <span className="fw-300">
            <i>Usage</i>
          </span>
        </h2>
      }
      simpleDots={true}>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Here we nested the image using various class utilities to center it within the graph. The graph is also using{' '}
            <code>data-scalelength</code> to change the scales to various sizes
          </div>
          <div className="demo">
            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: 95, height: 95 }}>
              <EasyPieChart
                className="text-danger position-relative d-inline-flex align-items-center justify-content-center"
                percent={75}
                piesize={95}
                linewidth={10}
                scalelength={5}
              />
              <div className="d-flex align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom pointer-events-none">
                <Image src={avatar} className="profile-image rounded-circle" alt="Dr. Codex Lantern" />
              </div>
            </div>

            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
              <EasyPieChart
                className="text-success position-relative d-inline-flex align-items-center justify-content-center"
                percent={86}
                piesize={80}
                linewidth={7}
                scalelength={4}
              />
              <div className="d-flex align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom pointer-events-none">
                <Image src={avatar} className="profile-image-md rounded-circle" alt="Dr. Codex Lantern" />
              </div>
            </div>

            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
              <EasyPieChart
                className="text-info position-relative d-inline-flex align-items-center justify-content-center"
                percent={65}
                piesize={50}
                linewidth={3}
                scalelength={1}
                scalecolor="#fff"
              />
              <div className="d-flex align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom pointer-events-none">
                <Image src={avatar} className="profile-image-sm rounded-circle" alt="Dr. Codex Lantern" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const NestedCharts = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Nested
          <span className="fw-300">
            <i>Charts</i>
          </span>
        </h2>
      }
      simpleDots={true}>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Just as the example above, we can create nested charts by using the <code>position-absolute</code> utility
          </div>
          <div className="demo">
            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: 95, height: 95 }}>
              <EasyPieChart className="text-danger" percent={35} piesize={95} linewidth={10} scalelength={5} />

              <div className="position-absolute d-flex align-items-center justify-content-center">
                <EasyPieChart className="text-info" percent={65} piesize={60} linewidth={5} scalelength={1} scalecolor="#fff" />
              </div>

              <div className="position-absolute d-flex align-items-center justify-content-center">
                <EasyPieChart className="text-success" percent={35} piesize={40} linewidth={3} scalelength={1} scalecolor="#fff" />
              </div>

              <div className="d-flex align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-xs pointer-events-none">
                <span>{35}</span>
              </div>
            </div>
            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: 95, height: 95 }}>
              <EasyPieChart className="text-primary" percent={35} piesize={95} linewidth={10} scalelength={5} />

              <div className="position-absolute d-flex align-items-center justify-content-center">
                <EasyPieChart className="text-primary" percent={65} piesize={60} linewidth={5} scalelength={1} scalecolor="#fff" />
              </div>

              <div className="position-absolute d-flex align-items-center justify-content-center">
                <EasyPieChart className="color-primary-400" percent={35} piesize={40} linewidth={3} scalelength={1} scalecolor="#fff" />
              </div>

              <div className="d-flex align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-xs text-primary pointer-events-none">
                <span>{35}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const DynamicUsage = () => {
  const [percent, setPercent] = useState<number>(50)

  const handleUpdateChart = () => {
    const randomPercent = Math.floor(Math.random() * 101)
    setPercent(randomPercent)
  }

  return (
    <ComponentCard
      title={
        <h2>
          Dynamic{' '}
          <span className="fw-300">
            <i>Usage</i>
          </span>
        </h2>
      }
      simpleDots={true}>
      <div className="panel-container show">
        <div className="panel-content">
          <div id="update-chart" className="d-flex flex-column align-items-center">
            <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: 145, height: 145 }}>
              <EasyPieChart
                className="text-primary position-relative d-flex align-items-center justify-content-center"
                percent={percent}
                piesize={145}
                linewidth={20}
                scalelength={8}
              />

              <div className="d-flex flex-column align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-xl pointer-events-none">
                <span className="d-block text-dark">{percent}</span>
                <div className="d-block fs-xs text-dark opacity-70">
                  <small>Random</small>
                </div>
              </div>
            </div>

            <button type="button" className="js-update btn btn-outline-primary mt-3" onClick={handleUpdateChart}>
              Update Chart
            </button>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
