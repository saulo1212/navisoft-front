import { getColor } from '@/utils/getColor';
export const getBasicColumnOptions = () => ({
  series: [{
    name: 'Net Profit',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
  }, {
    name: 'Revenue',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
  }, {
    name: 'Free Cash Flow',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
  }],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: true
    },
    zoom: {
      enabled: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 1
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
    axisBorder: {
      show: true,
      color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.1)
    },
    axisTicks: {
      show: true,
      color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.1)
    }
  },
  yaxis: {
    title: {
      text: '$ (thousands)',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
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
    xaxis: {
      lines: {
        show: false
      }
    },
    row: {
      colors: [getColor('bootstrapVars', 'bodyColor', 'rgba', 0.05), 'transparent'],
      opacity: 0.5
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: val => {
        return '$ ' + val + ' thousands';
      }
    }
  },
  legend: {
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('primary', 200)]
});
export const getColumnWithDataLabelsOptions = () => ({
  series: [{
    name: 'Inflation',
    data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
  }],
  chart: {
    height: 350,
    type: 'bar',
    toolbar: {
      show: true
    },
    zoom: {
      enabled: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 1
    }
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ['#fff']
    }
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
    axisBorder: {
      show: true,
      color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.1)
    },
    axisTicks: {
      show: true,
      color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.1)
    }
  },
  yaxis: {
    title: {
      text: 'Servings',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
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
    xaxis: {
      lines: {
        show: false
      }
    },
    row: {
      colors: [getColor('bootstrapVars', 'bodyColor', 'rgba', 0.05), 'transparent'],
      opacity: 0.5
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: val => {
        return val + ' Servings';
      }
    }
  },
  colors: [getColor('primary', 500)]
});
export const getStackedColumnOptions = () => ({
  series: [{
    name: 'PRODUCT A',
    data: [44, 55, 41, 67, 22, 43]
  }, {
    name: 'PRODUCT B',
    data: [13, 23, 20, 8, 13, 27]
  }, {
    name: 'PRODUCT C',
    data: [11, 17, 15, 15, 21, 14]
  }, {
    name: 'PRODUCT D',
    data: [21, 7, 25, 13, 22, 8]
  }],
  chart: {
    height: 350,
    type: 'bar',
    stacked: true,
    toolbar: {
      show: true
    },
    zoom: {
      enabled: true
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        position: 'bottom',
        offsetX: -10,
        offsetY: 0
      }
    }
  }],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 1
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '12px',
      colors: ['#304758']
    }
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    type: 'category',
    categories: ['Q1 2020', 'Q2 2020', 'Q3 2020', 'Q4 2020', 'Q1 2021', 'Q2 2021'],
    labels: {
      style: {
        colors: Array(6).fill(getColor('bootstrapVars', 'bodyColor', 'hex'))
      }
    },
    axisBorder: {
      show: true,
      color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.1)
    },
    axisTicks: {
      show: true,
      color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.1)
    }
  },
  yaxis: {
    title: {
      text: 'Sales',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
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
    xaxis: {
      lines: {
        show: false
      }
    },
    row: {
      colors: [getColor('bootstrapVars', 'bodyColor', 'rgba', 0.05), 'transparent'],
      opacity: 0.5
    }
  },
  legend: {
    position: 'right',
    offsetY: 40,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: val => {
        return val + ' units';
      }
    }
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('primary', 200), getColor('primary', 100)]
});
export const getStacked100ColumnOptions = () => ({
  series: [{
    name: 'PRODUCT A',
    data: [44, 55, 41, 67, 22, 43, 21, 49]
  }, {
    name: 'PRODUCT B',
    data: [13, 23, 20, 8, 13, 27, 33, 12]
  }, {
    name: 'PRODUCT C',
    data: [11, 17, 15, 15, 21, 14, 15, 13]
  }, {
    name: 'PRODUCT D',
    data: [21, 7, 25, 13, 22, 8, 10, 7]
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
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        position: 'bottom',
        offsetX: -10,
        offsetY: 0
      }
    }
  }],
  xaxis: {
    categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2', '2012 Q3', '2012 Q4'],
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
  fill: {
    opacity: 1
  },
  legend: {
    position: 'right',
    offsetX: 0,
    offsetY: 50,
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('primary', 200), getColor('primary', 100)]
});
export const getGroupedStackedColumnOptions = () => ({
  series: [{
    name: 'Actual Budget',
    group: 'Budget',
    data: [44000, 55000, 41000, 67000, 22000, 43000]
  }, {
    name: 'Expected Budget',
    group: 'Budget',
    data: [13000, 36000, 20000, 8000, 13000, 27000]
  }, {
    name: 'Actual Spending',
    group: 'Spending',
    data: [48000, 17000, 15000, 29000, 21000, 14000]
  }, {
    name: 'Expected Spending',
    group: 'Spending',
    data: [17000, 28000, 13000, 23000, 15000, 13000]
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
      horizontal: false
    }
  },
  xaxis: {
    categories: ['Marketing', 'Research', 'Operations', 'Sales', 'HR', 'IT'],
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
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('danger', 500), getColor('danger', 300)]
});
export const getDumbbellColumnOptions = () => ({
  series: [{
    data: [{
      x: '2015',
      y: [5000, 8000]
    }, {
      x: '2016',
      y: [4000, 9500]
    }, {
      x: '2017',
      y: [5000, 7500]
    }, {
      x: '2018',
      y: [4500, 8500]
    }, {
      x: '2019',
      y: [6000, 9000]
    }, {
      x: '2020',
      y: [5000, 8700]
    }, {
      x: '2021',
      y: [6500, 8800]
    }, {
      x: '2022',
      y: [7200, 9400]
    }, {
      x: '2023',
      y: [7800, 10200]
    }]
  }],
  chart: {
    height: 350,
    type: 'rangeBar',
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '30%',
      borderRadius: 5,
      isDumbbell: true,
      dumbbellColors: [[getColor('primary', 500), getColor('danger', 500)]]
    }
  },
  title: {
    text: 'Year-wise Revenue Range (Min-Max)',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  subtitle: {
    text: 'Range between minimum and maximum revenue',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.5)
    }
  },
  legend: {
    show: false
  },
  xaxis: {
    type: 'category',
    labels: {
      rotate: -45,
      rotateAlways: true,
      style: {
        colors: Array(9).fill(getColor('bootstrapVars', 'bodyColor', 'hex'))
      }
    }
  },
  yaxis: {
    title: {
      text: 'Revenue ($ thousands)',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
    labels: {
      formatter: val => {
        return '$' + val.toFixed(0) + 'k';
      },
      style: {
        colors: Array(20).fill(getColor('bootstrapVars', 'bodyColor', 'hex'))
      }
    }
  },
  tooltip: {
    custom: ({
      seriesIndex,
      dataPointIndex,
      w
    }) => {
      const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
      const min = data.y[0];
      const max = data.y[1];
      const range = max - min;
      return '<div class="p-2">' + '<div class="mb-1"><b>' + data.x + ' Revenue Range</b></div>' + '<div>Min: $' + min.toLocaleString() + '</div>' + '<div>Max: $' + max.toLocaleString() + '</div>' + '<div>Range: $' + range.toLocaleString() + '</div>' + '</div>';
    }
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  }
});
export const getColumnWithGroupLabelOptions = () => ({
  series: [{
    name: 'Actual',
    data: [150000, 205000, 178000, 235000, 210000, 280000, 310000, 300000, 340000, 365000, 340000, 400000]
  }, {
    name: 'Target',
    data: [190000, 230000, 200000, 255000, 235000, 300000, 330000, 320000, 360000, 385000, 360000, 420000]
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
      horizontal: false,
      columnWidth: '60%',
      borderRadius: 3,
      rangeBarOverlap: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 0,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    title: {
      text: 'Sales (in dollars)',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
    labels: {
      formatter: val => {
        return '$' + val.toLocaleString(undefined, {
          maximumFractionDigits: 0
        });
      },
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
    min: 0,
    max: 450000,
    tickAmount: 5
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  colors: [getColor('primary', 500), getColor('primary', 300)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  tooltip: {
    y: {
      formatter: val => {
        return '$' + val.toLocaleString(undefined, {
          maximumFractionDigits: 0
        });
      }
    }
  }
});
export const getColumnWithRotatedLabelsOptions = () => ({
  series: [{
    name: 'Population',
    data: [2.8, 3.9, 5.2, 6.1, 8.5, 11.7, 14.3, 16.5, 19.8, 24.1, 31.0]
  }],
  chart: {
    height: 350,
    type: 'bar',
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '70%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 2
  },
  xaxis: {
    categories: ['South Korea', 'Canada', 'United Kingdom', 'France', 'Germany', 'Japan', 'Russia', 'Brazil', 'United States', 'Indonesia', 'India'],
    labels: {
      rotate: -45,
      rotateAlways: true,
      style: {
        fontSize: '12px',
        colors: Array(11).fill(getColor('bootstrapVars', 'bodyColor', 'hex'))
      }
    }
  },
  yaxis: {
    title: {
      text: 'Population (in millions)',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
    labels: {
      formatter: val => {
        return val.toFixed(1) + 'M';
      },
      style: {
        colors: Array(6).fill(getColor('bootstrapVars', 'bodyColor', 'hex'))
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.4,
      gradientToColors: ['#ffffff'],
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100]
    }
  },
  tooltip: {
    y: {
      formatter: val => {
        return val.toFixed(1) + ' million';
      }
    }
  },
  colors: [getColor('primary', 500)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  }
});
export const getColumnWithNegativeValuesOptions = () => ({
  series: [{
    name: 'Cash Flow',
    data: [1.45, 5.42, 5.9, -0.42, -12.6, -18.1, -18.2, -14.16, -11.1, -6.09, 0.34, 3.88, 13.07, 5.8, 2, 7.37, 8.1, 13.57, 15.75, 17.1, 19.8, -27.03, -54.4, -47.2, -43.3, -18.6, -48.6, -41.1, -39.6, -37.6, -29.4, -21.4, -2.4]
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
      colors: {
        ranges: [{
          from: -100,
          to: -46,
          color: getColor('danger', 500)
        }, {
          from: -45,
          to: 0,
          color: getColor('warning', 500)
        }]
      },
      columnWidth: '80%'
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'datetime',
    categories: ['2011-01-01', '2011-02-01', '2011-03-01', '2011-04-01', '2011-05-01', '2011-06-01', '2011-07-01', '2011-08-01', '2011-09-01', '2011-10-01', '2011-11-01', '2011-12-01', '2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01', '2012-07-01', '2012-08-01', '2012-09-01', '2012-10-01', '2012-11-01', '2012-12-01', '2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01', '2013-06-01', '2013-07-01', '2013-08-01', '2013-09-01'],
    labels: {
      rotate: -90,
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  yaxis: {
    title: {
      text: 'Growth',
      style: {
        color: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    },
    labels: {
      formatter: val => {
        return val.toFixed(0) + '%';
      },
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  tooltip: {
    y: {
      formatter: val => {
        return val.toFixed(2) + '%';
      }
    }
  },
  colors: [getColor('primary', 500)],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  }
});
export const getDistributedColumnOptions = () => ({
  series: [{
    data: [21, 22, 10, 28, 16, 21, 13, 30, 18, 20]
  }],
  chart: {
    height: 350,
    type: 'bar',
    toolbar: {
      show: true
    }
  },
  colors: [getColor('primary', 500), getColor('primary', 300), getColor('primary', 200), getColor('primary', 100), getColor('danger', 500), getColor('danger', 50), getColor('info', 200), getColor('info', 600), getColor('success', 300), getColor('warning', 300)],
  plotOptions: {
    bar: {
      columnWidth: '45%',
      distributed: true,
      borderRadius: 4,
      dataLabels: {
        position: 'top'
      }
    }
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: val => {
      return val;
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: [getColor('bootstrapVars', 'bodyColor', 'hex')]
    }
  },
  legend: {
    show: false
  },
  xaxis: {
    categories: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F', 'Team G', 'Team H', 'Team I', 'Team J'],
    labels: {
      style: {
        fontSize: '12px',
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  title: {
    text: 'Distributed Column Chart',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  subtitle: {
    text: 'Each column has a different color',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.5)
    }
  }
});
export const getColumnWithMarkersOptions = () => ({
  series: [{
    name: 'Actual',
    data: [{
      x: '2011',
      y: 1292,
      goals: [{
        name: 'Expected',
        value: 1400,
        strokeHeight: 5,
        strokeColor: getColor('primary', 300)
      }]
    }, {
      x: '2012',
      y: 4432,
      goals: [{
        name: 'Expected',
        value: 5400,
        strokeHeight: 5,
        strokeColor: getColor('primary', 300)
      }]
    }, {
      x: '2013',
      y: 5423,
      goals: [{
        name: 'Expected',
        value: 5200,
        strokeHeight: 5,
        strokeColor: getColor('primary', 300)
      }]
    }, {
      x: '2014',
      y: 6653,
      goals: [{
        name: 'Expected',
        value: 6500,
        strokeHeight: 5,
        strokeColor: getColor('primary', 300)
      }]
    }, {
      x: '2015',
      y: 8133,
      goals: [{
        name: 'Expected',
        value: 6600,
        strokeHeight: 13,
        strokeWidth: 0,
        strokeLineCap: 'round',
        strokeColor: getColor('primary', 300)
      }]
    }, {
      x: '2016',
      y: 7132,
      goals: [{
        name: 'Expected',
        value: 7500,
        strokeHeight: 5,
        strokeColor: getColor('primary', 300)
      }]
    }, {
      x: '2017',
      y: 7332,
      goals: [{
        name: 'Expected',
        value: 8700,
        strokeHeight: 5,
        strokeColor: getColor('primary', 300)
      }]
    }, {
      x: '2018',
      y: 6553,
      goals: [{
        name: 'Expected',
        value: 7300,
        strokeHeight: 2,
        strokeDashArray: 2,
        strokeColor: getColor('primary', 300)
      }]
    }]
  }],
  chart: {
    height: 350,
    type: 'bar',
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '60%',
      borderRadius: 3
    }
  },
  colors: [getColor('warning', 500)],
  dataLabels: {
    enabled: false
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: ['Actual', 'Expected'],
    markers: {
      fillColors: [getColor('warning', 500), getColor('primary', 300)]
    },
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  stroke: {
    width: 1
  },
  title: {
    text: 'Actual vs Expected Values',
    align: 'left',
    style: {
      color: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  },
  xaxis: {
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
  tooltip: {
    shared: true,
    intersect: false
  },
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  }
});
export const getDynamicLoadedColumnOptions = () => ({
  series: [{
    name: 'Load',
    data: []
  }],
  chart: {
    height: 350,
    type: 'bar',
    toolbar: {
      show: true
    },
    animations: {
      enabled: true,
      //   easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '45%',
      distributed: false
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  stroke: {
    show: true,
    width: 2
  },
  xaxis: {
    categories: [],
    labels: {
      rotate: 0,
      style: {
        colors: Array(10).fill(getColor('bootstrapVars', 'bodyColor', 'hex'))
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: Array(6).fill(getColor('bootstrapVars', 'bodyColor', 'hex'))
      }
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val.toFixed(0);
      }
    }
  },
  colors: [window.colorMap.primary[500].hex],
  grid: {
    show: true,
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.08),
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    }
  }
});