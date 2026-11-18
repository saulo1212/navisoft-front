'use client'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import ComponentCard from '@/components/ComponentCard'
import { getBasicScatterOptions, getCategoryScatterOptions, getDatetimeScatterOptions, getImageScatterOptions, getImagesScatterOptions } from './data'

export const BasicScatterChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Basic
            <span className="fw-light">
              <i>Scatter</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getBasicScatterOptions} series={getBasicScatterOptions().series} type="scatter" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const ScatterImagesChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Scatter - Images
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getImagesScatterOptions} series={getImagesScatterOptions().series} type="scatter" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const ScatterImageChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Scatter - Image
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getImageScatterOptions} series={getImageScatterOptions().series} type="scatter" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const DatetimeScatterChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Scatter - Datetime
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getDatetimeScatterOptions} series={getDatetimeScatterOptions().series} type="scatter" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const CategoryScatterChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Scatter - Category
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container">
          <div className="panel-content">
            <ApexChartClient getOptions={getCategoryScatterOptions} series={getCategoryScatterOptions().series} type="scatter" height={350} />
          </div>
        </div>
      </ComponentCard>
    </>
  )
}
