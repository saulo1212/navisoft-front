import { getColor } from '@/utils/getColor'
import { ApexOptions } from 'apexcharts'

export const getBasicTreemapOptions = (): ApexOptions => ({
  series: [
    {
      data: [
        { x: 'New Delhi', y: 218 },
        { x: 'Kolkata', y: 149 },
        { x: 'Mumbai', y: 184 },
        { x: 'Ahmedabad', y: 55 },
        { x: 'Bangalore', y: 84 },
        { x: 'Pune', y: 31 },
        { x: 'Chennai', y: 70 },
        { x: 'Jaipur', y: 30 },
        { x: 'Surat', y: 44 },
        { x: 'Hyderabad', y: 68 },
        { x: 'Lucknow', y: 28 },
        { x: 'Indore', y: 19 },
        { x: 'Kanpur', y: 29 },
      ],
    },
  ],
  chart: {
    height: 350,
    type: 'treemap',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  colors: [getColor('primary', 500), getColor('primary', 400), getColor('primary', 100)],
})

export const getMultiSeriesTreemapOptions = (): ApexOptions => ({
  series: [
    {
      name: 'Desktops',
      data: [
        { x: 'ABC', y: 10 },
        { x: 'DEF', y: 60 },
        { x: 'XYZ', y: 41 },
      ],
    },
    {
      name: 'Mobile',
      data: [
        { x: 'ABCD', y: 10 },
        { x: 'DEFG', y: 20 },
        { x: 'WXYZ', y: 51 },
        { x: 'PQR', y: 30 },
        { x: 'MNO', y: 20 },
        { x: 'CDE', y: 30 },
      ],
    },
  ],
  chart: {
    height: 350,
    type: 'treemap',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  colors: [getColor('primary', 500), getColor('primary', 100)],
  plotOptions: {
    treemap: {
      distributed: false,
      enableShades: false,
    },
  },
})

export const getColorRangeOptions = (): ApexOptions => ({
  series: [
    {
      data: [
        { x: 'INTC', y: 1.2 },
        { x: 'GS', y: 0.4 },
        { x: 'CVX', y: -1.4 },
        { x: 'GE', y: 2.7 },
        { x: 'CAT', y: -0.3 },
        { x: 'RTX', y: 5.1 },
        { x: 'CSCO', y: -2.3 },
        { x: 'JNJ', y: 2.1 },
        { x: 'PG', y: 0.3 },
        { x: 'TRV', y: 0.12 },
        { x: 'MMM', y: -2.31 },
        { x: 'NKE', y: 3.98 },
        { x: 'IYT', y: 1.67 },
      ],
    },
  ],
  chart: {
    height: 350,
    type: 'treemap',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
 
  plotOptions: {
    treemap: {
      distributed: true,
      enableShades: false,
      colorScale: {
        ranges: [
          {
            from: -6,
            to: 0,
            color: getColor('danger', 500),
          },
          {
            from: 0.001,
            to: 6,
            color: getColor('primary', 500),
          },
        ],
      },
    },
  },
})

export const getDistributedTreemapOptions = (): ApexOptions => ({
  series: [
    {
      data: [
        { x: 'New Delhi', y: 218 },
        { x: 'Kolkata', y: 149 },
        { x: 'Mumbai', y: 184 },
        { x: 'Ahmedabad', y: 55 },
        { x: 'Bangalore', y: 84 },
        { x: 'Pune', y: 31 },
        { x: 'Chennai', y: 70 },
        { x: 'Jaipur', y: 30 },
        { x: 'Surat', y: 44 },
        { x: 'Hyderabad', y: 68 },
        { x: 'Lucknow', y: 28 },
        { x: 'Indore', y: 19 },
        { x: 'Kanpur', y: 29 },
      ],
    },
  ],
  chart: {
    height: 350,
    type: 'treemap',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  colors: [
    getColor('primary', 800),
    getColor('primary', 500),
    getColor('success', 500),
    getColor('success', 700),
    getColor('danger', 500),
    getColor('warning', 500),
    getColor('info', 500),
    getColor('primary', 100),
  ],
  plotOptions: {
    treemap: {
      distributed: true,
      enableShades: false,
    },
  },
})
