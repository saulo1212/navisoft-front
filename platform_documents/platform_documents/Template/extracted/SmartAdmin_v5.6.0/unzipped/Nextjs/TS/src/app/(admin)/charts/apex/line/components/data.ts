import { getColor } from '@/utils/getColor'
import { ApexAnnotations, ApexChart, ApexOptions } from 'apexcharts'

type LegendTooltipFormatterOpts = {
  seriesIndex: number
  dataPointIndex: any
  w: { globals: { series: number[][] } }
}

function generateDayWiseTimeSeries(baseval: number, count: number, yrange: { min: number; max: number }) {
  let i = 0
  const series = []
  while (i < count) {
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    series.push({
      x: baseval,
      y: y,
    })
    baseval += 86400000
    i++
  }
  return series
}

export const getBasicLineOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Sales',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
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
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
    width: 3,
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    row: {
      colors: [getColor('bootstrapVars', 'bodyColor', 'rgba', 0.05), 'transparent'],
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  tooltip: {
    
  },
  colors: [getColor('primary', 500)],
})

export const getLineWithDataLabelsOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Website Traffic',
      data: [45, 52, 38, 24, 33, 56, 85, 112, 97, 84, 72, 89],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: true,
    },
    dropShadow: {
      enabled: true,
      color: getColor('primary', 500),
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2,
    },
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    row: {
      colors: [getColor('bootstrapVars', 'bodyColor', 'rgba', 0.05), 'transparent'],
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  markers: {
    size: 6,
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    title: {
      text: 'Month',
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
  yaxis: {
    title: {
      text: 'Visitors (thousands)',
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
  tooltip: {
    
    y: {
      formatter: (val: number) => {
        return val + 'k visitors'
      },
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5,
  },
  colors: [getColor('primary', 500)],
})

export const multiLineOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Desktop',
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
    },
    {
      name: 'Mobile',
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
    },
    {
      name: 'Tablet',
      data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47],
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
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [3, 3, 3],
    curve: 'straight',
    dashArray: [0, 0, 0],
  },
  title: {
    text: 'Device Traffic Comparison',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  legend: {
    tooltipHoverFormatter: (val: string, opts?: any) => {
      return val + ' - ' + opts!.w.globals.series[opts!.seriesIndex][opts!.dataPointIndex] + ' users'
    },
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
    position: 'top',
  },
  markers: {
    size: 0,
    hover: {
      sizeOffset: 6,
    },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  tooltip: {
    
    y: {
      formatter: (val: number) => {
        return val + 'k users'
      },
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
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('danger', 500)],
})

export const getStepLineOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Orders',
      data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58, 79],
    },
  ],
  chart: {
    type: 'line',
    height: 350,
    toolbar: {
      show: true,
    },
  },
  stroke: {
    curve: 'stepline',
    width: 3,
  },
  dataLabels: {
    enabled: false,
  },
  title: {
    text: 'Daily Order Count',
    align: 'left',
  },
  markers: {
    hover: {
      sizeOffset: 4,
    },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yaxis: {},
  tooltip: {
    
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
  colors: [getColor('primary', 500)],
})

