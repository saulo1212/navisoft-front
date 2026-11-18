'use client'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import ComponentCard from '@/components/ComponentCard'
import { useEffect, useState } from 'react'
import {
  getAreaOptions,
  getBarOptions,
  getCustomDonutOptions,
  getDonutOptions,
  getLineOptions,
  getNegativeBarOptions,
  getPieOptions,
  getTransitionBarOptions,
  getUpdatingChartOptions,
} from './data'

export const LineChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Line
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              You can specify the width of the strokes using <code>strokeWidth</code> inside <code>data-peity</code> attribute
            </div>
            <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLineOptions([0, -3, -6, -4, -5, -4, -7, -3, -5, -2], 'var(--success-500)', 2)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLineOptions([0, -3, -6, -4, -5, -4, -7, -3, -5, -2], 'var(--danger-500)', 2)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLineOptions([0, 1, 7, 6, 4, 2, 3, 5, 3, 4], 'var(--warning-500)', 3)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLineOptions([5, 3, 9, 6, 5, 3, 1, 7, 6, 4], 'var(--info-500)', 4)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} />
                })()}
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const BarChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Bar
            <span className="fw-light">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Bar charts can have positive or negative integers. You can change the bar colors via the following
              <code>
                data-peity='{'{'} "fill": ["var(--info-200)","var(--info-500)","var(--info-700)","var(--info-900)"] {'}'}'
              </code>
            </div>

            <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getBarOptions(
                    [5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
                    ['var(--info-200)', 'var(--info-500)', 'var(--info-700)', 'var(--info-900)'],
                  )
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" height={40} className="peity-bar" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getBarOptions(
                    [4, -3, -6, -4, -5, -4, 7, -3, -5, 2],
                    ['var(--success-200)', 'var(--success-500)', 'var(--success-700)', 'var(--success-900)'],
                  )
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" height={40} className="peity-bar" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getBarOptions(
                    [0, 1, 7, 6, 4, 2, 3, 5, 3, 4],
                    ['var(--info-500)', 'var(--success-500)', 'var(--info-600)', 'var(--success-300)'],
                  )
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" height={40} className="peity-bar" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getBarOptions(
                    [0, -1, -7, -6, -4, -2, -3, -5, -3, -4],
                    ['var(--success-200)', 'var(--success-300)', 'var(--success-400)', 'var(--success-500)'],
                  )
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" height={40} className="peity-bar" />
                })()}
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const DonutChart = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Donut
          <span className="fw-light">
            <i>Chart</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Donut charts can have any values. You can change the colors via CSS variables:
            <code>
              data-peity='{'{'} "fill": ["var(--primary-500)","var(--success-500)","var(--info-500)","var(--warning-500)"] {'}'}'
            </code>
          </div>

          <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getDonutOptions([1, 2], ['var(--info-500)', 'var(--warning-500)'])
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
              })()}
            </div>
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getDonutOptions(
                  [7, 6, 3, 4],
                  ['var(--info-500)', 'var(--warning-500)', 'var(--success-200)', 'var(--primary-100)'],
                )
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
              })()}
            </div>
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getDonutOptions([5, 6], ['var(--success-300)', 'var(--danger-500)'])
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
              })()}
            </div>
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getDonutOptions(
                  [2, 3, 4, 7, 9, 10, 5, 6],
                  [
                    'var(--warning-300)',
                    'var(--success-500)',
                    'var(--danger-300)',
                    'var(--info-500)',
                    'var(--primary-500)',
                    'var(--danger-300)',
                    'var(--info-100)',
                    'var(--danger-700)',
                  ],
                )
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
              })()}
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const DynamicChart = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Dynamic
          <span className="fw-light">
            <i>Chart</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Colors, sizes and different settings of the chart can be generated dynamically based on data values. The examples below use the
            <code>.bar-negative</code> class to show positive/negative values in different colors and <code>.bar-transition</code> class to create a
            gradient effect across bars.
          </div>

          <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getNegativeBarOptions([5, 3, 2, -1, -3, -2, 2, 3, 5, 2])
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" height={40} className="peity-bar" />
              })()}
            </div>
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getTransitionBarOptions([5, 3, 9, 6, 5, 9, 7, 3, 5, 2])
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" height={40} className="peity-bar" />
              })()}
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const AreaChart = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Area
          <span className="fw-light">
            <i>Chart</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Example of line with filling. You can add fill by using inserting
            <code>
              data-peity='{'{'} "fill": "#1dc9b7" {'}'}'
            </code>
          </div>
          <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getAreaOptions([5, 3, 2, -1, -3, -2, 2, 3, 5, 2], 'var(--success-500)', 'var(--success-200)')
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="area" height={40} className="peity-line" />
              })()}
            </div>
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getAreaOptions([1, 4, 4, 7, 5, 9, 10, 4, 4, 7, 5, 9, 10], 'var(--danger-500)', 'var(--danger-200)')
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="area" height={40} className="peity-line" />
              })()}
            </div>
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getAreaOptions([5, 3, 9, 6, 5, 3, 1, 7, 6, 4, 4, 1, 5], 'var(--warning-500)', 'var(--warning-200)')
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="area" height={40} className="peity-line" />
              })()}
            </div>
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getAreaOptions([0, 1, 7, 6, 4, 2, 3, 5, 3, 4, 3, 1, 4, 6], 'var(--info-500)', 'var(--info-200)')
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="area" height={40} className="peity-line" />
              })()}
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const PieChart = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Pie
          <span className="fw-light">
            <i>Chart</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Pie charts can have any values. You can change the colors using CSS variables:
            <code>
              data-peity='{'{'} "fill": ["var(--primary-500)","var(--success-500)","var(--info-500)","var(--warning-500)"] {'}'}'
            </code>
          </div>

          <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getPieOptions([1, 3], ['var(--warning-400)', 'var(--info-500)'])
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" height={40} className="peity-bar" />
              })()}
            </div>
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getPieOptions([7, 6, 3, 4], ['var(--info-500)', 'var(--warning-500)', 'var(--success-200)', 'var(--primary-100)'])
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" height={40} className="peity-bar" />
              })()}
            </div>
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getPieOptions([5, 5], ['var(--success-300)', 'var(--danger-500)'])
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" height={40} className="peity-bar" />
              })()}
            </div>
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              {(() => {
                const lineOptions = getPieOptions(
                  [2, 3, 4, 7, 9, 10, 5, 6],
                  [
                    'var(--warning-300)',
                    'var(--success-500)',
                    'var(--danger-300)',
                    'var(--info-500)',
                    'var(--primary-500)',
                    'var(--danger-300)',
                    'var(--info-100)',
                    'var(--danger-700)',
                  ],
                )
                return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" height={40} className="peity-bar" />
              })()}
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const UpdatingChart = () => {
  const [series, setSeries] = useState([
    {
      data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2, 5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
    },
  ])
  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prev) => {
        const newData = [...prev[0].data]
        newData.push(Math.floor(Math.random() * 10) + 1)
        newData.shift()
        return [{ data: newData }]
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <ComponentCard
      title={
        <h2>
          Updating
          <span className="fw-light">
            <i>Chart</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            This chart is automatically updated every half second using vanilla JavaScript. A new random value is generated, added to the chart data,
            and the oldest value is removed to create a live data visualization effect.
          </div>

          <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
            <div className="p-3 w-auto text-center d-inline-flex border-faded">
              <ApexChartClient getOptions={getUpdatingChartOptions()} series={series} type="area" height={40} className="peity-line" />
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export const ChartSize = () => {
  return (
    <ComponentCard
      title={
        <h2>
          Chart
          <span className="fw-light">
            <i>Sizes</i>
          </span>
        </h2>
      }
      toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Since the chart is just a generated SVG file, you can potentially generate the chart to any sizes using the values
            <code>innerRadius</code> and <code>radius</code> for pie and donut charts, and <code>width</code> and <code>height</code> for other charts
          </div>

          <div className="demo demo-h-spacing d-flex align-items-center flex-wrap">
            {(() => {
              const lineOptions = getCustomDonutOptions([1, 6], ['#fd3995', 'var(--bs-border-color)'], 37, 13)
              return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
            })()}

            {(() => {
              const lineOptions = getCustomDonutOptions([2, 5], ['#ffc241', 'var(--bs-border-color)'], 30, 10)
              return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
            })()}
            {(() => {
              const lineOptions = getCustomDonutOptions([3, 4], ['#ffdb8e', 'var(--bs-border-color)'], 28, 20)
              return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
            })()}

            {(() => {
              const lineOptions = getCustomDonutOptions([4, 3], ['#1dc9b7', 'var(--bs-border-color)'], 25, 20)
              return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
            })()}

            {(() => {
              const lineOptions = getCustomDonutOptions([5, 2], ['#2196f3', 'var(--bs-border-color)'], 21, 17)
              return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
            })()}
            {(() => {
              const lineOptions = getCustomDonutOptions([6, 1], ['#886ab5', 'var(--bs-border-color)'], 18, 15)
              return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
            })()}
            {(() => {
              const lineOptions = getCustomDonutOptions([7], ['#5d5d5d'], 15, 13)
              return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="donut" height={40} className="peity-donut" />
            })()}
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}
