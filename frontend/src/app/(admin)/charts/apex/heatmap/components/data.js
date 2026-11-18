import { getColor } from '@/utils/getColor';
function generateData(count, yrange) {
  let i = 0;
  const series = [];
  while (i < count) {
    const x = 'w' + (i + 1).toString();
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    series.push({
      x,
      y
    });
    i++;
  }
  return series;
}
export const getBasicHeatmapOptions = () => ({
  series: [{
    name: 'Metric 1',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 2',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 3',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 4',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 5',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 6',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 7',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 8',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 9',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }],
  chart: {
    height: 350,
    type: 'heatmap',
    toolbar: {
      show: true
    }
  },
  dataLabels: {
    enabled: false
  },
  colors: [getColor('primary', 500)],
  grid: {
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.2)
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
  legend: {
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  }
});
export const multipleSeriesHeatmapOptions = () => ({
  series: [{
    name: 'Jan',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Feb',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Mar',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Apr',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'May',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Jun',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Jul',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Aug',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Sep',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }],
  chart: {
    height: 350,
    type: 'heatmap',
    toolbar: {
      show: true
    }
  },
  dataLabels: {
    enabled: false
  },
  colors: [getColor('primary', 500)],
  xaxis: {
    type: 'category',
    categories: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30'],
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
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.2)
  },
  legend: {
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  }
});
export const colorRangeHeatmapOptions = () => ({
  series: [{
    name: 'Jan',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Feb',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Mar',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Apr',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'May',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Jun',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Jul',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Aug',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }, {
    name: 'Sep',
    data: generateData(20, {
      min: -30,
      max: 55
    })
  }],
  chart: {
    height: 350,
    type: 'heatmap',
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      radius: 0,
      useFillColorAsStroke: true,
      colorScale: {
        ranges: [{
          from: -30,
          to: 5,
          name: 'Low',
          color: getColor('success', 100)
        }, {
          from: 6,
          to: 20,
          name: 'Medium',
          color: getColor('primary', 300)
        }, {
          from: 21,
          to: 45,
          name: 'High',
          color: getColor('primary', 500)
        }, {
          from: 46,
          to: 55,
          name: 'Extreme',
          color: getColor('danger', 500)
        }]
      }
    }
  },
  dataLabels: {
    enabled: false
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
  grid: {
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.2)
  },
  legend: {
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  }
});
export const roundedHeatmapOptions = () => ({
  series: [{
    name: 'Metric 1',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 2',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 3',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 4',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 5',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 6',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 7',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 8',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }, {
    name: 'Metric 9',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }],
  chart: {
    height: 350,
    type: 'heatmap',
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    heatmap: {
      radius: 15,
      enableShades: false,
      colorScale: {
        ranges: [{
          from: 0,
          to: 30,
          color: getColor('primary', 300)
        }, {
          from: 31,
          to: 60,
          color: getColor('primary', 500)
        }, {
          from: 61,
          to: 90,
          color: getColor('primary', 700)
        }]
      }
    }
  },
  dataLabels: {
    enabled: false
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
  grid: {
    borderColor: getColor('bootstrapVars', 'bodyColor', 'rgba', 0.2)
  },
  legend: {
    labels: {
      colors: getColor('bootstrapVars', 'bodyColor', 'hex')
    }
  }
});