export const getGradientLineOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Revenue',
      data: [31, 40, 28, 51, 42, 109, 100, 120, 80, 95, 110, 140],
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
    width: 5,
    curve: 'smooth',
  },
  title: {
    text: 'Monthly Revenue',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: [getColor('danger', 500)],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  markers: {
    size: 4,
    colors: [getColor('success', 500)],
    // strokeColors: getColor('bootstrapVars', 'bodyBg', 'hex'),
    strokeWidth: 2,
    hover: {
      size: 7,
    },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    title: {
      text: 'Revenue in $1000',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
    min: 0,
    max: 150,
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  tooltip: {
    
    y: {
      formatter: (val: number) => {
        return '$' + val + 'k'
      },
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
  colors: [getColor('success', 500)],
})

export const getLineWithAnnotationsOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Stock Price',
      data: [8107, 8128, 8122, 8165, 8340, 8423, 8423, 8514, 8481, 8487, 8506, 8626, 8668, 8602, 8607, 8512, 8496, 8600, 8881, 9340],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    id: 'stock-prices',
    toolbar: {
      show: true,
    },
  },
  annotations: {
    yaxis: [
      {
        y: 8600,
        borderColor: getColor('primary', 500),
        label: {
          borderColor: getColor('primary', 500),
          style: {
            color: getColor('bootstrapVars', 'bodyBg', 'hex'),
            background: getColor('primary', 500),
          },
          text: 'Support Level',
        },
      },
    ],
    xaxis: [
      {
        x: new Date('15 Nov 2021').getTime(),
        borderColor: getColor('danger', 500),
        yAxisIndex: 0,
        label: {
          borderColor: getColor('danger', 500),
          style: {
            color: getColor('bootstrapVars', 'bodyBg', 'hex'),
            background: getColor('danger', 500),
          },
          text: 'Market Dip',
        },
      },
    ],
    points: [
      {
        x: new Date('01 Dec 2021').getTime(),
        y: 9340,
        marker: {
          size: 8,
          fillColor: getColor('primary', 500),
          strokeColor: getColor('bootstrapVars', 'bodyBg', 'hex'),
          radius: 2,
        },
        label: {
          borderColor: getColor('primary', 500),
          offsetY: 0,
          style: {
            color: getColor('bootstrapVars', 'bodyBg', 'hex'),
            background: getColor('primary', 500),
          },
          text: 'All-time High',
        },
      },
    ],
  } as unknown as ApexAnnotations,
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
    width: 3,
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      right: 30,
      left: 20,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  title: {
    text: 'Stock Market Analysis',
    align: 'left',
  },
  xaxis: {
    type: 'datetime',
    categories: [
      '01 Nov 2021',
      '02 Nov 2021',
      '03 Nov 2021',
      '04 Nov 2021',
      '05 Nov 2021',
      '08 Nov 2021',
      '09 Nov 2021',
      '10 Nov 2021',
      '11 Nov 2021',
      '12 Nov 2021',
      '15 Nov 2021',
      '16 Nov 2021',
      '17 Nov 2021',
      '18 Nov 2021',
      '19 Nov 2021',
      '22 Nov 2021',
      '23 Nov 2021',
      '24 Nov 2021',
      '29 Nov 2021',
      '01 Dec 2021',
    ],
  },
  yaxis: {},
  tooltip: {
    
    shared: false,
    x: {
      format: 'dd MMM yyyy',
    },
    y: {
      formatter: (val: number) => {
        return '$' + val
      },
    },
  },
  colors: [getColor('primary', 500)],
})

export const getDashedLineOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Session Duration',
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
    },
    {
      name: 'Page Views',
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
    },
    {
      name: 'Total Visits',
      data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [3, 3, 3],
    curve: 'straight',
    dashArray: [0, 8, 5],
  },
  title: {
    text: 'Page Statistics',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  legend: {
    tooltipHoverFormatter: (val: string, opts?: any) => {
      return val + ' - ' + opts!.w.globals.series[opts!.seriesIndex][opts!.dataPointIndex] + ''
    },
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  markers: {
    size: 0,
    hover: {
      sizeOffset: 6,
    },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  tooltip: {
    
    y: [
      {
        title: {
          formatter: (val: string) => {
            return val + ' (mins)'
          },
        },
      },
      {
        title: {
          formatter: (val: string) => {
            return val
          },
        },
      },
      {
        title: {
          formatter: (val: string) => {
            return val
          },
        },
      },
    ],
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
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('danger', 500)],
})

export const getZoomableTimeseriesOptions = (): ApexOptions => ({
  series: [
    {
      name: 'XYZ MOTORS',
      data: generateDayWiseTimeSeries(new Date('11 Feb 2020 GMT').getTime(), 200, {
        min: 30,
        max: 90,
      }),
    },
  ],
  chart: {
    type: 'area',
    stacked: false,
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true,
    },
    toolbar: {
      autoSelected: 'zoom',
      show: true,
    },
  },
  stroke: {
    width: 2,
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  title: {
    text: 'Stock Price Movement',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => {
        return val.toFixed(2)
      },
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
    title: {
      text: 'Price',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  tooltip: {
    
    shared: false,
    y: {
      formatter: (val: number) => {
        return '$' + val.toFixed(2)
      },
    },
    x: {
      format: 'dd MMM yyyy',
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
  colors: [getColor('primary', 500)],
})

export const annotationsLineOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Website Traffic',
      data: [31, 40, 28, 51, 42, 109, 100, 120, 95, 98, 86, 75],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: true,
    },
  },
  annotations: {
    yaxis: [
      {
        y: 100,
        borderColor: getColor('success', 500),
        label: {
          borderColor: getColor('success', 500),
          style: {
            color: '#fff',
            background: getColor('success', 500),
          },
          text: 'Traffic Goal',
        },
      },
    ],
    xaxis: [
      {
        x: new Date('07 Jul 2023').getTime(),
        borderColor: getColor('danger', 500),
        yAxisIndex: 0,
        label: {
          style: {
            color: '#fff',
            background: getColor('danger', 500),
          },
          text: 'Summer Event',
        },
      },
    ],
  } as unknown as ApexAnnotations,
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      right: 30,
      left: 20,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  title: {
    text: 'Monthly Website Traffic',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  xaxis: {
    type: 'category',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  tooltip: {
    
  },
  colors: [getColor('primary', 500)],
})

export const syncChartOptions = (syncData: any[]): ApexOptions => ({
  series: [
    {
      data: syncData,
    },
  ],
  chart: {
    id: 'sync-chart',
    type: 'line',
    height: 250,
    toolbar: {
      autoSelected: 'pan',
      show: true,
    },
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000,
      },
    } as ApexChart['animations'],
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
    width: 3,
  },
  title: {
    text: 'Synchronized Chart (use Pan & Zoom)',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    row: {
      colors: [getColor('bootstrapVars', 'bodyColor', 'rgba', 0.05), 'transparent'],
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    min: 45,
    max: 85,
    tickAmount: 5,
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  tooltip: {
    
  },
  colors: [getColor('primary', 500)],
})

export const getSyncChartSmallOptions = (syncData: any[]): ApexOptions => ({
  series: [
    {
      data: syncData,
    },
  ],
  chart: {
    id: 'sync-chart-small',
    height: 100,
    type: 'area',
    brush: {
      target: 'sync-chart',
      enabled: true,
    },
    selection: {
      enabled: true,
      xaxis: {
        min: new Date('31 Jan 2023').getTime(),
        max: new Date('15 Feb 2023').getTime(),
      },
      fill: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex'),
        opacity: 0.1,
      },
      stroke: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex'),
        width: 2,
      },
    },
    toolbar: {
      show: false,
    },
  } as ApexChart,
  stroke: {
    curve: 'straight',
    width: 1,
  },
  colors: [getColor('primary', 300)],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.4,
      // gradientToColors: [getColor('bootstrapVars', 'bodyBg', 'hex'), getColor('bootstrapVars', 'bodyBg', 'hex')],
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100],
    },
  },
  xaxis: {
    type: 'datetime',
    tooltip: {
      enabled: false,
    },
    labels: {
      show: false,
    },
  },
  yaxis: {
    show: false,
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
  dataLabels: {
    enabled: false,
  },
})

