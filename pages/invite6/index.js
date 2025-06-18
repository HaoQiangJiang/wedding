const {
  shared,
  Easing,
  timing,
  delay,
  repeat
} = wx.worklet;
Component({
  properties: {
    info: Object
  },
  lifetimes: {
    ready() {
      console.log(this.properties.info)
      this.setData({
        year: this.properties.info.year,
        month: this.properties.info.month,
        selectedDay: this.properties.info.day,
      })
      this.generateCalendar()
      this.startAnimation()
    }
  },

  data: {
    date: '',
    year: 2025,
    month: 5,
    selectedDay: 10,
    weekdays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    days: []
  },

  methods: {
    generateCalendar() {
      const {
        year,
        month
      } = this.data;
      const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 获取当月第一天是周几
      const totalDays = new Date(year, month, 0).getDate(); // 获取当月天数
      let daysArray = new Array(firstDayOfMonth - 1).fill(0); // 空白填充

      for (let i = 1; i <= totalDays; i++) {
        daysArray.push(i);
      }

      this.setData({
        days: daysArray
      });
    },

    resetAnimation() {
      this.initAnimatedStyles()
    },
    initAnimatedStyles() {
      this.dateLoveScale = shared(0.9)
      this.applyAnimatedStyle('.date-love', () => {
        'worklet';
        return {
          transform: `scale(${this.dateLoveScale.value}) `,
        };
      });
    },

    startAnimation() {
      this.initAnimatedStyles();
      this.dateLoveScale.value = delay(0, repeat(
        timing(1.1, {
          duration: 1000,
          easing: Easing.ease
        }),
        -1,
        true
      ));
    }
  }
});