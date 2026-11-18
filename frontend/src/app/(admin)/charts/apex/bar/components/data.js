import { getColor } from '@/utils/getColor';
export const getBasicBarChartOptions = () => ({
  series: [{
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
  }],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  colors: [getColor('primary', 500)]
});
export const getGroupedBarChartOptions = () => ({
  series: [{
    name: 'Males',
    data: [0.4, 0.65, 0.76, 0.88, 1.5, 2.1, 2.9, 3.8, 3.9, 4.2, 4, 4.3, 4.1, 4.2, 4.5, 3.9, 3.5, 3]
  }, {
    name: 'Females',
    data: [-0.8, -1.05, -1.06, -1.18, -1.4, -2.2, -2.85, -3.7, -3.96, -4.22, -4.3, -4.4, -4.1, -4, -4.1, -3.4, -3.1, -2.8]
  }],
  chart: {
    type: 'bar',
    height: 440,
    stacked: true,
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '80%'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -15
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  yaxis: {
    min: -5,
    max: 5,
    title: {
      text: 'Age Group'
    },
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  tooltip: {
    shared: false,
    x: {
      formatter: function (val) {
        return String(val);
      }
    },
    y: {
      formatter: function (val) {
        return Math.abs(val) + '%';
      }
    }
  },
  xaxis: {
    categories: ['85+', '80-84', '75-79', '70-74', '65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '15-19', '10-14', '5-9', '0-4'],
    title: {
      text: 'Percent'
    },
    labels: {
      formatter: function (val) {
        return Math.abs(Math.round(Number(val))) + '%';
      },
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  colors: [getColor('primary', 500), getColor('danger', 400)],
  legend: {
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  }
});
export const getStackedBarChartOptions = () => ({
  series: [{
    name: 'Q1',
    data: [44, 55, 41, 37, 22]
  }, {
    name: 'Q2',
    data: [53, 32, 33, 52, 13]
  }, {
    name: 'Q3',
    data: [12, 17, 11, 9, 15]
  }, {
    name: 'Q4',
    data: [9, 7, 5, 8, 6]
  }],
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        total: {
          enabled: true,
          offsetX: 10,
          style: {
            fontSize: '13px',
            fontWeight: 900
          }
        }
      }
    }
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    categories: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  yaxis: {
    title: {
      text: undefined
    },
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + 'K';
      }
    }
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('primary', 200), getColor('primary', 100)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  }
});
export const getStacked100BarChartOptions = () => ({
  series: [{
    name: 'Product A',
    data: [44, 55, 41, 37, 22, 43, 21]
  }, {
    name: 'Product B',
    data: [53, 32, 33, 52, 13, 43, 32]
  }, {
    name: 'Product C',
    data: [12, 17, 11, 9, 15, 11, 20]
  }, {
    name: 'Product D',
    data: [9, 7, 5, 8, 6, 9, 4]
  }],
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    stackType: '100%',
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: true
    }
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    categories: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + 'K';
      }
    }
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('primary', 200), getColor('primary', 100)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  }
});
export const getGroupedStackedBarChartOptions = () => ({
  series: [{
    name: 'Actual',
    group: 'Budget',
    data: [44, 55, 41, 67, 22, 43]
  }, {
    name: 'Expected',
    group: 'Budget',
    data: [13, 23, 20, 8, 13, 27]
  }, {
    name: 'Revenue',
    group: 'Actual',
    data: [11, 17, 15, 15, 21, 14]
  }, {
    name: 'Profit',
    group: 'Actual',
    data: [17, 18, 13, 13, 15, 13]
  }],
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    toolbar: {
      show: true
    }
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4
    }
  },
  xaxis: {
    categories: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E', 'Category F'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'right',
    offsetY: 40,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  tooltip: {},
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('danger', 500), getColor('danger', 300)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  }
});
export const getPatternedBarChartOptions = () => ({
  series: [{
    name: 'Marine Sprite',
    data: [44, 55, 41, 37, 22, 43, 21]
  }, {
    name: 'Striking Calf',
    data: [53, 32, 33, 52, 13, 43, 32]
  }, {
    name: 'Tank Picture',
    data: [12, 17, 11, 9, 15, 11, 20]
  }, {
    name: 'Bucket Slope',
    data: [9, 7, 5, 8, 6, 9, 4]
  }, {
    name: 'Reborn Kid',
    data: [25, 12, 19, 32, 25, 24, 10]
  }],
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    dropShadow: {
      enabled: true,
      blur: 1,
      opacity: 0.25
    },
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '60%'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  yaxis: {
    title: {
      text: undefined
    },
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function (val) {
        return val + 'K';
      }
    }
  },
  fill: {
    type: 'pattern',
    opacity: 1,
    pattern: {
      style: ['circles', 'slantedLines', 'squares', 'horizontalLines', 'verticalLines']
    }
  },
  states: {
    hover: {
      filter: {
        type: 'none'
      }
    }
  },
  legend: {
    position: 'right',
    offsetY: 40,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  colors: [getColor('primary', 500), getColor('primary', 400), getColor('primary', 300), getColor('primary', 200), getColor('primary', 100)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  }
});
export const getNegativeBarChartOptions = () => ({
  series: [{
    name: 'Males',
    data: [0.4, 0.65, 0.76, 0.88, 1.5, 2.1, 2.9, 3.8, 3.9, 4.2, 4, 4.3, 4.1, 4.2, 4.5, 3.9, 3.5, 3]
  }, {
    name: 'Females',
    data: [-0.8, -1.05, -1.06, -1.18, -1.4, -2.2, -2.85, -3.7, -3.96, -4.22, -4.3, -4.4, -4.1, -4, -4.1, -3.4, -3.1, -2.8]
  }],
  chart: {
    type: 'bar',
    height: 440,
    stacked: true,
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '80%'
    }
  },
  colors: [getColor('primary', 500), getColor('danger', 500)],
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  yaxis: {
    min: -5,
    max: 5,
    title: {
      text: 'Age Group'
    },
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  tooltip: {
    shared: false,
    x: {
      formatter: function (val) {
        return String(val);
      }
    },
    y: {
      formatter: function (val) {
        return Math.abs(val) + '%';
      }
    }
  },
  xaxis: {
    categories: ['85+', '80-84', '75-79', '70-74', '65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '15-19', '10-14', '5-9', '0-4'],
    title: {
      text: 'Percent'
    },
    labels: {
      formatter: function (val) {
        return Math.abs(Math.round(Number(val))) + '%';
      },
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  legend: {
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  }
});
export const getBarWithMarkersOptions = () => ({
  series: [{
    name: 'Sales',
    data: [420, 532, 516, 575, 519, 630, 752, 674, 687, 723]
  }],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4
    }
  },
  colors: [getColor('primary', 500)],
  dataLabels: {
    enabled: false
  },
  annotations: {
    yaxis: [{
      y: 'Canada',
      strokeDashArray: 0,
      borderColor: getColor('primary', 500),
      position: 'front',
      label: {
        borderColor: getColor('danger', 500),
        style: {
          color: '#fff',
          background: getColor('danger', 500)
        },
        text: 'Target'
      }
    }],
    xaxis: [{
      x: 600,
      strokeDashArray: 0,
      borderColor: getColor('success', 500),
      position: 'front',
      label: {
        borderColor: getColor('success', 500),
        style: {
          color: '#fff',
          background: getColor('success', 500)
        },
        text: 'Average'
      }
    }]
  },
  xaxis: {
    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  }
});
export const getReversedBarChartOptions = () => ({
  series: [{
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
  }],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: true
    }
  },
  annotations: {
    xaxis: [{
      x: 500,
      borderColor: getColor('primary', 500),
      position: 'front',
      label: {
        borderColor: getColor('primary', 500),
        style: {
          color: '#fff',
          background: getColor('primary', 500)
        },
        text: 'X annotation'
      }
    }],
    yaxis: [{
      y: 'Italy',
      y2: 'Japan',
      position: 'front',
      label: {
        text: 'Y annotation'
      }
    }]
  },
  plotOptions: {
    bar: {
      horizontal: true
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
    labels: {
      formatter: function (val) {
        return val + 'K';
      },
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  yaxis: {
    reversed: true,
    axisTicks: {
      show: true
    },
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  colors: [getColor('primary', 500)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  }
});
export const getCustomDatalabelsBarOptions = () => ({
  series: [{
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
  }],
  chart: {
    type: 'bar',
    height: 380,
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      distributed: true,
      horizontal: true,
      dataLabels: {
        position: 'bottom'
      }
    }
  },
  colors: [getColor('primary', 500), getColor('primary', 400), getColor('primary', 300), getColor('primary', 600), getColor('primary', 200), getColor('primary', 300), getColor('primary', 400), getColor('primary', 800), getColor('primary', 700), getColor('primary', 400)],
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    style: {
      colors: ['#fff']
    },
    formatter: function (val, opt) {
      return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
    },
    offsetX: 0,
    dropShadow: {
      enabled: true
    }
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  legend: {
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  xaxis: {
    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  tooltip: {
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function () {
          return '';
        }
      }
    }
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  }
});
export const getBarWithImagesOptions = () => ({
  series: [{
    name: 'coins',
    data: [2, 4, 3, 4, 3, 5, 5, 6.5, 6, 5, 4, 5, 8, 7, 7, 8, 8, 10, 9, 9, 12, 12, 11, 12, 13, 14, 16, 14, 15, 17, 19, 21]
  }],
  chart: {
    type: 'bar',
    height: 410,
    animations: {
      enabled: false
    },
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '100%'
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: true,
    position: 'top',
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  colors: [getColor('warning', 400)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    padding: {
      left: -5,
      right: 0,
      top: -20,
      bottom: -5
    },
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    }
  },
  xaxis: {
    type: 'category',
    labels: {
      formatter: function (value) {
        return '$' + value + 'k';
      },
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
    group: {
      style: {
        fontSize: '10px',
        fontWeight: 700
      },
      groups: [{
        title: '2020',
        cols: 12
      }, {
        title: '2021',
        cols: 12
      }, {
        title: '2022',
        cols: 8
      }]
    }
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  tooltip: {
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function () {
          return 'Price in $K';
        }
      }
    }
  }
});