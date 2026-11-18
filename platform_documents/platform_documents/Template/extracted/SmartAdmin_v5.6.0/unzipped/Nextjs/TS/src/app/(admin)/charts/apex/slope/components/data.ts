import { getColor } from '@/utils/getColor'
import { ApexOptions } from 'apexcharts'

export const getBasicSlopeOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Sales',
      data: [
        { x: '2019', y: 40 },
        { x: '2023', y: 80 },
      ],
    },
    {
      name: 'Revenue',
      data: [
        { x: '2019', y: 25 },
        { x: '2023', y: 70 },
      ],
    },
    {
      name: 'Customers',
      data: [
        { x: '2019', y: 15 },
        { x: '2023', y: 65 },
      ],
    },
  ],
  chart: {
    type: 'line',
    height: 350,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: true,
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -5,
    style: {
      fontSize: '12px',
      fontWeight: 'normal',
    },
  },
  title: {
    text: 'Basic Slope Chart',
    align: 'left',
  },
  legend: {
    position: 'top',
  },
  colors: [getColor('primary', 100), getColor('primary', 300), getColor('primary', 600)],
  stroke: {
    width: 3,
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  markers: {
    size: 5,
  },
  xaxis: {
    type: 'category',
    tickAmount: 2,
    tickPlacement: 'on',
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
  },
})

export const getMultiGroupSlopeOptions = (): ApexOptions => ({
  series: [
    {
      name: 'USA',
      data: [
        { x: '2010', y: 71 },
        { x: '2020', y: 76 },
      ],
    },
    {
      name: 'UK',
      data: [
        { x: '2010', y: 55 },
        { x: '2020', y: 81 },
      ],
    },
    {
      name: 'Germany',
      data: [
        { x: '2010', y: 50 },
        { x: '2020', y: 65 },
      ],
    },
    {
      name: 'Japan',
      data: [
        { x: '2010', y: 40 },
        { x: '2020', y: 85 },
      ],
    },
    {
      name: 'India',
      data: [
        { x: '2010', y: 45 },
        { x: '2020', y: 70 },
      ],
    },
  ],
  chart: {
    type: 'line',
    height: 350,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: true,
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: 0,
    offsetY: 0,
    style: {
      fontSize: '12px',
      fontWeight: 'normal',
    },
  },
  title: {
    text: 'Multi-group Slope Chart',
    align: 'left',
  },
  legend: {
    position: 'top',
  },
  colors: [getColor('primary', 500), getColor('info', 500), getColor('success', 500), getColor('warning', 500), getColor('danger', 500)],
  stroke: {
    width: 3,
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  markers: {
    size: 6,
  },
  xaxis: {
    type: 'category',
    tickAmount: 2,
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
  },
})
