import { getColor } from '@/utils/getColor'
import { ApexOptions } from 'apexcharts'

export const getBasicRangeAreaOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Temperature Range',
      data: [
        { x: 'Jan', y: [5, 15] },
        { x: 'Feb', y: [7, 18] },
        { x: 'Mar', y: [10, 22] },
        { x: 'Apr', y: [15, 25] },
        { x: 'May', y: [18, 30] },
        { x: 'Jun', y: [22, 35] },
        { x: 'Jul', y: [25, 38] },
        { x: 'Aug', y: [23, 36] },
        { x: 'Sep', y: [20, 32] },
        { x: 'Oct', y: [15, 26] },
        { x: 'Nov', y: [10, 20] },
        { x: 'Dec', y: [6, 16] },
      ],
    },
  ],
  chart: {
    type: 'rangeArea',
    height: 350,
    zoom: {
      enabled: false,
    },
  },
  colors: ['#3F80EA'],
  stroke: {
    curve: 'straight',
    colors: ['var(--primary-500)'],
    width: 1,
  },
  markers: {
    hover: {
      sizeOffset: 5,
    },
  },
  dataLabels: {
    enabled: false,
  },
  yaxis: {
    labels: {
      formatter: (val: number) => {
        return val + '°C'
      },
    },
  },
  tooltip: {
    shared: false,
    custom: (opts) => {
      const data = opts.w.globals.initialSeries[opts.seriesIndex].data[opts.dataPointIndex]
      const yVal = data.y as number[]
      return (
        '<div class="p-2">' +
        '<span>Month: ' +
        data.x +
        '</span><br>' +
        '<span>Min: ' +
        yVal[0] +
        '°C</span><br>' +
        '<span>Max: ' +
        yVal[1] +
        '°C</span>' +
        '</div>'
      )
    },
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
})

export const getDatetimeRangeAreaOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Price Range',
      data: [
        {
          x: new Date('2019-01-01').getTime(),
          y: [30, 45],
        },
        {
          x: new Date('2019-02-01').getTime(),
          y: [35, 50],
        },
        {
          x: new Date('2019-03-01').getTime(),
          y: [40, 55],
        },
        {
          x: new Date('2019-04-01').getTime(),
          y: [45, 62],
        },
        {
          x: new Date('2019-05-01').getTime(),
          y: [50, 70],
        },
        {
          x: new Date('2019-06-01').getTime(),
          y: [55, 72],
        },
        {
          x: new Date('2019-07-01').getTime(),
          y: [58, 75],
        },
        {
          x: new Date('2019-08-01').getTime(),
          y: [60, 80],
        },
        {
          x: new Date('2019-09-01').getTime(),
          y: [55, 75],
        },
        {
          x: new Date('2019-10-01').getTime(),
          y: [50, 65],
        },
        {
          x: new Date('2019-11-01').getTime(),
          y: [45, 60],
        },
        {
          x: new Date('2019-12-01').getTime(),
          y: [40, 55],
        },
        {
          x: new Date('2020-01-01').getTime(),
          y: [45, 60],
        },
        {
          x: new Date('2020-02-01').getTime(),
          y: [50, 65],
        },
        {
          x: new Date('2020-03-01').getTime(),
          y: [55, 70],
        },
        {
          x: new Date('2020-04-01').getTime(),
          y: [60, 75],
        },
        {
          x: new Date('2020-05-01').getTime(),
          y: [65, 80],
        },
        {
          x: new Date('2020-06-01').getTime(),
          y: [70, 85],
        },
        {
          x: new Date('2020-07-01').getTime(),
          y: [75, 90],
        },
        {
          x: new Date('2020-08-01').getTime(),
          y: [80, 95],
        },
        {
          x: new Date('2020-09-01').getTime(),
          y: [75, 90],
        },
        {
          x: new Date('2020-10-01').getTime(),
          y: [70, 85],
        },
        {
          x: new Date('2020-11-01').getTime(),
          y: [65, 80],
        },
        {
          x: new Date('2020-12-01').getTime(),
          y: [60, 75],
        },
      ],
    },
  ],
  chart: {
    height: 350,
    type: 'rangeArea',
    toolbar: {
      show: true,
    },
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
    hover: {
      size: 6,
    },
  },
  colors: [getColor('info', 500)],
  tooltip: {
    y: {
      formatter: (val: number) => {
        return '$' + val
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.6,
      opacityTo: 0.2,
      stops: [0, 100],
    },
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    title: {
      text: 'Price ($)',
    },
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
})

