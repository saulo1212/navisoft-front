import { getColor } from '@/utils/getColor';
const generateSparklineData = (count, min, max) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return data;
};
export const spark1Options = () => ({
  series: [{
    data: generateSparklineData(30, 30, 90)
  }],
  chart: {
    type: 'line',
    height: 80,
    sparkline: {
      enabled: true
    },
    animations: {
      enabled: true,
      speed: 800
    }
  },
  stroke: {
    width: 2,
    curve: 'smooth'
  },
  colors: [getColor('primary', 500)],
  tooltip: {
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter: () => 'Sales:'
      }
    },
    marker: {
      show: false
    }
  }
});
export const spark2Options = () => ({
  series: [{
    data: generateSparklineData(20, 10, 60)
  }],
  chart: {
    type: 'bar',
    height: 80,
    sparkline: {
      enabled: true
    },
    animations: {
      enabled: true,
      speed: 800
    }
  },
  colors: [getColor('primary', 400)],
  plotOptions: {
    bar: {
      columnWidth: '60%'
    }
  },
  tooltip: {
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter: () => 'Revenue:'
      }
    },
    marker: {
      show: false
    }
  }
});
export const spark3Options = () => ({
  series: [{
    data: generateSparklineData(30, 20, 50)
  }],
  chart: {
    type: 'area',
    height: 80,
    sparkline: {
      enabled: true
    },
    animations: {
      enabled: true,
      speed: 800
    }
  },
  stroke: {
    curve: 'straight',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.4,
      // gradientToColors: [getColor('bootstrapVars', 'bodyBg', 'hex')],
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.1,
      stops: [0, 100]
    }
  },
  colors: [getColor('danger', 500)],
  tooltip: {
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter: () => 'Customers:'
      }
    },
    marker: {
      show: false
    }
  }
});
export const spark4Options = () => ({
  series: [{
    data: generateSparklineData(15, 40, 100)
  }],
  chart: {
    type: 'line',
    height: 80,
    sparkline: {
      enabled: true
    },
    animations: {
      enabled: true,
      speed: 800
    }
  },
  stroke: {
    width: 2,
    curve: 'straight'
  },
  colors: [getColor('success', 500)],
  markers: {
    size: 4,
    colors: [getColor('success', 500)],
    strokeColors: '#ffffff',
    strokeWidth: 2,
    hover: {
      size: 6
    }
  },
  tooltip: {
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter: () => 'Orders:'
      }
    }
  }
});
export const spark5Options = () => {
  const data = generateSparklineData(15, -10, 40).map(val => val - 15);
  return {
    series: [{
      data: data
    }],
    chart: {
      type: 'area',
      height: 80,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        speed: 800
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.4,
        // gradientToColors: [getColor('bootstrapVars', 'bodyBg', 'hex')],
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    colors: [getColor('primary', 500)],
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => 'Engagement:'
        }
      },
      marker: {
        show: false
      }
    }
  };
};
export const spark6Options = () => {
  const data = generateSparklineData(24, 10, 50);
  const colors = data.map(value => {
    if (value >= 40) return getColor('primary', 500);
    if (value >= 30) return getColor('primary', 100);
    if (value >= 20) return getColor('danger', 500);
    return getColor('warning', 500);
  });
  return {
    series: [{
      data: data
    }],
    chart: {
      type: 'bar',
      height: 80,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        speed: 800
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '80%',
        distributed: true
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => 'Conversion:'
        }
      },
      marker: {
        show: false
      }
    }
  };
};