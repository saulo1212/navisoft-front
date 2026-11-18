'use client'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import ComponentCard from '@/components/ComponentCard'
import {
  getBarWithImagesOptions,
  getBarWithMarkersOptions,
  getBasicBarChartOptions,
  getCustomDatalabelsBarOptions,
  getGroupedBarChartOptions,
  getGroupedStackedBarChartOptions,
  getNegativeBarChartOptions,
  getPatternedBarChartOptions,
  getReversedBarChartOptions,
  getStacked100BarChartOptions,
  getStackedBarChartOptions,
} from './data'

export const BasicBar = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Basic
            <span className="fw-light">
              <i>Bar</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getBasicBarChartOptions} series={getBasicBarChartOptions().series} type="bar" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const StackedBar = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Stacked
          <span className="fw-light">
            <i>Bar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getStackedBarChartOptions} series={getStackedBarChartOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const GroupedStacked = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Grouped Stacked Bars
          <span className="fw-light">
            <i>Bar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getGroupedStackedBarChartOptions} series={getGroupedStackedBarChartOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const BarwithMarkers = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Bar with Markers
          <span className="fw-light">
            <i>Bar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBarWithMarkersOptions} series={getBarWithMarkersOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const CustomDataLabels = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Custom DataLabels Bar
          <span className="fw-light">
            <i>Bar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getCustomDatalabelsBarOptions} series={getCustomDatalabelsBarOptions().series} type="bar" height={380} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const BarWithImages = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Bar with Images
          <span className="fw-light">
            <i>Bar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getBarWithImagesOptions} series={getBarWithImagesOptions().series} type="bar" height={410} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const GroupedBar = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Grouped
          <span className="fw-light">
            <i>Bar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getGroupedBarChartOptions} series={getGroupedBarChartOptions().series} type="bar" height={440} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const StackedBars = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Stacked Bars 100
          <span className="fw-light">
            <i>Bar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getStacked100BarChartOptions} series={getStacked100BarChartOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const BarWithNegativeValues = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Bar with Negative Values
          <span className="fw-light">
            <i>Bar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getNegativeBarChartOptions} series={getNegativeBarChartOptions().series} type="bar" height={440} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const ReversedBarChart = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Reversed Bar Chart
          <span className="fw-light">
            <i>Bar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getReversedBarChartOptions} series={getReversedBarChartOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}

export const PatternedBarChart = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Patterned
          <span className="fw-light">
            <i>Bar</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container">
        <div className="panel-content">
          <ApexChartClient getOptions={getPatternedBarChartOptions} series={getPatternedBarChartOptions().series} type="bar" height={350} />
        </div>
      </div>
    </ComponentCard>
  )
}
