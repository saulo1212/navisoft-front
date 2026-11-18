import { getColor } from '@/utils/getColor';
const seriesData = [{
  x: new Date(2016, 1, 1),
  y: [51.98, 56.29, 51.59, 53.85]
}, {
  x: new Date(2016, 2, 1),
  y: [53.66, 54.99, 51.35, 52.95]
}, {
  x: new Date(2016, 3, 1),
  y: [52.96, 53.78, 51.54, 52.48]
}, {
  x: new Date(2016, 4, 1),
  y: [52.54, 52.79, 47.88, 49.24]
}, {
  x: new Date(2016, 5, 1),
  y: [49.1, 52.86, 47.7, 52.78]
}, {
  x: new Date(2016, 6, 1),
  y: [52.83, 53.48, 50.32, 52.29]
}, {
  x: new Date(2016, 7, 1),
  y: [52.2, 54.48, 51.64, 52.58]
}, {
  x: new Date(2016, 8, 1),
  y: [52.76, 57.35, 52.15, 57.03]
}, {
  x: new Date(2016, 9, 1),
  y: [57.04, 58.15, 48.88, 56.19]
}, {
  x: new Date(2016, 10, 1),
  y: [56.09, 58.85, 55.48, 58.79]
}, {
  x: new Date(2016, 11, 1),
  y: [58.78, 59.65, 58.23, 59.05]
}, {
  x: new Date(2017, 0, 1),
  y: [59.37, 61.11, 59.35, 60.34]
}, {
  x: new Date(2017, 1, 1),
  y: [60.4, 60.52, 56.71, 56.93]
}, {
  x: new Date(2017, 2, 1),
  y: [57.02, 59.71, 56.04, 56.82]
}, {
  x: new Date(2017, 3, 1),
  y: [56.97, 59.62, 54.77, 59.3]
}, {
  x: new Date(2017, 4, 1),
  y: [59.11, 62.29, 59.1, 59.85]
}, {
  x: new Date(2017, 5, 1),
  y: [59.97, 60.11, 55.66, 58.42]
}, {
  x: new Date(2017, 6, 1),
  y: [58.34, 60.93, 56.75, 57.42]
}, {
  x: new Date(2017, 7, 1),
  y: [57.76, 58.08, 51.18, 54.71]
}, {
  x: new Date(2017, 8, 1),
  y: [54.8, 61.42, 53.18, 57.35]
}, {
  x: new Date(2017, 9, 1),
  y: [57.56, 63.09, 57.0, 62.99]
}, {
  x: new Date(2017, 10, 1),
  y: [62.89, 63.42, 59.72, 61.76]
}, {
  x: new Date(2017, 11, 1),
  y: [61.71, 64.15, 61.29, 63.04]
}];
const categorySeriesData = [{
  x: 'Jan',
  y: [1500, 1700, 1400, 1650]
}, {
  x: 'Feb',
  y: [1650, 1850, 1600, 1700]
}, {
  x: 'Mar',
  y: [1700, 2000, 1680, 1880]
}, {
  x: 'Apr',
  y: [1880, 2050, 1750, 1800]
}, {
  x: 'May',
  y: [1800, 1980, 1750, 1890]
}, {
  x: 'Jun',
  y: [1890, 2100, 1850, 2050]
}, {
  x: 'Jul',
  y: [2050, 2200, 1900, 2100]
}, {
  x: 'Aug',
  y: [2100, 2300, 2050, 2200]
}, {
  x: 'Sep',
  y: [2200, 2400, 2150, 2300]
}, {
  x: 'Oct',
  y: [2300, 2500, 2200, 2450]
}, {
  x: 'Nov',
  y: [2450, 2600, 2350, 2550]
}, {
  x: 'Dec',
  y: [2550, 2750, 2500, 2700]
}];
export const getBasicCandlestickOptions = () => ({
  series: [{
    data: seriesData
  }],
  chart: {
    type: 'candlestick',
    height: 350,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  tooltip: {
    y: {
      formatter: y => {
        if (typeof y !== 'undefined') {
          return '$' + y.toFixed(2);
        }
        return y;
      }
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: val => {
        return new Date(val).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        });
      },
      style: {
        colors: getColor('bootstrapVars', 'bodyColor', 'hex')
      }
    }
  },
  yaxis: {
    tooltip: {
      enabled: true
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
    }
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: getColor('primary', 500),
        downward: getColor('danger', 500)
      }
    }
  }
});
export const getComboCandlestickOptions = () => {
  const volumeData = seriesData.map(item => ({
    x: item.x,
    y: Math.floor(Math.random() * 1000000) + 200000
  }));
  return {
    series: [{
      name: 'candle',
      type: 'candlestick',
      data: seriesData
    }, {
      name: 'volume',
      type: 'bar',
      data: volumeData
    }],
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      width: [1, 1]
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: val => {
          return new Date(val).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          });
        }
      }
    },
    yaxis: [{
      seriesName: 'candle',
      title: {
        text: 'Price',
        style: {
          color: getColor('primary', 500)
        }
      },
      labels: {
        formatter: val => {
          return '$' + val.toFixed(2);
        },
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex')
        }
      }
    }, {
      seriesName: 'volume',
      opposite: true,
      title: {
        text: 'Volume',
        style: {
          color: getColor('success', 500)
        }
      },
      labels: {
        formatter: val => {
          return Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short'
          }).format(val);
        },
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex')
        }
      }
    }],
    tooltip: {
      enabled: true,
      shared: true
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: getColor('primary', 500),
          downward: getColor('danger', 500)
        }
      },
      bar: {
        columnWidth: '80%',
        colors: {
          ranges: [{
            from: 0,
            to: 999999999,
            color: getColor('success', 100)
          }]
        }
      }
    },
    legend: {
      position: 'top'
    },
    colors: [getColor('primary', 500), getColor('success', 100)],
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
  };
};
export const getCategoryXAxisOptions = (theme = 'light') => ({
  series: [{
    name: 'Product A',
    data: categorySeriesData
  }],
  chart: {
    type: 'candlestick',
    height: 350,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  title: {
    text: 'Monthly Performance Candlestick',
    align: 'left'
  },
  tooltip: {
    theme: theme,
    custom: ({
      seriesIndex,
      dataPointIndex,
      w
    }) => {
      const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
      return '<div class="p-2">' + '<span>Month: ' + data.x + '</span><br>' + '<span>Open: $' + data.y[0] + '</span><br>' + '<span>High: $' + data.y[1] + '</span><br>' + '<span>Low: $' + data.y[2] + '</span><br>' + '<span>Close: $' + data.y[3] + '</span>' + '</div>';
    }
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: getColor('primary', 500),
        downward: getColor('danger', 500)
      }
    }
  },
  xaxis: {
    type: 'category',
    labels: {
      rotate: -45,
      rotateAlways: false
    }
  },
  yaxis: {
    tooltip: {
      enabled: true
    },
    labels: {
      formatter: val => {
        return '$' + val;
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
  }
});
export const getCandlestickWithLineOptions = () => {
  const lineData = seriesData.map((item, i) => {
    if (i >= 4) {
      let sum = 0;
      for (let j = i; j > i - 5; j--) {
        sum += seriesData[j].y[3];
      }
      return {
        x: item.x,
        y: +(sum / 5).toFixed(2)
      };
    } else {
      return {
        x: item.x,
        y: item.y[3]
      };
    }
  });
  return {
    series: [{
      name: 'Candle',
      type: 'candlestick',
      data: seriesData
    }, {
      name: '5-day MA',
      type: 'line',
      data: lineData
    }],
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      width: [1, 3]
    },
    tooltip: {
      shared: true
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: val => {
          return new Date(val).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          });
        },
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex')
        }
      }
    },
    yaxis: [{
      tooltip: {
        enabled: true
      },
      labels: {
        formatter: val => {
          return '$' + val.toFixed(2);
        },
        style: {
          colors: getColor('bootstrapVars', 'bodyColor', 'hex')
        }
      }
    }],
    legend: {
      position: 'top'
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: getColor('primary', 500),
          downward: getColor('danger', 500)
        }
      }
    },
    colors: [getColor('primary', 500), getColor('success', 300)],
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
  };
};