export const brushChartOptions = (categories: string[]): ApexOptions => ({
  series: [
    {
      name: 'series1',
      data: [45, 52, 38, 45, 19, 23, 2, 48, 38, 41, 45, 54, 28, 35, 36, 39, 46, 28, 38, 54, 36, 42, 45, 54, 29, 32, 25],
    },
  ],
  chart: {
    id: 'chart2',
    type: 'line',
    height: 230,
    toolbar: {
      autoSelected: 'pan',
      show: true,
    },
  },
  colors: [getColor('primary', 500)],
  stroke: {
    width: 3,
    curve: 'smooth',
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 1,
  },
  markers: {
    size: 0,
  },
  xaxis: {
    type: 'datetime',
    categories: categories,
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  tooltip: {
    
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

export const brushChartSmallOptions = (categories: string[]): ApexOptions => ({
  series: [
    {
      name: 'series1',
      data: [45, 52, 38, 45, 19, 23, 2, 48, 38, 41, 45, 54, 28, 35, 36, 39, 46, 28, 38, 54, 36, 42, 45, 54, 29, 32, 25],
    },
  ],
  chart: {
    id: 'chart1',
    height: 130,
    type: 'area',
    brush: {
      target: 'chart2',
      enabled: true,
    },
    selection: {
      enabled: true,
      fill: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex'),
        opacity: 0.1,
      },
      stroke: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex'),
        width: 2,
      },
    },
  } as ApexChart,
  colors: [getColor('primary', 300)],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.4,
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100],
    },
  },
  xaxis: {
    type: 'datetime',
    categories: categories,
    tooltip: {
      enabled: false,
    },
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    tickAmount: 2,
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
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
  dataLabels: {
    enabled: false,
  },
})