export const getMultipleRangeAreaOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Temperature New York',
      data: [
        { x: 'Jan', y: [-5, 5] },
        { x: 'Feb', y: [-3, 7] },
        { x: 'Mar', y: [2, 12] },
        { x: 'Apr', y: [8, 18] },
        { x: 'May', y: [15, 25] },
        { x: 'Jun', y: [20, 30] },
        { x: 'Jul', y: [22, 32] },
        { x: 'Aug', y: [21, 31] },
        { x: 'Sep', y: [16, 26] },
        { x: 'Oct', y: [10, 20] },
        { x: 'Nov', y: [5, 15] },
        { x: 'Dec', y: [-2, 8] },
      ],
    },
    {
      name: 'Temperature London',
      data: [
        { x: 'Jan', y: [2, 8] },
        { x: 'Feb', y: [3, 9] },
        { x: 'Mar', y: [5, 12] },
        { x: 'Apr', y: [7, 15] },
        { x: 'May', y: [10, 18] },
        { x: 'Jun', y: [14, 22] },
        { x: 'Jul', y: [16, 24] },
        { x: 'Aug', y: [16, 24] },
        { x: 'Sep', y: [14, 22] },
        { x: 'Oct', y: [10, 18] },
        { x: 'Nov', y: [6, 14] },
        { x: 'Dec', y: [4, 10] },
      ],
    },
  ],
  chart: {
    height: 350,
    type: 'rangeArea',
    toolbar: {
      show: true,
    },
  },
  stroke: {
    curve: 'straight',
    width: [2, 2],
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    hover: {
      sizeOffset: 5,
    },
  },
  colors: [getColor('success', 500), getColor('warning', 500)],
  fill: {
    opacity: [0.5, 0.5],
    type: 'solid',
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
  xaxis: {
    type: 'category',
  },
  yaxis: {
    title: {
      text: 'Temperature (°C)',
    },
    tooltip: {
      enabled: true,
    },
  },
})

export const getComboRangeAreaOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Temperature Range',
      type: 'rangeArea',
      data: [
        { x: 'Jan', y: [5, 15] },
        { x: 'Feb', y: [7, 18] },
        { x: 'Mar', y: [10, 22] },
        { x: 'Apr', y: [15, 25] },
        { x: 'May', y: [18, 30] },
        { x: 'Jun', y: [22, 35] },
        { x: 'Jul', y: [25, 38] },
        { x: 'Aug', y: [23, 36] },
        { x: 'Sep', y: [20, 32] },
        { x: 'Oct', y: [15, 26] },
        { x: 'Nov', y: [10, 20] },
        { x: 'Dec', y: [6, 16] },
      ],
    },
    {
      name: 'Average Temperature',
      type: 'line',
      data: [
        { x: 'Jan', y: 10 },
        { x: 'Feb', y: 12.5 },
        { x: 'Mar', y: 16 },
        { x: 'Apr', y: 20 },
        { x: 'May', y: 24 },
        { x: 'Jun', y: 28.5 },
        { x: 'Jul', y: 31.5 },
        { x: 'Aug', y: 29.5 },
        { x: 'Sep', y: 26 },
        { x: 'Oct', y: 20.5 },
        { x: 'Nov', y: 15 },
        { x: 'Dec', y: 11 },
      ],
    },
    {
      name: 'Precipitation',
      type: 'column',
      data: [
        { x: 'Jan', y: 76 },
        { x: 'Feb', y: 85 },
        { x: 'Mar', y: 101 },
        { x: 'Apr', y: 98 },
        { x: 'May', y: 87 },
        { x: 'Jun', y: 105 },
        { x: 'Jul', y: 91 },
        { x: 'Aug', y: 114 },
        { x: 'Sep', y: 94 },
        { x: 'Oct', y: 86 },
        { x: 'Nov', y: 115 },
        { x: 'Dec', y: 91 },
      ],
    },
  ],
  chart: {
    height: 350,
    type: 'rangeArea',
    stacked: false,
  },
  colors: [getColor('primary', 500), getColor('danger', 500), getColor('primary', 500)],
  stroke: {
    curve: 'smooth',
    width: [0, 3, 0],
  },
  fill: {
    opacity: [0.2, 1, 1],
  },
  markers: {
    size: [0, 4, 0],
    strokeWidth: 2,
    hover: {
      size: 6,
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      columnWidth: '40%',
      borderRadius: 2,
    },
  },
  tooltip: {
    shared: true,
    custom: (opts) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = months[opts.dataPointIndex]
      const rangeData = opts.w.globals.initialSeries[0].data[opts.dataPointIndex]
      const rangeVal = rangeData.y as number[]
      const avgTempData = opts.w.globals.initialSeries[1].data[opts.dataPointIndex]
      const avgTemp = avgTempData.y as number
      const precipData = opts.w.globals.initialSeries[2].data[opts.dataPointIndex]
      const precip = precipData.y as number

      return (
        '<div class="p-2">' +
        '<span>Month: ' +
        month +
        '</span><br>' +
        '<span><span style="color:#3F80EA">■</span> Min-Max Temp: ' +
        rangeVal[0] +
        '-' +
        rangeVal[1] +
        '°C</span><br>' +
        '<span><span style="color:#E63946">■</span> Avg Temp: ' +
        avgTemp +
        '°C</span><br>' +
        '<span><span style="color:#6D9EEB">■</span> Precipitation: ' +
        precip +
        ' mm</span>' +
        '</div>'
      )
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
  xaxis: {
    type: 'category',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yaxis: [
    {
      seriesName: 'Temperature Range',
      title: {
        text: 'Temperature (°C)',
        style: {
          color: getColor('danger', 500),
        },
      },
      labels: {
        formatter: (val: number) => {
          return val + '°C'
        },
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
    },
    {
      seriesName: 'Average Temperature',
      show: false,
    },
    {
      opposite: true,
      seriesName: 'Precipitation',
      title: {
        text: 'Precipitation (mm)',
        style: {
          color: getColor('primary', 500),
        },
      },
      labels: {
        formatter: (val: number) => {
          return val + ' mm'
        },
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
    },
  ],
})
