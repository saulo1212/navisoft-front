import { getColor } from '@/utils/getColor'
import { ApexOptions, ApexTooltip } from 'apexcharts'

type MixedTooltipOpts = {
  seriesIndex: number
  dataPointIndex: number
  ctx: { w: { globals: { initialSeries: { data: { x: number; y: number | number[] }[] }[] } } }
}

export function generateScatterData(count: number, min: number, max: number) {
  const data = []
  for (let i = 0; i < count; i++) {
    const x = min + Math.random() * (max - min)
    const y = min + Math.random() * (max - min)
    data.push({ x, y })
  }
  return data
}

export const getLineColumnOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Website',
      type: 'column',
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
    },
    {
      name: 'Social Media',
      type: 'line',
      data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: true,
    },
  },
  stroke: {
    width: [0, 4],
  },
  title: {
    text: 'Traffic Sources',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1],
  },
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  xaxis: {
    type: 'category',
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: [
    {
      title: {
        text: 'Website Visits',
        style: {
          color: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
      labels: {
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
    },
    {
      opposite: true,
      title: {
        text: 'Social Media',
        style: {
          color: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
      labels: {
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
    },
  ],
  colors: [getColor('primary', 500), getColor('danger', 500)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
})

export const getMultipleYAxisOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Income',
      type: 'column',
      data: [1.4, 2.1, 4.9, 6.5, 8.2, 7.1, 5.6, 4.2, 3.5, 2.8, 2.3, 1.8],
    },
    {
      name: 'Cashflow',
      type: 'column',
      data: [1.1, 3.2, 4.3, 5.8, 8.4, 6.5, 4.9, 3.9, 3.1, 2.5, 2.0, 1.5],
    },
    {
      name: 'Revenue',
      type: 'line',
      data: [20, 29, 37, 46, 56, 42, 35, 30, 25, 22, 17, 15],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    stacked: false,
    toolbar: {
      show: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [1, 1, 4],
  },
  title: {
    text: 'Financial Overview (Multiple Y-axis)',
    align: 'left',
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yaxis: [
    {
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: getColor('primary', 500),
      },
      labels: {
        style: {
          colors: getColor('primary', 500),
        },
      },
      title: {
        text: 'Income (thousand $)',
        style: {
          color: getColor('primary', 500),
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    {
      seriesName: 'Income',
      opposite: true,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: getColor('primary', 300),
      },
      labels: {
        style: {
          colors: getColor('primary', 300),
        },
      },
      title: {
        text: 'Cashflow (thousand $)',
        style: {
          color: getColor('primary', 300),
        },
      },
    },
    {
      seriesName: 'Revenue',
      opposite: true,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: getColor('danger', 500),
      },
      labels: {
        style: {
          colors: getColor('danger', 500),
        },
      },
      title: {
        text: 'Revenue (thousand $)',
        style: {
          color: getColor('danger', 500),
        },
      },
    },
  ],
  tooltip: {
    y: {
      formatter: (val: number) => {
        return val + ' thousand $'
      },
    },
  },
  legend: {
    horizontalAlign: 'center',
    position: 'bottom',
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('danger', 500)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
})

export const getLineAreaOptions = (): ApexOptions => ({
  series: [
    {
      name: 'TEAM A',
      type: 'area',
      data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33],
    },
    {
      name: 'TEAM B',
      type: 'line',
      data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: true,
    },
  },
  stroke: {
    curve: 'smooth',
    width: [3, 3],
  },
  fill: {
    type: ['gradient', 'solid'],
    opacity: [0.35, 1],
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.4,
      // gradientToColors: [getColor('bootstrapVars', 'bodyBg', 'hex')],
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100],
    },
  },
  labels: ['Dec 01', 'Dec 02', 'Dec 03', 'Dec 04', 'Dec 05', 'Dec 06', 'Dec 07', 'Dec 08', 'Dec 09', 'Dec 10', 'Dec 11'],
  markers: {
    size: 0,
  },
  title: {
    text: 'Team Performance',
    align: 'left',
  },
  yaxis: [
    {
      title: {
        text: 'Series A',
        style: {
          color: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
      labels: {
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
    },
    {
      opposite: true,
      title: {
        text: 'Series B',
        style: {
          color: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
      labels: {
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val: number) => {
        return val.toFixed(0) + ' points'
      },
    },
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
  colors: [getColor('primary', 500), getColor('danger', 500)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
})

export const getLineColumnAreaOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Revenue',
      type: 'column',
      data: [1.4, 2.3, 3.5, 4.2, 5.1, 4.3, 3.8, 3.2, 2.9, 3.5, 4.2, 4.8],
    },
    {
      name: 'Free Cash Flow',
      type: 'area',
      data: [0.9, 1.5, 2.2, 3.1, 3.8, 3.5, 3.2, 2.8, 2.5, 2.9, 3.5, 4.0],
    },
    {
      name: 'Operating Margin',
      type: 'line',
      data: [15, 18, 20, 22, 25, 23, 21, 19, 20, 22, 24, 26],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    stacked: false,
    toolbar: {
      show: true,
    },
  },
  stroke: {
    width: [0, 2, 4],
    curve: 'smooth',
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
    },
  },
  fill: {
    type: ['solid', 'gradient', 'solid'],
    opacity: [0.85, 0.25, 1],
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.4,
      gradientToColors: [getColor('bootstrapVars', 'bodyBg', 'hex')],
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100],
    },
  },
  markers: {
    size: 0,
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yaxis: [
    {
      title: {
        text: 'Revenue (billions)',
        style: {
          color: getColor('primary', 500),
        },
      },
      labels: {
        formatter: (val: number) => {
          return '$' + val.toFixed(1) + 'B'
        },
        style: {
          colors: getColor('primary', 500),
        },
      },
    },
    {
      seriesName: 'Free Cash Flow',
      title: {
        text: 'Free Cash Flow (billions)',
        style: {
          color: getColor('primary', 300),
        },
      },
      opposite: true,
      labels: {
        formatter: (val: number) => {
          return '$' + val.toFixed(1) + 'B'
        },
        style: {
          colors: getColor('primary', 300),
        },
      },
    },
    {
      seriesName: 'Operating Margin',
      title: {
        text: 'Operating Margin (%)',
        style: {
          color: getColor('danger', 500),
        },
      },
      opposite: true,
      labels: {
        formatter: (val: number) => {
          return val.toFixed(0) + '%'
        },
        style: {
          colors: getColor('danger', 500),
        },
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: [
      {
        formatter: (y: number) => {
          if (typeof y !== 'undefined') {
            return '$' + y.toFixed(2) + ' billion'
          }
          return y
        },
      },
      {
        formatter: (y: number) => {
          if (typeof y !== 'undefined') {
            return '$' + y.toFixed(2) + ' billion'
          }
          return y
        },
      },
      {
        formatter: (y: number) => {
          if (typeof y !== 'undefined') {
            return y.toFixed(1) + '%'
          }
          return y
        },
      },
    ],
  },
  title: {
    text: 'Financial Performance Overview',
    align: 'left',
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('danger', 500)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
})

export const getCandlestickLineOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Candle',
      type: 'candlestick',
      data: [
        { x: new Date(2016, 1, 1), y: [51.98, 56.29, 51.59, 53.85] },
        { x: new Date(2016, 2, 1), y: [53.66, 54.99, 51.35, 52.95] },
        { x: new Date(2016, 3, 1), y: [52.96, 53.78, 51.54, 52.48] },
        { x: new Date(2016, 4, 1), y: [52.54, 52.79, 47.88, 49.24] },
        { x: new Date(2016, 5, 1), y: [49.1, 52.86, 47.7, 52.78] },
        { x: new Date(2016, 6, 1), y: [52.83, 53.48, 50.32, 52.29] },
        { x: new Date(2016, 7, 1), y: [52.2, 54.48, 51.64, 52.58] },
        { x: new Date(2016, 8, 1), y: [52.76, 57.35, 52.15, 57.03] },
        { x: new Date(2016, 9, 1), y: [57.04, 58.15, 48.88, 56.19] },
        { x: new Date(2016, 10, 1), y: [56.09, 58.85, 55.48, 58.79] },
        { x: new Date(2016, 11, 1), y: [58.78, 59.65, 58.23, 59.05] },
        { x: new Date(2017, 0, 1), y: [59.37, 61.11, 59.35, 60.34] },
        { x: new Date(2017, 1, 1), y: [60.4, 60.52, 56.71, 56.93] },
        { x: new Date(2017, 2, 1), y: [57.02, 59.71, 56.04, 56.82] },
        { x: new Date(2017, 3, 1), y: [56.97, 59.62, 54.77, 59.3] },
        { x: new Date(2017, 4, 1), y: [59.11, 62.29, 59.1, 59.85] },
      ],
    },
    {
      name: 'Moving Average',
      type: 'line',
      data: [
        { x: new Date(2016, 1, 1), y: 53.85 },
        { x: new Date(2016, 2, 1), y: 53.4 },
        { x: new Date(2016, 3, 1), y: 52.93 },
        { x: new Date(2016, 4, 1), y: 51.08 },
        { x: new Date(2016, 5, 1), y: 51.94 },
        { x: new Date(2016, 6, 1), y: 52.05 },
        { x: new Date(2016, 7, 1), y: 52.32 },
        { x: new Date(2016, 8, 1), y: 54.71 },
        { x: new Date(2016, 9, 1), y: 55.44 },
        { x: new Date(2016, 10, 1), y: 57.14 },
        { x: new Date(2016, 11, 1), y: 58.02 },
        { x: new Date(2017, 0, 1), y: 59.17 },
        { x: new Date(2017, 1, 1), y: 58.63 },
        { x: new Date(2017, 2, 1), y: 56.93 },
        { x: new Date(2017, 3, 1), y: 57.41 },
        { x: new Date(2017, 4, 1), y: 59.63 },
      ],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: true,
    },
  },
  title: {
    text: 'Stock Market Analysis',
    align: 'left',
  },
  stroke: {
    width: [0, 3],
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
    labels: {
      formatter: (val: number) => {
        return '$' + val.toFixed(2)
      },
    },
  },
  tooltip: {
    shared: true,
    custom: [
      {
        seriesIndex: 0,
        formatter: (opts: MixedTooltipOpts) => {
          const data = opts.ctx.w.globals.initialSeries[opts.seriesIndex].data[opts.dataPointIndex]
          return `
            <div class="p-2">
                <div>Date: ${new Date(data.x).toLocaleDateString()}</div>
                <div>Open: $${(data.y as number[])[0].toFixed(2)}</div>
                <div>High: $${(data.y as number[])[1].toFixed(2)}</div>
                <div>Low: $${(data.y as number[])[2].toFixed(2)}</div>
                <div>Close: $${(data.y as number[])[3].toFixed(2)}</div>
            </div>
          `
        },
      },
      {
        seriesIndex: 1,
        formatter: (opts: MixedTooltipOpts) => {
          const data = opts.ctx.w.globals.initialSeries[opts.seriesIndex].data[opts.dataPointIndex]
          return `
            <div class="p-2">
                <div>Date: ${new Date(data.x).toLocaleDateString()}</div>
                <div>MA: $${(data.y as number).toFixed(2)}</div>
            </div>
          `
        },
      },
    ] as unknown as ApexTooltip['custom'],
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: getColor('primary', 500),
        downward: getColor('danger', 500),
      },
    },
  },
  colors: [getColor('primary', 500), getColor('danger', 500)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
})

export const getLineScatterOptions = (scatterData: any[]): ApexOptions => ({
  series: [
    {
      name: 'Trend Line',
      type: 'line',
      data: [
        { x: 0, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 5 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
        { x: 5, y: 9 },
        { x: 6, y: 11 },
        { x: 7, y: 12 },
        { x: 8, y: 14 },
        { x: 9, y: 15 },
        { x: 10, y: 16 },
      ],
    },
    {
      name: 'Group A',
      type: 'scatter',
      data: scatterData[0],
    },
    {
      name: 'Group B',
      type: 'scatter',
      data: scatterData[1],
    },
    {
      name: 'Group C',
      type: 'scatter',
      data: scatterData[2],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
      type: 'xy',
    },
  },
  stroke: {
    width: [3, 0, 0, 0],
    curve: 'straight',
  },
  fill: {
    opacity: [1, 0.7, 0.7, 0.7],
  },
  markers: {
    size: [0, 6, 6, 6],
    hover: {
      size: 8,
    },
  },
  title: {
    text: 'Line and Scatter Combination',
    align: 'left',
  },
  subtitle: {
    text: 'Linear Trend with Data Points',
    align: 'left',
  },
  xaxis: {
    type: 'numeric',
    min: 0,
    max: 10,
    tickAmount: 10,
    title: {
      text: 'X Axis',
    },
  },
  yaxis: {
    min: 0,
    max: 20,
    title: {
      text: 'Y Axis',
    },
    labels: {
      formatter: (val: number) => {
        return val.toFixed(1)
      },
    },
  },
  tooltip: {
    shared: false,
    intersect: true,
    x: {
      show: true,
      format: '0.0',
    },
    y: {
      formatter: (val: number) => {
        return val.toFixed(2)
      },
    },
    marker: {
      show: true,
    },
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('primary', 200), getColor('danger', 500)],
})