export const negativeValuesOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Cash Flow',
      data: [
        1.45, 5.42, 5.9, -0.42, -12.6, -18.1, -18.2, -14.16, -11.1, -6.09, 0.34, 3.88, 13.07, 5.8, 2, 7.37, 8.1, 13.57, 15.75, 17.1, 19.8, -27.03,
        -54.4, -47.2, -43.3, -18.6, -48.6, -41.1, -39.6, -37.6, -29.4, -21.4, -2.4,
      ],
    },
  ],
  chart: {
    type: 'line',
    height: 350,
    toolbar: {
      show: true,
    },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  dataLabels: {
    enabled: false,
  },
  title: {
    text: 'Monthly Cash Flow',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  markers: {
    size: 0,
    hover: {
      sizeOffset: 6,
    },
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
    ],
    labels: {
      rotate: -90,
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    title: {
      text: 'Cash Flow (thousands)',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
    min: -60,
    max: 30,
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
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
  tooltip: {
    
    shared: false,
    y: {
      formatter: (val: number) => {
        return '$' + val + 'k'
      },
    },
  },
  colors: [getColor('primary', 500)],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: [getColor('danger', 500)],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        { offset: 0, color: getColor('primary', 500), opacity: 1 },
        { offset: 50, color: getColor('primary', 500), opacity: 1 },
        { offset: 50, color: getColor('danger', 500), opacity: 1 },
        { offset: 100, color: getColor('danger', 500), opacity: 1 },
      ],
    },
  },
})

export const getNullValuesOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Network Usage',
      data: [31, 40, 28, 51, null, 42, 109, null, null, 70, 25, 35, 58, 62, 85, 95, 112, 118, 95, 97, 92, null, 90, 88, 82, 75, 68, 65],
    },
  ],
  chart: {
    height: 350,
    type: 'line',
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000,
      },
    },
    dropShadow: {
      enabled: true,
      top: 3,
      left: 3,
      blur: 1,
      opacity: 0.2,
    },
    toolbar: {
      show: true,
    },
  } as ApexChart,
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  dataLabels: {
    enabled: false,
  },
  title: {
    text: 'Network Usage with Missing Data',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex'),
    },
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    row: {
      colors: [getColor('bootstrapVars', 'bodyColor', 'rgba', 0.05), 'transparent'],
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  xaxis: {
    categories: [
      'Jan 01',
      'Jan 02',
      'Jan 03',
      'Jan 04',
      'Jan 05',
      'Jan 06',
      'Jan 07',
      'Jan 08',
      'Jan 09',
      'Jan 10',
      'Jan 11',
      'Jan 12',
      'Jan 13',
      'Jan 14',
      'Jan 15',
      'Jan 16',
      'Jan 17',
      'Jan 18',
      'Jan 19',
      'Jan 20',
      'Jan 21',
      'Jan 22',
      'Jan 23',
      'Jan 24',
      'Jan 25',
      'Jan 26',
      'Jan 27',
      'Jan 28',
    ],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
  },
  tooltip: {
    
    x: {
      format: 'dd/MM/yy',
    },
  },
  markers: {
    size: 5,
    hover: {
      size: 9,
    },
  },
})

export const generateRealtimeInitialData = (count: number) => {
  const data = []
  const now = new Date().getTime()
  const yrange = { min: 30, max: 90 }

  for (let i = 0; i < count; i++) {
    const timeOffset = (count - i) * 1000 // 1-second intervals
    const x = now - timeOffset
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    data.push({ x, y })
  }
  return data
}

export const getRealtimeLineOptions = (): ApexOptions => {
  return {
    chart: {
      id: 'realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        // easing: 'linear',
        dynamicAnimation: {
          enabled: true,
          speed: 500, // Matches data push tick speed for a smooth sliding animation
        },
      },
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    title: {
      text: 'Dynamic Updating Chart',
      align: 'left',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'datetime',
      range: 20000, // Forces the visible chart window to lock onto a rolling 20-second window
      tickAmount: 10,
      labels: {
        datetimeUTC: false,
        format: 'HH:mm:ss',
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
      },
    },
    yaxis: {
      min: 20,
      max: 100,
      labels: {
        formatter: (val: number) => val.toFixed(0),
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
        },
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
    legend: {
      show: true,
      labels: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex'),
      },
    },
    tooltip: {
      
      x: {
        format: 'HH:mm:ss',
      },
    },
    colors: [getColor('primary', 500) || '#1dc9b7'],
  }
}

export function generateSyncData(count: number, min: number, max: number) {
  const data = []
  let baseDate = new Date('31 Jan 2023').getTime()
  for (let i = 0; i < count; i++) {
    const x = baseDate + i * (24 * 60 * 60 * 1000)
    const y = Math.floor(Math.random() * (max - min + 1)) + min
    data.push({ x, y })
  }
  return data
}

export function generateBrushCategories(count: number) {
  const categories = []
  const startDate = new Date('01 Jan 2023')
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    categories.push(date.toISOString())
  }
  return categories
}
