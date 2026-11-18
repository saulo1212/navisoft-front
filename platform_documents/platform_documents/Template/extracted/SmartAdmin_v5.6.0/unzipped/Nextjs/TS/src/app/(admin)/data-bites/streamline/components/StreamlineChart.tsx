'use client'
import ApexChartClient from '@/components/client-wrappers/ApexChartClient'
import ComponentCard from '@/components/ComponentCard'
import { getBarOptions, getDiscreteOptions, getLineOptions, getLinesOptions, getPieOptions, getTristateOptions } from './data'

export const LineChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Line
            <span className="fw-300">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Line charts display data points connected by straight line segments. You can customize the line color and width using{' '}
              <code>data-line-color</code> and <code>data-line-width</code> attributes.
            </div>
            <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLinesOptions([5, 3, 9, 6, 5, 9, 7, 3, 5, 2], 'var(--success-500)', 2)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLinesOptions([0, -3, -6, -4, -5, -4, -7, -3, -5, -2], 'var(--danger-500)', 2)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLinesOptions([0, 1, 7, 6, 4, 2, 3, 5, 3, 4], 'var(--warning-500)', 3)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLinesOptions([5, 3, 9, 6, 5, 3, 1, 7, 6, 4], 'var(--info-500)', 4)
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
            <span className="fw-300">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Bar charts display data as vertical bars. You can customize bar colors, width, and spacing using data attributes.
            </div>
            <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getBarOptions([5, 3, 9, 6, 5, 9, 7, 3, 5, 2], 'var(--primary-500)', undefined, 40, 110, 4)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" className="streamline" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getBarOptions([4, -3, -6, -4, -5, -4, 7, -3, -5, 2], 'var(--success-500)', 'var(--danger-500)', 40, 110, 4)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" className="streamline" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getBarOptions([0, 1, 7, 6, 4, 2, 3, 5, 3, 4], 'var(--info-500)', undefined, 40, 110, 8)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" className="streamline" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getBarOptions([0, -1, -7, -6, -4, -2, -3, -5, -3, -4], 'var(--warning-500)', 'var(--danger-500)', 40, 110, 8)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="bar" className="streamline" />
                })()}
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const TristateChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Tristate
            <span className="fw-300">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Tristate charts represent data in three states: positive (1), neutral (0), and negative (-1). Each state can be represented with
              different colors.
            </div>
            <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getTristateOptions(
                    [1, 1, 0, 1, -1, -1, 1, -1, 0, 0, 1, 1],
                    'var(--success-500)',
                    'var(--danger-500)',
                    'var(--secondary)',
                    80,
                    110,
                    2,
                  )
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="rangeBar" height={80} className="streamline" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getTristateOptions(
                    [1, -1, 0, 1, -1, 0, 1, 0, -1, 1, 0, -1],
                    'var(--primary-500)',
                    'var(--info-500)',
                    'var(--warning-500)',
                    80,
                    110,
                    2,
                  )
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="rangeBar" height={80} className="streamline" />
                })()}
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const AreaChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Area
            <span className="fw-300">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Area charts are line charts with the area below the line filled with a color. Customize both line and fill colors using data attributes.
            </div>
            <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLineOptions([5, 3, 2, -1, -3, -2, 2, 3, 5, 2], 'var(--success-500)', 'var(--success-200)', 40, 110, 2)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} className="streamline" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLineOptions([1, 4, 4, 7, 5, 9, 10, 4, 4, 7, 5, 9, 10], 'var(--danger-500)', 'var(--danger-200)', 40, 110, 2)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} className="streamline" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLineOptions([5, 3, 9, 6, 5, 3, 1, 7, 6, 4, 4, 1, 5], 'var(--warning-500)', 'var(--warning-200)', 40, 110, 2)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} className="streamline" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getLineOptions([0, 1, 7, 6, 4, 2, 3, 5, 3, 4, 3, 1, 4, 6], 'var(--info-500)', 'var(--info-200)', 40, 110, 2)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="line" height={40} className="streamline" />
                })()}
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const DiscreteChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Discrete
            <span className="fw-300">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Discrete charts display data as individual vertical lines. Set a threshold value to change the color of lines based on their values.
            </div>
            <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getDiscreteOptions(
                    [5, 9, 7, 6, 5, 3, 2, 5, 8, 9, 7, 5],
                    'var(--primary-500)',
                    'var(--danger-500)',
                    5,
                    40,
                    110,
                    2,
                  )
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="rangeBar" height={40} className="streamline" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getDiscreteOptions(
                    [8, 4, 6, 9, 5, 3, 7, 5, 7, 8, 4, 9],
                    'var(--success-500)',
                    'var(--warning-500)',
                    6,
                    40,
                    110,
                    3,
                  )
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="rangeBar" height={40} className="streamline" />
                })()}
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}

export const PieChart = () => {
  return (
    <>
      <ComponentCard
        title={
          <h2>
            Pie
            <span className="fw-300">
              <i>Chart</i>
            </span>
          </h2>
        }
        toolbox>
        <div className="panel-container show">
          <div className="panel-content">
            <div className="panel-tag">
              Pie charts show data as proportional slices of a whole. You can customize slice colors using the <code>data-slice-colors</code>{' '}
              attribute with an array of colors.
            </div>
            <div className="demo d-flex justify-content-center flex-wrap d-sm-block">
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getPieOptions(
                    [30, 20, 45, 5],
                    ['var(--primary-500)', 'var(--danger-500)', 'var(--success-500)', 'var(--info-500)'],
                    80,
                    80,
                  )
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="pie" height={80} className="streamline" />
                })()}
              </div>
              <div className="p-3 w-auto text-center d-inline-flex border-faded">
                {(() => {
                  const lineOptions = getPieOptions([7, 6, 3], ['var(--info-500)', 'var(--warning-500)', 'var(--success-200)'], 80, 80)
                  return <ApexChartClient getOptions={lineOptions} series={lineOptions().series} type="pie" height={80} className="streamline" />
                })()}
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  )
}
